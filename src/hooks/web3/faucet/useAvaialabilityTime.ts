import FaucetABI from "@/abis/faucet/FaucetABI";
import { wagmiConfig } from "@/configs/wagmi";
import { HexAddress } from "@/types/web3/general/address";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseAvailabilityTimeOptions {
    debounceTime?: number;
    enabled?: boolean;
}

interface UseAvailabilityTimeResult {
    availabilityTime: bigint | undefined;
    loading: boolean;
    error: Error | null;
    refreshAvailabilityTime: () => Promise<void>;
    isStale: boolean;
}

export const useAvailabilityTime = (
    faucetAddress: HexAddress,
    options: UseAvailabilityTimeOptions = {}
): UseAvailabilityTimeResult => {
    const { debounceTime = 1000, enabled = true } = options;

    const [availabilityTime, setAvailabilityTime] = useState<bigint | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isStale, setIsStale] = useState(false);

    const debounceTimeRef = useRef(debounceTime);

    useEffect(() => {
        debounceTimeRef.current = debounceTime;
    }, [debounceTime]);

    const fetchAvailabilityTime = useCallback(async () => {
        if (!faucetAddress || !enabled) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setIsStale(false);

        try {
            const result = await readContract(wagmiConfig, {
                address: faucetAddress,
                abi: FaucetABI,
                functionName: 'getAvailabilityTime',
                args: [],
            });

            setAvailabilityTime(result as bigint);
        } catch (err: unknown) {
            const error = err instanceof Error
                ? err
                : new Error('Failed to fetch availabilityTime');

            setError(error);
            console.error('Error fetching M0 availabilityTime:', error);
        } finally {
            setLoading(false);
        }
    }, [faucetAddress, enabled]);

    const refreshAvailabilityTime = useCallback(async () => {
        await fetchAvailabilityTime();
    }, [fetchAvailabilityTime]);

    useEffect(() => {
        setIsStale(true);
    }, [faucetAddress]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (enabled) {
            fetchAvailabilityTime();
            intervalId = setInterval(() => {
                refreshAvailabilityTime();
            }, 5000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchAvailabilityTime, refreshAvailabilityTime, enabled]);

    return {
        availabilityTime,
        loading,
        error,
        refreshAvailabilityTime,
        isStale,
    };
};

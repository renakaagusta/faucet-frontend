import FaucetABI from "@/abis/faucet/FaucetABI";
import { wagmiConfig } from "@/configs/wagmi";
import { HexAddress } from "@/types/web3/general/address";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseLastRequestTimeOptions {
    debounceTime?: number;
    enabled?: boolean;
}

interface UseLastRequestTimeResult {
    lastRequestTime: bigint | undefined;
    loading: boolean;
    error: Error | null;
    refreshLastRequestTime: () => Promise<void>;
    isStale: boolean;
}

export const useLastRequestTime = (
    userAddress: HexAddress,
    faucetAddress: HexAddress,
    options: UseLastRequestTimeOptions = {}
): UseLastRequestTimeResult => {
    const { debounceTime = 1000, enabled = true } = options;

    const [lastRequestTime, setLastRequestTime] = useState<bigint | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isStale, setIsStale] = useState(false);

    const debounceTimeRef = useRef(debounceTime);

    useEffect(() => {
        debounceTimeRef.current = debounceTime;
    }, [debounceTime]);

    const fetchLastRequestTime = useCallback(async () => {
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
                functionName: 'lastRequestTime',
                args: [userAddress],
            });

            setLastRequestTime(result as bigint);
        } catch (err: unknown) {
            const error = err instanceof Error
                ? err
                : new Error('Failed to fetch lastRequestTime');

            setError(error);
            console.error('Error fetching M0 lastRequestTime:', error);
        } finally {
            setLoading(false);
        }
    }, [faucetAddress, enabled]);

    const refreshLastRequestTime = useCallback(async () => {
        await fetchLastRequestTime();
    }, [fetchLastRequestTime]);

    useEffect(() => {
        setIsStale(true);
    }, [faucetAddress]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (enabled) {
            fetchLastRequestTime();
            intervalId = setInterval(() => {
                refreshLastRequestTime();
            }, 5000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchLastRequestTime, refreshLastRequestTime, enabled]);

    return {
        lastRequestTime,
        loading,
        error,
        refreshLastRequestTime,
        isStale,
    };
};

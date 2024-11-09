import FaucetABI from "@/abis/faucet/FaucetABI";
import { wagmiConfig } from "@/configs/wagmi";
import { HexAddress } from "@/types/web3/general/address";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseFaucetCooldownOptions {
    debounceTime?: number;
    enabled?: boolean;
}

interface UseFaucetCooldownResult {
    faucetCooldown: bigint | undefined;
    loading: boolean;
    error: Error | null;
    refreshFaucetCooldown: () => Promise<void>;
    isStale: boolean;
}

export const useFaucetCooldown = (
    faucetAddress: HexAddress,
    options: UseFaucetCooldownOptions = {}
): UseFaucetCooldownResult => {
    const { debounceTime = 1000, enabled = true } = options;

    const [faucetCooldown, setFaucetCooldown] = useState<bigint | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isStale, setIsStale] = useState(false);

    const debounceTimeRef = useRef(debounceTime);

    useEffect(() => {
        debounceTimeRef.current = debounceTime;
    }, [debounceTime]);

    const fetchFaucetCooldown = useCallback(async () => {
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
                functionName: 'faucetCooldown',
                args: [],
            });

            setFaucetCooldown(result as bigint);
        } catch (err: unknown) {
            const error = err instanceof Error
                ? err
                : new Error('Failed to fetch faucetCooldown');

            setError(error);
            console.error('Error fetching M0 faucetCooldown:', error);
        } finally {
            setLoading(false);
        }
    }, [faucetAddress, enabled]);

    const refreshFaucetCooldown = useCallback(async () => {
        await fetchFaucetCooldown();
    }, [fetchFaucetCooldown]);

    useEffect(() => {
        setIsStale(true);
    }, [faucetAddress]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (enabled) {
            fetchFaucetCooldown();
            intervalId = setInterval(() => {
                refreshFaucetCooldown();
            }, 5000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchFaucetCooldown, refreshFaucetCooldown, enabled]);

    return {
        faucetCooldown,
        loading,
        error,
        refreshFaucetCooldown,
        isStale,
    };
};

import ERC20ABI from "@/abis/tokens/IDRTABI";
import { wagmiConfig } from "@/configs/wagmi";
import { HexAddress } from "@/types/web3/general/address";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseAvailableTokensOptions {
    debounceTime?: number;
    enabled?: boolean;
}

interface UseAvailableTokensResult {
    availableTokens: bigint | undefined;
    loading: boolean;
    error: Error | null;
    refreshAvailableTokens: () => Promise<void>;
    isStale: boolean;
}

export const useAvailableTokens = (
    index: number,
    faucetAddress: HexAddress,
    options: UseAvailableTokensOptions = {}
): UseAvailableTokensResult => {
    const { debounceTime = 1000, enabled = true } = options;

    const [availableTokens, setAvailableTokens] = useState<bigint | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isStale, setIsStale] = useState(false);

    const debounceTimeRef = useRef(debounceTime);

    useEffect(() => {
        debounceTimeRef.current = debounceTime;
    }, [debounceTime]);

    const fetchAvailableTokens = useCallback(async () => {
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
                abi: ERC20ABI,
                functionName: 'availableTokens',
                args: [index],
            });

            setAvailableTokens(result as bigint);
        } catch (err: unknown) {
            const error = err instanceof Error
                ? err
                : new Error('Failed to fetch availableTokens');

            setError(error);
            console.error('Error fetching M0 availableTokens:', error);
        } finally {
            setLoading(false);
        }
    }, [faucetAddress, enabled]);

    const refreshAvailableTokens = useCallback(async () => {
        await fetchAvailableTokens();
    }, [fetchAvailableTokens]);

    useEffect(() => {
        setIsStale(true);
    }, [faucetAddress]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (enabled) {
            fetchAvailableTokens();
            intervalId = setInterval(() => {
                refreshAvailableTokens();
            }, 5000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchAvailableTokens, refreshAvailableTokens, enabled]);

    return {
        availableTokens,
        loading,
        error,
        refreshAvailableTokens,
        isStale,
    };
};

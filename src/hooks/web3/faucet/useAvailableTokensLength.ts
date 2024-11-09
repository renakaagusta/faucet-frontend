import ERC20ABI from "@/abis/tokens/IDRTABI";
import { wagmiConfig } from "@/configs/wagmi";
import { HexAddress } from "@/types/web3/general/address";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseAvailableTokensLengthOptions {
    debounceTime?: number;
    enabled?: boolean;
}

interface UseAvailableTokensLengthResult {
    availableTokensLength: bigint | undefined;
    loading: boolean;
    error: Error | null;
    refreshAvailableTokensLength: () => Promise<void>;
    isStale: boolean;
}

export const useAvailableTokensLength = (
    faucetAddress: HexAddress,
    options: UseAvailableTokensLengthOptions = {}
): UseAvailableTokensLengthResult => {
    const { debounceTime = 1000, enabled = true } = options;

    const [availableTokensLength, setAvailableTokensLength] = useState<bigint | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isStale, setIsStale] = useState(false);

    const debounceTimeRef = useRef(debounceTime);

    useEffect(() => {
        debounceTimeRef.current = debounceTime;
    }, [debounceTime]);

    const fetchAvailableTokensLength = useCallback(async () => {
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
                functionName: 'availableTokensLength',
                args: [],
            });

            setAvailableTokensLength(result as bigint);
        } catch (err: unknown) {
            const error = err instanceof Error
                ? err
                : new Error('Failed to fetch availableTokensLength');

            setError(error);
            console.error('Error fetching M0 availableTokensLength:', error);
        } finally {
            setLoading(false);
        }
    }, [faucetAddress, enabled]);

    const refreshAvailableTokensLength = useCallback(async () => {
        await fetchAvailableTokensLength();
    }, [fetchAvailableTokensLength]);

    useEffect(() => {
        setIsStale(true);
    }, [faucetAddress]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (enabled) {
            fetchAvailableTokensLength();
            intervalId = setInterval(() => {
                refreshAvailableTokensLength();
            }, 5000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchAvailableTokensLength, refreshAvailableTokensLength, enabled]);

    return {
        availableTokensLength,
        loading,
        error,
        refreshAvailableTokensLength,
        isStale,
    };
};

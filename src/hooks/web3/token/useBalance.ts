import ERC20ABI from "@/abis/tokens/IDRTABI";
import { wagmiConfig } from "@/configs/wagmi";
import { HexAddress } from "@/types/web3/general/address";
import { readContract } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseBalanceOptions {
    debounceTime?: number;
    enabled?: boolean;
}

interface UseBalanceResult {
    balance: bigint | undefined;
    loading: boolean;
    error: Error | null;
    refreshBalance: () => Promise<void>;
    isStale: boolean;
}

export const useBalance = (
    userAddress: HexAddress,
    tokenAddress: HexAddress,
    options: UseBalanceOptions = {}
): UseBalanceResult => {
    const { debounceTime = 1000, enabled = true } = options;

    const [balance, setBalance] = useState<bigint | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isStale, setIsStale] = useState(false);

    const debounceTimeRef = useRef(debounceTime);

    useEffect(() => {
        debounceTimeRef.current = debounceTime;
    }, [debounceTime]);

    const fetchBalance = useCallback(async () => {
        if (!userAddress || !tokenAddress || !enabled) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setIsStale(false);

        try {
            const result = await readContract(wagmiConfig, {
                address: tokenAddress,
                abi: ERC20ABI,
                functionName: 'balanceOf',
                args: [userAddress],
            });

            setBalance(result as bigint);
        } catch (err: unknown) {
            const error = err instanceof Error
                ? err
                : new Error('Failed to fetch balance');

            setError(error);
            console.error('Error fetching M0 balance:', error);
        } finally {
            setLoading(false);
        }
    }, [userAddress, tokenAddress, enabled]);

    const refreshBalance = useCallback(async () => {
        await fetchBalance();
    }, [fetchBalance]);

    useEffect(() => {
        setIsStale(true);
    }, [userAddress, tokenAddress]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (enabled) {
            fetchBalance();
            intervalId = setInterval(() => {
                refreshBalance();
            }, 5000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchBalance, refreshBalance, enabled]);

    return {
        balance,
        loading,
        error,
        refreshBalance,
        isStale,
    };
};

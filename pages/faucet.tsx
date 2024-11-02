import { Button } from "@/components/button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select/select";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import * as z from "zod";
import { contractABI, contractAddress } from "../lib/contract.config";
import TokenEnum from "../lib/enums/token.enum";

const faucetSchema = z.object({
  token: z.string().min(1),
});

const Home: NextPage = () => {
  const form = useForm<z.infer<typeof faucetSchema>>({
    resolver: zodResolver(faucetSchema),
    defaultValues: {
      token: "",
    },
  });
  const { watch } = form;
  const watchedFields = watch(["token"]);

  const networkOptions = [
    {
      title: "Ethereum",
      value: "ethereum",
    },
  ];
  const tokenOptions = [
    {
      title: "Rupiah",
      value: "IDR",
    },
  ];

  const { address, isConnected } = useAccount();
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [balance, setBalance] = useState<string>("-");
  const [lastRequestTime, setLastRequestTime] = useState<TokenEnum>();

  const [dialogTitle, setDialogTitle] = useState<string>();
  const [dialogDescription, setDialogDescription] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const {
    data: rupiahBalanceData,
    isError: isRupiahBalanceError,
    isLoading: isRupiahBalanceLoading,
  } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: "balanceOf",
    args: [address],
    watch: true,
    enabled: isConnected && selectedToken === TokenEnum.Rupiah,
  });

  const {
    config: rupiahTransferPrepareConfig,
    refetch: rupiahTransferRefetch,
  } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "requestTokens",
    args: [],
    enabled: false,
  });

  const {
    write: rupiahTransferWrite,
    isLoading: isRupiahTransferLoading,
    isSuccess: isRupiahTransferSuccess,
    isError: isRupiahTransferError,
    data: rupiahTransferData,
  } = useContractWrite(rupiahTransferPrepareConfig);

  const onSubmit = async (values: z.infer<typeof faucetSchema>) => {
    const { token } = values;
    switch (token) {
      case TokenEnum.Rupiah:
        try {
          await rupiahTransferRefetch();
          rupiahTransferWrite?.();
        } catch (e) {
          console.log("error", e);
        }
        break;
    }
  };

  useEffect(() => {
    if (!selectedToken) {
      return;
    }

    switch (selectedToken) {
      case TokenEnum.Rupiah:
        setBalance(String(rupiahBalanceData));
        break;
    }
  }, [selectedToken, rupiahBalanceData]);

  useEffect(() => {
    setSelectedToken(watchedFields[0]);
  }, [watchedFields]);

  useEffect(() => {
    if (isDialogOpen) {
      return;
    }

    if (!isRupiahTransferSuccess && !isRupiahTransferError) {
      return;
    }

    setIsDialogOpen(true);

    if (isRupiahTransferSuccess) {
      setDialogTitle("Success");
      setDialogDescription("Token has been transferred");
    }

    if (isRupiahTransferError) {
      setDialogTitle("Failed");
      setDialogDescription(
        "Please waiting for a while after requesting some tokens"
      );
    }
  }, [isDialogOpen, isRupiahTransferSuccess, isRupiahTransferError]);

  return (
    <main>
      <Dialog open={isDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {isConnected && (
        <div className="rounded-lg p-4 flex flex-col justify-between w-[70vw]">
          <p className="text-xl font-bold">Get Tokens</p>
          <p className="text-sm text-gray-400">
            Get tokens to test my web3 applications
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onError={(e) => {
                console.log(e);
              }}
              className="mt-3 space-y-5"
            >
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select token" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tokenOptions.map((token) => (
                          <SelectItem key={token.title} value={token.value}>
                            {token.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p>Current balance: {balance}</p>
              <Button variant="outline" type="submit">
                Send Request
              </Button>
            </form>
          </Form>
        </div>
      )}
    </main>
  );
};

export default Home;

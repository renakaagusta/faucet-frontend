import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./column-header";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import RequestToken from "@/types/web3/faucet/request-token";

export type TransactionHistoryRow = RequestToken;

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Copied to clipboard!')
  }).catch(err => {
    toast.error(`Failed to copy to clipboard! ${err}`)
  });
};

export function requestTokenColumns(): ColumnDef<TransactionHistoryRow>[] {
  return [
    {
      id: "number",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="#"
        />
      ),
      cell: ({ row }) => <div className="w-12 py-2">{row.index + 1}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="ID"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center truncate w-fit justify-between">
          <span className="mr-2">{row.original.id}</span>
          <button
            onClick={() => copyToClipboard(row.original.id)}
            aria-label="Copy to clipboard"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Copy size={16} />
          </button>
        </div>
      ),
    },
    {
      accessorKey: "blockNumber",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Block Number"
        />
      ),
      cell: ({ row }) => <div>{row.original.blockNumber}</div>,
    },
    {
      accessorKey: "blockTimestamp",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Timestamp"
        />
      ),
      cell: ({ row }) => <div>{row.original.blockTimestamp}</div>,
    },
    {
      accessorKey: "transactionHash",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Transaction Hash"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center truncate w-fit justify-between">
          <span className="mr-2">{row.original.transactionHash}</span>
          <button
            onClick={() => copyToClipboard(String(row.original.transactionHash))}
            aria-label="Copy to clipboard"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Copy size={16} />
          </button>
        </div>
      ),
    },
    {
      accessorKey: "token",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Token"
        />
      ),
      cell: ({ row }) => <div>{row.original.token}</div>,
    },
    {
      accessorKey: "receiver",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="User"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center truncate w-fit justify-between">
          <span className="mr-2">{row.original.receiver}</span>
          <button
            onClick={() => copyToClipboard(row.original.receiver)}
            aria-label="Copy to clipboard"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Copy size={16} />
          </button>
        </div>
      ),
    },
  ];
}
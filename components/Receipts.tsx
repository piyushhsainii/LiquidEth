"use client";

import {
  DollarSign,
  Copy,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Hash,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAccount } from "wagmi";
import { toast } from "sonner";

interface Txns {
  wallet_address: string;
  txn: string;
  blockHash: string;
  status: string;
}

export default function ReceiptsComponent() {
  const [isFetchingReceipts, setisFetchingReceipts] = useState(false);
  const [Txns, setTxns] = useState<Txns[] | null>(null);
  const { address } = useAccount();

  const getReceipts = async () => {
    setisFetchingReceipts(true);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("txns")
      .select("*")
      .eq("wallet_address", address);
    if (error) {
      return toast("Error occured while fetching receipts");
    }
    setisFetchingReceipts(false);
    setTxns(data);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const truncateHash = (hash: string, start = 6, end = 4) => {
    if (!hash) return "";
    return `${hash.slice(0, start)}...${hash.slice(-end)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    getReceipts();
  }, []);

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/60 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-400" />
          Transaction Receipts
          <Badge
            variant="secondary"
            className="ml-auto bg-gray-800 text-gray-300"
          >
            {Txns?.length || 0} transactions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="space-y-4 p-6">
            {Txns?.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No transactions found</p>
              </div>
            ) : (
              Txns?.map((dt, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(dt.status)}
                      <Badge className={getStatusColor(dt.status)}>
                        {dt.status?.charAt(0).toUpperCase() +
                          dt.status?.slice(1)}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-400"></span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Wallet className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 min-w-[80px]">
                        Wallet:
                      </span>
                      <code className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300 flex-1">
                        {truncateHash(dt.wallet_address)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        onClick={() => copyToClipboard(dt.wallet_address)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 min-w-[80px]">
                        Txn Hash:
                      </span>
                      <code className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300 flex-1">
                        {truncateHash(dt.txn)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        onClick={() => copyToClipboard(dt.txn)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        onClick={() =>
                          window.open(
                            `https://etherscan.io/tx/${dt.txn}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Block Hash */}
                    {dt.blockHash && (
                      <div className="flex items-center gap-2 text-sm">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 min-w-[80px]">
                          Block:
                        </span>
                        <code className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300 flex-1">
                          {truncateHash(dt.blockHash)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard(dt.blockHash)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {idx < Txns?.length - 1 && (
                    <Separator className="mt-4 bg-gray-700/50" />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

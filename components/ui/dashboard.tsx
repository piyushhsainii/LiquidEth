"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wallet, Gift, Zap, Shield, LogOut } from "lucide-react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { getEthInUsd } from "@/lib/helpers";
import { ABIStakingContract } from "@/lib/ABI";
import { parseEther } from "viem";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";
import { config } from "@/config";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";
import Portfolio from "../Portfolio";
import ReceiptsComponent from "../Receipts";
import Rewards from "../Rewards";

interface DashboardProps {
  walletAddress: `0x${string}` | undefined;
}
interface Txns {
  wallet_address: string;
  txn: string;
  blockHash: string;
  status: string;
}

export function Dashboard({ walletAddress }: DashboardProps) {
  const [stakeAmount, setStakeAmount] = useState("");
  const [UsdValue, setUsdValue] = useState<null | number>(null);
  const [isStaking, setIsStaking] = useState(false);
  const { status, address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const STAKING_CONTRACT = "0xe442ac7Bd4Bbc114f1FA8588DAC43f4098c7058C";

  const handleStake = async () => {
    setIsStaking(true);

    try {
      const tx = await writeContract(config, {
        abi: ABIStakingContract,
        address: STAKING_CONTRACT,
        functionName: "stake",
        account: address,
        value: ethToWei(stakeAmount),
      });

      console.log("Transaction:", tx);

      toast("ETH Staked Successfully!");
      const receipt = await waitForTransactionReceipt(config, {
        hash: tx,
      });
      const supabase = await createClient();
      const { data: receiptData } = await supabase.from("txns").insert({
        wallet_address: address,
        txn: tx,
        blockHash: receipt.blockHash,
        status: receipt.status,
      });
      toast("Added the transaction in the receipts log!");
      console.log("Receipt:", receipt);
    } catch (err) {
      console.error("Staking failed:", err);
    } finally {
      setIsStaking(false);
    }
  };

  // Now this function just triggers a refetch

  const logoutHandler = async () => {
    disconnect();
    router.refresh();
  };

  const ethToWei = (eth: string | number) => {
    return parseEther(eth.toString()); // returns bigint
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      const eth = parseFloat(stakeAmount);
      if (!isNaN(eth) && eth > 0) {
        getEthInUsd(eth).then(setUsdValue);
      } else {
        setUsdValue(null);
      }
    }, 1000); // 1 second debounce
    return () => clearTimeout(handler); // Clear timeout on change
  }, [stakeAmount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black animate-in fade-in duration-700">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm animate-in slide-in-from-top duration-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">LiquidETH</h1>
                <p className="text-gray-400 text-sm">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="border-green-500 text-green-400 bg-green-500/10 animate-pulse"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                Connected
              </Badge>
              {walletAddress && (
                <>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </Button>
                </>
              )}
              <Button
                onClick={logoutHandler}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-in slide-in-from-top duration-700 delay-200">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back!</h2>
          <p className="text-gray-400">
            Manage your ETH staking and track your rewards
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Staking Section */}
          <div className="space-y-6 animate-in slide-in-from-left duration-700 delay-300">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  Stake ETH
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Stake your ETH to earn rewards and help secure the network
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stake-amount" className="text-gray-300">
                    Amount (ETH)
                  </Label>
                  <Input
                    id="stake-amount"
                    type="number"
                    placeholder="0.0"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 transition-all duration-300"
                  />
                </div>
                {UsdValue !== null ? (
                  <p className="text-sm text-green-400">
                    ≈ ${UsdValue.toLocaleString()}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    Enter an ETH amount to view the USD equivalent
                  </p>
                )}
                <Button
                  onClick={handleStake}
                  disabled={
                    !stakeAmount ||
                    Number.parseFloat(stakeAmount) <= 0 ||
                    isStaking
                  }
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
                >
                  {isStaking ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Staking...
                    </div>
                  ) : (
                    "Stake ETH"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Portfolio Overview */}
            <Portfolio />
          </div>
          {/* Rewards Section */}
          <div className="space-y-6 animate-in slide-in-from-right duration-700 delay-500">
            <Rewards />
            <ReceiptsComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

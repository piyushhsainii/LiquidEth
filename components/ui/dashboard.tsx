"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Shield, LogOut } from "lucide-react";
import { useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import Portfolio from "../Portfolio";
import ReceiptsComponent from "../Receipts";
import Rewards from "../Rewards";
import StakeETH from "../StakeETH";

interface DashboardProps {
  walletAddress: `0x${string}` | undefined;
}

export function Dashboard({ walletAddress }: DashboardProps) {
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const logoutHandler = async () => {
    disconnect();
    router.refresh();
  };

  return (
    <div className="min-h-screen  animate-in fade-in duration-700">
      {/* Navigation */}
      <nav className="border-b border-gray-800  animate-in slide-in-from-top duration-500">
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
            <StakeETH />
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

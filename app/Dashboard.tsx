"use client";

import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  TrendingUp,
  Gift,
  Zap,
  Shield,
  DollarSign,
} from "lucide-react";

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakedAmount, setStakedAmount] = useState("2.5");
  const [rewards, setRewards] = useState("0.125");
  const [isStaking, setIsStaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isCheckingRewards, setIsCheckingRewards] = useState(false);

  const connectWallet = async () => {
    // Simulate wallet connection
    setIsConnected(true);
    setWalletAddress("0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e");
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
  };

  const handleStake = async () => {
    if (!stakeAmount || Number.parseFloat(stakeAmount) <= 0) return;

    setIsStaking(true);
    // Simulate staking transaction
    setTimeout(() => {
      setStakedAmount((prev) =>
        (Number.parseFloat(prev) + Number.parseFloat(stakeAmount)).toString()
      );
      setStakeAmount("");
      setIsStaking(false);
    }, 2000);
  };

  const checkRewards = async () => {
    setIsCheckingRewards(true);
    // Simulate checking rewards
    setTimeout(() => {
      const newRewards = (Math.random() * 0.5 + 0.1).toFixed(3);
      setRewards(newRewards);
      setIsCheckingRewards(false);
    }, 1500);
  };

  const claimRewards = async () => {
    if (Number.parseFloat(rewards) <= 0) return;

    setIsClaiming(true);
    // Simulate claiming rewards
    setTimeout(() => {
      setRewards("0.000");
      setIsClaiming(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ETH Staking</h1>
              <p className="text-gray-400 text-sm">
                Secure • Decentralized • Profitable
              </p>
            </div>
          </div>

          {!isConnected ? (
            <Button
              onClick={connectWallet}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="border-green-500 text-green-400 bg-green-500/10"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                Connected
              </Badge>
              <Button
                variant="outline"
                onClick={disconnectWallet}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Button>
            </div>
          )}
        </div>

        {!isConnected ? (
          <Card className="max-w-md mx-auto bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-white">Connect Your Wallet</CardTitle>
              <CardDescription className="text-gray-400">
                Connect your Ethereum wallet to start staking and earning
                rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={connectWallet}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Staking Section */}
            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
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
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current APY</span>
                    <span className="text-green-400 font-semibold">5.2%</span>
                  </div>
                  <Button
                    onClick={handleStake}
                    disabled={
                      !stakeAmount ||
                      Number.parseFloat(stakeAmount) <= 0 ||
                      isStaking
                    }
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold disabled:opacity-50"
                  >
                    {isStaking ? "Staking..." : "Stake ETH"}
                  </Button>
                </CardContent>
              </Card>

              {/* Portfolio Overview */}
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Portfolio Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-white">
                        {stakedAmount}
                      </div>
                      <div className="text-sm text-gray-400">ETH Staked</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">
                        $
                        {(
                          Number.parseFloat(stakedAmount) * 3200
                        ).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">USD Value</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rewards Section */}
            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Gift className="w-5 h-5 text-green-400" />
                    Rewards
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Check and claim your staking rewards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {rewards} ETH
                    </div>
                    <div className="text-sm text-gray-400 mb-4">
                      Available Rewards
                    </div>
                    <div className="text-lg text-gray-300">
                      ${(Number.parseFloat(rewards) * 3200).toFixed(2)} USD
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={checkRewards}
                      disabled={isCheckingRewards}
                      variant="outline"
                      className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
                    >
                      {isCheckingRewards ? "Checking..." : "Check Rewards"}
                    </Button>
                    <Button
                      onClick={claimRewards}
                      disabled={Number.parseFloat(rewards) <= 0 || isClaiming}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold disabled:opacity-50"
                    >
                      {isClaiming ? "Claiming..." : "Claim Rewards"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Staking Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Earned</span>
                      <span className="text-white font-semibold">
                        0.847 ETH
                      </span>
                    </div>
                    <Separator className="bg-gray-800" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Days Staking</span>
                      <span className="text-white font-semibold">42</span>
                    </div>
                    <Separator className="bg-gray-800" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Next Reward</span>
                      <span className="text-green-400 font-semibold">
                        ~2 hours
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

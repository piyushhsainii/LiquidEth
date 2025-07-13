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
import { Wallet, Shield, Zap, TrendingUp, ArrowRight } from "lucide-react";
import { useConnect } from "wagmi";
import { metaMask } from "wagmi/connectors";

export function ConnectWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { connect } = useConnect();

  const handleConnect = async () => {
    connect({ connector: metaMask() });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-700">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-1000 delay-200 [animation-fill-mode:both]">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center animate-in zoom-in duration-1000 delay-300 [animation-fill-mode:both]">
              <Shield className="w-8 h-8 text-black" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text ">
            Liquid ETH
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Secure, decentralized, and profitable ETH Staking Protocol. Start
            earning rewards by staking your ETH today.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Features */}
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-1000 delay-500 [animation-fill-mode:both]">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50 backdrop-blur-sm hover:bg-gray-900/50 transition-all duration-300 shadow-sm shadow-green-400/50 hover:shadow-md ">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">High APY</h3>
                  <p className="text-gray-400 text-sm">
                    Earn up to 5.2% annual rewards
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50 backdrop-blur-sm hover:bg-gray-900/50 transition-all duration-300 shadow-sm shadow-green-400/50 hover:shadow-md ">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Secure Protocol</h3>
                  <p className="text-gray-400 text-sm">
                    Audited smart contracts
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50 backdrop-blur-sm hover:bg-gray-900/50 transition-all duration-300 shadow-sm shadow-green-400/50 hover:shadow-md ">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">
                    Real-time Rewards
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Track and claim rewards instantly
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Connect Wallet Card */}
          <div className="animate-in fade-in slide-in-from-right duration-1000 delay-700 [animation-fill-mode:both]">
            <Card className="bg-white/10 border border-white/20 backdrop-blur-2xl shadow-xl rounded-2xl">
              <CardHeader className="text-center pb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Wallet className="w-10 h-10 text-black" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">
                  Connect Your Wallet
                </CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Connect your Ethereum wallet to start staking and earning
                  rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button
                  onClick={() => connect({ connector: metaMask() })}
                  disabled={isConnecting}
                  className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:transform-none"
                >
                  {isConnecting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Connecting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      Connect Wallet
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By connecting, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

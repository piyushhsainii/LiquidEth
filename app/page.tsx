"use client";

import { useEffect, useState } from "react";
import { ConnectWallet } from "@/components/ui/connect-wallet";
import { Dashboard } from "@/components/ui/dashboard";
import { useAccount } from "wagmi";
import { createClient } from "@/lib/supabase";

export default function Component() {
  const { isConnected: status, address, isConnecting } = useAccount();
  const addToDB = async () => {
    if (!address) return;
    const supabase = await createClient();
    const { data } = await supabase
      .from("liquidETH")
      .select("*")
      .eq("wallet_address", address)
      .single();
    if (!data) {
      const { data } = await supabase.from("liquidETH").insert({
        wallet_address: address,
      });
    }
  };

  useEffect(() => {
    addToDB();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-black flex items-center justify-center mx-auto ">
      <div className="container mx-auto px-4 py-8">
        {isConnecting ? (
          <div className="flex items-center justify-center min-h-screen ">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-400"></div>
          </div>
        ) : !status ? (
          <ConnectWallet />
        ) : (
          <Dashboard walletAddress={address} />
        )}
      </div>
    </div>
  );
}

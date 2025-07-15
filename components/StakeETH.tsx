import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Zap } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { config } from "@/config";
import { ABIStakingContract } from "@/lib/ABI";
import { useAccount, useDisconnect } from "wagmi";
import { getEthInUsd } from "@/lib/helpers";
import { parseEther } from "ethers";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { STAKING_ADDRESS } from "@/lib/Address";

const StakeETH = () => {
  const [unstakeUsdValue, setunstakeUsdValue] = useState<string | null>(null);
  const [unstakeAmount, setunstakeAmount] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [isUnstaking, setisUnstaking] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const { status, address, isConnected } = useAccount();
  const [UsdValue, setUsdValue] = useState<null | number>(null);
  const [UsdValue2, setUsdValue2] = useState<null | number>(null);
  const router = useRouter();

  const handleStake = async () => {
    setIsStaking(true);

    try {
      const tx = await writeContract(config, {
        abi: ABIStakingContract,
        address: STAKING_ADDRESS,
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
      router.refresh();
      console.log("Receipt:", receipt);
    } catch (err) {
      console.error("Staking failed:", err);
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnStake = async () => {
    setisUnstaking(true);
    const unstakeAmountParsed = ethToWei(unstakeAmount!);
    console.log(unstakeAmount);

    const tx = await writeContract(config, {
      abi: ABIStakingContract,
      address: STAKING_ADDRESS,
      functionName: "unstake",
      account: address,
      args: [unstakeAmountParsed],
    });

    console.log("Transaction:", tx);

    try {
      const receipt = await waitForTransactionReceipt(config, {
        hash: tx,
      });

      const supabase = await createClient();
      const { data: receiptData, error } = await supabase.from("txns").insert({
        wallet_address: address,
        txn: tx,
        blockHash: receipt.blockHash,
        status: receipt.status,
      });
      toast("ETH Unstaked Successfully!");
      toast("Added the transaction in the receipts log!");
      router.refresh();
      console.log("Receipt:", receipt);
      // toast(err);
      setisUnstaking(false);
    } catch (error) {
      console.log(error, "L");
      toast("Transaction reverted! Try again");
      setisUnstaking(false);
    }
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
    const handler2 = setTimeout(() => {
      const eth = parseFloat(unstakeAmount);
      if (!isNaN(eth) && eth > 0) {
        getEthInUsd(eth).then(setUsdValue2);
      } else {
        setUsdValue(null);
      }
    }, 1000); // 1 second debounce

    return () => {
      clearTimeout(handler);
      clearTimeout(handler2);
    }; // Clear timeout on change
  }, [stakeAmount, unstakeAmount]);

  return (
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
            !stakeAmount || Number.parseFloat(stakeAmount) <= 0 || isStaking
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
        {/* Divider */}
        <div className="border-t border-gray-700"></div>

        {/* Unstake Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unstake-amount" className="text-gray-300">
              Unstake Amount (ETH)
            </Label>
            <Input
              id="unstake-amount"
              type="number"
              placeholder="0.0"
              value={unstakeAmount ?? ""}
              onChange={(e) => setunstakeAmount(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 transition-all duration-300"
            />
          </div>
        </div>
        {UsdValue2 !== null ? (
          <p className="text-sm text-green-400">
            ≈ ${UsdValue2.toLocaleString()}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Enter an ETH amount to view the USD equivalent
          </p>
        )}
        <Button
          onClick={handleUnStake}
          disabled={
            !unstakeAmount ||
            Number.parseFloat(unstakeAmount) <= 0 ||
            isUnstaking
          }
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
        >
          {isUnstaking ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Unstaking...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Minus className="w-4 h-4" />
              Unstake ETH
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StakeETH;

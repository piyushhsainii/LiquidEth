import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CoinsIcon, Gift } from "lucide-react";
import { Button } from "./ui/button";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";
import { ABICustomToken, ABIStakingContract } from "@/lib/ABI";
import { config } from "@/config";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { STAKING_ADDRESS } from "@/lib/Address";

const Rewards = () => {
  const { address } = useAccount();
  const [rewards, setRewards] = useState<bigint | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const checkRewards = async () => {
    setisLoading(true);
    const tx = await readContract(config, {
      abi: ABIStakingContract,
      address: STAKING_ADDRESS,
      functionName: "getRewards",
      account: address,
    });
    setisLoading(false);
    console.log(tx);
    if (!tx) {
      toast("Rewards will be available soon!");
      return;
    }
    setRewards(tx as bigint);
    setisLoading(false);
  };

  const claimRewards = async () => {
    // Add your claim rewards logic here
    setIsClaiming(true);
    try {
      // Your claim logic
      const tx = await writeContract(config, {
        abi: ABIStakingContract,
        address: STAKING_ADDRESS,
        functionName: "claimRewards",
        account: address,
      });
      console.log(tx);
      if (!tx) {
        toast("Error occured while claiming rewards");
        return;
      }
      const receipt = await waitForTransactionReceipt(config, {
        hash: tx,
      });
      if (receipt.status == "success") {
        console.log("Claiming rewards...");
        toast("Rewards Claimed successfully.");
        setRewards(null);
      }
      // After successful claim, refetch rewards
      await checkRewards();
    } catch (error) {
      console.error("Error claiming rewards:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  useEffect(() => {
    checkRewards();
  }, []);

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/60 transition-all duration-300">
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
        {rewards ? (
          <div className="text-center p-6 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20 hover:from-green-500/15 hover:to-green-600/15 transition-all duration-300">
            <div className="text-3xl font-bold text-green-400 mb-2 flex justify-center items-center gap-2">
              <div>{rewards}</div>
              <div>
                {" "}
                <CoinsIcon />{" "}
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-4">Available Rewards</div>
          </div>
        ) : (
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700 text-gray-400">
            No rewards available
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => checkRewards()}
            disabled={isClaiming}
            variant="outline"
            className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                Checking...
              </div>
            ) : (
              "Check Rewards"
            )}
          </Button>
          <Button
            onClick={claimRewards}
            disabled={isClaiming}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:transform-none"
          >
            {isClaiming ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Claiming...
              </div>
            ) : (
              "Claim Rewards"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Rewards;

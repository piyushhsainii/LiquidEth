import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp } from "lucide-react";
import { formatEther } from "ethers";
import { readContract } from "wagmi/actions";
import { config } from "@/config";
import { ABIStakingContract } from "@/lib/ABI";
import { useAccount } from "wagmi";
import { getEthInUsd } from "@/lib/helpers";

const Portfolio = () => {
  const { address } = useAccount();
  const STAKING_CONTRACT = "0xe442ac7Bd4Bbc114f1FA8588DAC43f4098c7058C";
  const [stakedAmount, setStakedAmount] = useState<string | null>(null);
  const [stakedAmountUSD, setStakedAmountUSD] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState(false);
  const fetchData = async () => {
    setisLoading(true);
    const tx = await readContract(config, {
      abi: ABIStakingContract,
      functionName: "stakedAmount",
      args: [address],
      address: STAKING_CONTRACT,
    });
    if (!tx) return;
    setStakedAmount(tx as string);
    const eth = formatEther(tx as string);
    const usdPrice = await getEthInUsd(Number(eth));
    setStakedAmountUSD(JSON.stringify(usdPrice) ?? 0);

    setisLoading(false);

    console.log(tx, "Staked amount");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/60 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Portfolio Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
            <div className="text-2xl font-bold text-white">
              {isLoading
                ? "Fetching ETH staked...."
                : stakedAmount
                ? formatEther(stakedAmount)
                : "Stake ETH to start earning rewards"}
            </div>
            <div className="text-sm text-gray-400">ETH Staked</div>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
            <div className="text-2xl font-bold text-green-400">
              {isLoading
                ? "Converting staked ETH into USD...."
                : stakedAmount
                ? "$" + stakedAmountUSD
                : "$0"}
            </div>
            <div className="text-sm text-gray-400">USD Value</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Portfolio;

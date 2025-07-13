export async function getEthInUsd(ethAmount: number): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );

    if (!res.ok) {
      throw new Error("Failed to fetch ETH price");
    }

    const data = await res.json();
    const ethPrice = data.ethereum.usd;

    return parseFloat((ethAmount * ethPrice).toFixed(2));
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    return 0;
  }
}

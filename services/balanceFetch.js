import { ethers } from "ethers";
import { loadWalletAddress } from "../storage.js";

const RPC_URL = "https://sepolia.drpc.org/";
const provider = new ethers.JsonRpcProvider(RPC_URL);

async function fetchBalance() {
  try {
    const walletAddress = await loadWalletAddress();
    if (!walletAddress) {
      throw new Error("No wallet address found in secure storage");
    }

    const balance = await provider.getBalance(walletAddress);
    return {
      walletAddress,
      balance: ethers.formatEther(balance),
    };
  } catch (error) {
    console.error("Error fetching balance:", error);
    return {
      walletAddress: null,
      balance: "0",
    };
  }
}

export default fetchBalance;

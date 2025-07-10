import express from 'express';
import cors from 'cors';
import { ethers, formatEther, parseEther } from "ethers";
import axios from "axios";
import { db } from "./firebaseconfig.js";
import { collection, addDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import http from "http";
import https from "https";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const axiosInstance = axios.create({
  httpAgent: new http.Agent({ keepAlive: false }),
  httpsAgent: new https.Agent({ keepAlive: false }),
});

const provider = new ethers.JsonRpcProvider("https://sepolia.drpc.org/");

const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY || "//add default key here, removed by us ",
  provider
);

const DEFAULT_RECIPIENT = "0xBc5Fef730fEBc7432230f52868d30Fe07A3cf959";

const SUPPORTED_TOKENS = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    contractAddress: null, 
    network: 'Sepolia'
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    contractAddress: '0xA0b86a33E6417e88d9C4fE93c72D9A3B1a4F5e5b', 
    network: 'Sepolia'
  }
};


async function getPublicIP() {
  try {
    const res = await axiosInstance.get("https://api.ipify.org?format=json");
    return res.data.ip;
  } catch (err) {
    console.error("Failed to fetch IP:", err.message);
    return "Unknown";
  }
}

async function getGasPrice() {
  try {
    const gasPrice = await provider.getFeeData();
    return gasPrice.gasPrice;
  } catch (error) {
    console.error("Failed to get gas price:", error);
    return parseEther("0.00001"); 
  }
}

async function estimateGas(to, value, data = "0x") {
  try {
    const gasEstimate = await provider.estimateGas({
      to,
      value,
      data,
      from: wallet.address
    });
    return gasEstimate;
  } catch (error) {
    console.error("Failed to estimate gas:", error);
    return 21000; 
  }
}





app.get('/api/wallet/balance', async (req, res) => {
  try {
    const balance = await provider.getBalance(wallet.address);
    const balanceInEth = formatEther(balance);
    
    res.json({
      success: true,
      address: wallet.address,
      balance: balanceInEth,
      balanceWei: balance.toString()
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch wallet balance'
    });
  }
});

app.get('/api/gas', async (req, res) => {
  try {
    const feeData = await provider.getFeeData();
    
    res.json({
      success: true,
      gasPrice: feeData.gasPrice ? formatEther(feeData.gasPrice) : null,
      maxFeePerGas: feeData.maxFeePerGas ? formatEther(feeData.maxFeePerGas) : null,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? formatEther(feeData.maxPriorityFeePerGas) : null
    });
  } catch (error) {
    console.error('Error fetching gas data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch gas data'
    });
  }
});
   
app.post('/api/transaction', async (req, res) => {
  try {
    const { tokenSymbol, amount, toAddress, network } = req.body;


    if (!tokenSymbol || !amount || !toAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tokenSymbol, amount, toAddress'
      });
    }

    const token = SUPPORTED_TOKENS[tokenSymbol];
    if (!token) {
      return res.status(400).json({
        success: false,
        error: `Unsupported token: ${tokenSymbol}`
      });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount'
      });
    }

    if (!ethers.isAddress(toAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid recipient address'
      });
    }

    const balance = await provider.getBalance(wallet.address);
    const valueInWei = parseEther(amount.toString());
    
    if (balance < valueInWei) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance'
      });
    }

    const gasPrice = await getGasPrice();
    const gasLimit = await estimateGas(toAddress, valueInWei);
    const gasCost = gasPrice * gasLimit;

    if (balance < (valueInWei + gasCost)) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance for gas fees'
      });
    }

    const ip = await getPublicIP();
    const now = new Date();

    console.log(`Initiating transaction: ${amount} ${tokenSymbol} to ${toAddress}`);

    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: valueInWei,
      gasPrice: gasPrice,
      gasLimit: gasLimit
    });

    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    const logData = {
      timestamp: now.toISOString(),
      ipAddress: ip,
      walletAddress: wallet.address,
      toAddress: tx.to,
      valueSent: formatEther(tx.value),
      txHash: tx.hash,
      network: network || "Sepolia",
      gasPrice: tx.gasPrice ? tx.gasPrice.toString() : null,
      gasUsed: receipt.gasUsed ? receipt.gasUsed.toString() : null,
      blockNumber: receipt.blockNumber,
      status: receipt.status === 1 ? 'success' : 'failed',
      nonce: tx.nonce,
      tokenSymbol: tokenSymbol
    };

    try {
      await addDoc(
        collection(db, "wallets", wallet.address, "transactionHistory"),
        logData
      );
      console.log("Transaction data saved to Firestore!");
    } catch (firestoreError) {
      console.error("Error writing to Firestore:", firestoreError);
s
    }

    res.json({
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      effectiveGasPrice: receipt.effectiveGasPrice ? receipt.effectiveGasPrice.toString() : null,
      status: receipt.status === 1 ? 'success' : 'failed',
      explorerUrl: `https://sepolia.etherscan.io/tx/${tx.hash}`
    });

  } catch (error) {
    console.error('Transaction error:', error);

    let errorMessage = 'Transaction failed';
    if (error.code === 'INSUFFICIENT_FUNDS') {
      errorMessage = 'Insufficient funds for transaction';
    } else if (error.code === 'NETWORK_ERROR') {
      errorMessage = 'Network error, please try again';
    } else if (error.code === 'TIMEOUT') {
      errorMessage = 'Transaction timeout, please try again';
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details: error.message
    });
  }
});

app.get('/api/transactions/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { limit: limitParam = 10 } = req.query;

    if (!ethers.isAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid address'
      });
    }

    const transactionsRef = collection(db, "wallets", address, "transactionHistory");
    const q = query(
      transactionsRef,
      orderBy("timestamp", "desc"),
      limit(parseInt(limitParam))
    );

    const querySnapshot = await getDocs(q);
    const transactions = [];

    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      transactions,
      count: transactions.length
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction history'
    });
  }
});

app.get('/api/transaction/:hash', async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash || !hash.startsWith('0x')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid transaction hash'
      });
    }

    const tx = await provider.getTransaction(hash);
    const receipt = await provider.getTransactionReceipt(hash);

    if (!tx) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      transaction: {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: formatEther(tx.value),
        gasPrice: tx.gasPrice ? tx.gasPrice.toString() : null,
        gasLimit: tx.gasLimit ? tx.gasLimit.toString() : null,
        nonce: tx.nonce,
        blockNumber: tx.blockNumber,
        blockHash: tx.blockHash,
        status: receipt ? (receipt.status === 1 ? 'success' : 'failed') : 'pending',
        gasUsed: receipt ? receipt.gasUsed.toString() : null
      }
    });

  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction details'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    wallet: wallet.address,
    network: 'Sepolia'
  });
});

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Transaction service running on port ${PORT}`);
  console.log(`Wallet address: ${wallet.address}`);
  console.log(`Network: Sepolia`);
});

export default app;

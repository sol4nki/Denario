
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);

    if (error.response?.status === 400) {
      throw new Error(error.response.data?.error || 'Invalid request');
    } else if (error.response?.status === 500) {
      throw new Error(error.response.data?.error || 'Server error');
    } else if (error.code === 'NETWORK_ERROR') {
      throw new Error('Network error. Please check your connection.');
    } else if (error.code === 'TIMEOUT') {
      throw new Error('Request timeout. Please try again.');
    }
    
    throw new Error(error.response?.data?.error || 'Something went wrong');
  }
);

export const apiService = {

  getWalletBalance: async () => {
    try {
      const response = await api.get('/wallet/balance');
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw error;
    }
  },

  getGasPrices: async () => {
    try {
      const response = await api.get('/gas');
      return response.data;
    } catch (error) {
      console.error('Error fetching gas prices:', error);
      throw error;
    }
  },

  executeTransaction: async (transactionData) => {
    try {
      const response = await api.post('/transaction', transactionData);
      return response.data;
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw error;
    }
  },

  getTransactionHistory: async (address, limit = 10) => {
    try {
      const response = await api.get(`/transactions/${address}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  },

  getTransactionDetails: async (hash) => {
    try {
      const response = await api.get(`/transaction/${hash}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error performing health check:', error);
      throw error;
    }
  },
};

export const transactionUtils = {

  formatAmount: (amount, decimals = 18) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '0.00';
    
    if (num < 0.0001) {
      return num.toExponential(2);
    } else if (num < 1) {
      return num.toFixed(6);
    } else {
      return num.toFixed(4);
    }
  },

  calculateFee: (gasPrice, gasLimit) => {
    try {
      const fee = (parseFloat(gasPrice) * parseFloat(gasLimit)) / 1e18;
      return fee.toFixed(6);
    } catch (error) {
      console.error('Error calculating fee:', error);
      return '0.000000';
    }
  },

  formatTxHash: (hash, length = 10) => {
    if (!hash || hash.length < length) return hash;
    return `${hash.substring(0, length)}...${hash.substring(hash.length - 4)}`;
  },

  getExplorerUrl: (hash, network = 'sepolia') => {
    const baseUrls = {
      sepolia: 'https://sepolia.etherscan.io',
      mainnet: 'https://etherscan.io',
      goerli: 'https://goerli.etherscan.io',
    };
    
    const baseUrl = baseUrls[network.toLowerCase()] || baseUrls.sepolia;
    return `${baseUrl}/tx/${hash}`;
  },

  isValidAddress: (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },

  weiToEther: (wei) => {
    try {
      return (parseFloat(wei) / 1e18).toString();
    } catch (error) {
      console.error('Error converting Wei to Ether:', error);
      return '0';
    }
  },

  etherToWei: (ether) => {
    try {
      return (parseFloat(ether) * 1e18).toString();
    } catch (error) {
      console.error('Error converting Ether to Wei:', error);
      return '0';
    }
  },
};

export const ApiErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

export class ApiError extends Error {
  constructor(message, type = ApiErrorTypes.UNKNOWN_ERROR, details = null) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.details = details;
  }
}

export default apiService;
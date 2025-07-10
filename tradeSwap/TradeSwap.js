
import { ethers } from "ethers";
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  SafeAreaView,
  Modal,
  FlatList,
  Alert,
  ToastAndroid,
  Platform,
  RefreshControl,
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';
import { db } from "../firebaseconfig.js";
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import axios from "axios";
import Constants from "expo-constants";


import { loadPvtKey, loadWalletAddress } from '../storage.js';


const statusbarHeight = Platform.OS === 'android' ? Constants.statusBarHeight : 0;

const sepoliaProvider = new ethers.JsonRpcProvider("https://sepolia.drpc.org/");


// Helper function to get public IP
async function getPublicIP() {
  try {
    const res = await axios.get("https://api.ipify.org?format=json");
    return res.data.ip;
  } catch (err) {
    console.error("Failed to fetch IP:", err.message);
    return "Unknown";
  }
}

const TESTNET_TOKENS = [
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'wallet-outline',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    network: 'Sepolia',
    isNative: true
  },
  {
    id: 'weth',
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    icon: 'wallet-outline',
    address: '0xdd13E55209Fd76AfE204dBda4007C227904f0a81',
    decimals: 18,
    network: 'Sepolia',
    isNative: false
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    icon: 'card-outline',
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    decimals: 6,
    network: 'Sepolia',
    isNative: false
  },
  {
    id: 'dai',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    icon: 'card-outline',
    address: '0x68194a729C2450ad26072b3D33ADaCbcef39D574',
    decimals: 18,
    network: 'Sepolia',
    isNative: false
  },
  {
    id: 'link',
    symbol: 'LINK',
    name: 'Chainlink',
    icon: 'link-outline',
    address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    decimals: 18,
    network: 'Sepolia',
    isNative: false
  }
];

async function logTransactionToFirestore(transactionData, walletAddress) {


  try {
    const ip = await getPublicIP();
    const now = new Date();

    const logData = {
      timestamp: now.toISOString(),
      ipAddress: ip,
      walletAddress: walletAddress,
      toAddress: transactionData.toAddress,
      valueSent: transactionData.valueSent,
      txHash: transactionData.txHash,
      network: transactionData.network || "Sepolia",
      gasPrice: transactionData.gasPrice,
      gasUsed: transactionData.gasUsed,
      blockNumber: transactionData.blockNumber,
      status: transactionData.status,
      nonce: transactionData.nonce,
      tokenSymbol: transactionData.tokenSymbol,
      swapType: 'token_swap',
      fromToken: transactionData.fromToken,
      toToken: transactionData.toToken,
      amountIn: transactionData.amountIn,
      amountOut: transactionData.amountOut
    };

    await addDoc(
      collection(db, "wallets", walletAddress, "transactionHistory"),
      logData
    );
    console.log("Swap transaction logged to Firestore!");
  } catch (error) {
    console.error("Error logging to Firestore:", error);

  }
}

export const swapEthForWeth = async (wallet, amountInEth) => {
  if (!wallet) throw new Error("Wallet not connected");
  if (!amountInEth) throw new Error("Amount is required");

  const wethAddress = "0xdd13E55209Fd76AfE204dBda4007C227904f0a81"; // Sepolia WETH
  const wethAbi = [
    "function deposit() payable",
    "function balanceOf(address) view returns (uint256)"
  ];

  try {
    const wethContract = new ethers.Contract(wethAddress, wethAbi, wallet);
    const amountInWei = ethers.parseEther(amountInEth.toString());

    console.log(`Wrapping ${amountInEth} ETH to WETH...`);

    const tx = await wethContract.deposit({ value: amountInWei });
    console.log("Transaction hash:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction confirmed!");

    const balance = await wethContract.balanceOf(wallet.address);
    const formattedBalance = ethers.formatEther(balance);

    const transactionData = {
      toAddress: wethAddress,
      valueSent: ethers.formatEther(amountInWei),
      txHash: tx.hash,
      gasPrice: tx.gasPrice ? tx.gasPrice.toString() : null,
      gasUsed: receipt.gasUsed ? receipt.gasUsed.toString() : null,
      blockNumber: receipt.blockNumber,
      status: receipt.status === 1 ? 'success' : 'failed',
      nonce: tx.nonce,
      tokenSymbol: 'ETH',
      fromToken: 'ETH',
      toToken: 'WETH',
      amountIn: amountInEth.toString(),
      amountOut: formattedBalance
    };

    await logTransactionToFirestore(transactionData, wallet.address);

    return tx.hash;

  } catch (error) {
    console.error("Error performing swap:", error);

    await logTransactionToFirestore({
      toAddress: wethAddress,
      valueSent: amountInEth.toString(),
      txHash: 'failed',
      gasPrice: null,
      gasUsed: null,
      blockNumber: null,
      status: 'failed',
      nonce: null,
      tokenSymbol: 'ETH',
      fromToken: 'ETH',
      toToken: 'WETH',
      amountIn: amountInEth.toString(),
      amountOut: '0',
      error: error.message
    }, wallet.address);

    throw error;
  }
};

async function performTokenSwap(fromToken, toToken, amount, wallet) {
  try {

    if (fromToken.symbol === 'ETH' && toToken.symbol === 'WETH') {
      return await swapEthForWeth(wallet, parseFloat(amount));
    } else {
      throw new Error(`Swap from ${fromToken.symbol} to ${toToken.symbol} not yet implemented`);
    }
  } catch (error) {
    console.error("Token swap error:", error);
    throw error;
  }
}

const Trending = [
  { name: "ETH/USDC", desc: "Most traded pair", icon: 'trending-up' },
  { name: "WETH/DAI", desc: "Stable trading", icon: 'shield-checkmark' },
  { name: "LINK/ETH", desc: "Oracle token", icon: 'link' },
  { name: "USDC/DAI", desc: "Stable to stable", icon: 'card' },
  { name: "ETH/DAI", desc: "Ethereum to stable", icon: 'swap-horizontal-outline' },
];

export default function TradeSwap({ navigation }) {
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [payToken, setPayToken] = useState(TESTNET_TOKENS[0]); 
  const [receiveToken, setReceiveToken] = useState(TESTNET_TOKENS[1]); 
  const [showPayTokenModal, setShowPayTokenModal] = useState(false);
  const [showReceiveTokenModal, setShowReceiveTokenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const initWallet = async () => {
    try {
      const pvtKey = await loadPvtKey();
      const address = await loadWalletAddress();

      if (!pvtKey) {
        console.error("No private key found in secure storage");
        return;
      }

      const wallet = new ethers.Wallet(pvtKey, sepoliaProvider);
      setWallet(wallet);
      setWalletAddress(address || wallet.address);

      console.log("Loaded wallet address:", address || wallet.address);
    } catch (error) {
      console.error("Error loading wallet from storage:", error);
    }
  };

  useEffect(() => {
    initWallet();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await initWallet();
      setPayAmount('');
      setReceiveAmount('');
    } catch (e) {
      console.error('Failed to refresh TradeSwap:', e);
    } finally {
      setRefreshing(false);
    }
  };


  useEffect(() => {
    if (payToken.symbol === 'ETH' && receiveToken.symbol === 'WETH') {
      setReceiveAmount(payAmount);
    } else {
      setReceiveAmount('0');
    }
  }, [payAmount, payToken, receiveToken]);


  const onSelectPayToken = () => setShowPayTokenModal(true);
  const onSelectReceiveToken = () => setShowReceiveTokenModal(true);

  const handleTokenSelect = (token, isPayToken) => {
    if (isPayToken) {
      setPayToken(token);
      setShowPayTokenModal(false);
    } else {
      setReceiveToken(token);
      setShowReceiveTokenModal(false);
    }
  };

  const swapTokens = () => {
    const tempToken = payToken;
    setPayToken(receiveToken);
    setReceiveToken(tempToken);

    const tempAmount = payAmount;
    setPayAmount(receiveAmount);
    setReceiveAmount(tempAmount);
  };

  const onSwapPress = async () => {
    if (!payAmount || parseFloat(payAmount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount to swap.");
      return;
    }

    if (payToken.symbol === receiveToken.symbol) {
      Alert.alert("Invalid Swap", "Cannot swap the same token.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Swap button pressed. Initiating swap...");
      console.log(`Swapping ${payAmount} ${payToken.symbol} for ${receiveToken.symbol}`);

      const txHash = await performTokenSwap(payToken, receiveToken, payAmount, wallet);

      console.log("Swap successful! Transaction Hash:", txHash);
      ToastAndroid.show(`Swap successful! Hash: ${txHash.slice(0, 10)}...`, ToastAndroid.LONG);
      Alert.alert(
        "Swap Successful!", 
        `Transaction Hash: ${txHash}\n\nView on Sepolia Etherscan: https://sepolia.etherscan.io/tx/${txHash}`,
        [{ text: "OK" }]
      );

      setPayAmount('');
      setReceiveAmount('');

    } catch (error) {
      console.error("Swap failed:", error);
      Alert.alert("Swap Failed", `Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTokenIcon = (token) => {
    if (token.icon && token.icon.startsWith('logo-')) {
      return <Ionicons name='wallet-outline' size={24} color={Colors.accent} />;
    } else {
      return <Ionicons name={token.icon || 'help-circle-outline'} size={24} color={Colors.accent} />;
    }
  };

  const renderTokenIconOutside = (token) => {
    if (token.icon && token.icon.startsWith('logo-')) {
      return <Ionicons name='wallet-outline' size={24} color={Colors.background + '80'} />;
    } else {
      return <Ionicons name={token.icon || 'help-circle-outline'} size={24} color={Colors.background + '80'} />;
    }
  };

  const renderTokenModal = (visible, onClose, selectedToken, onSelect) => (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Testnet Token</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={TESTNET_TOKENS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.tokenItem,
                  selectedToken.id === item.id && styles.selectedTokenItem
                ]}
                onPress={() => onSelect(item, visible === showPayTokenModal)}
              >
                <View style={styles.tokenIconContainer}>
                  {renderTokenIcon(item)}
                </View>
                <View style={styles.tokenItemText}>
                  <Text style={styles.tokenItemSymbol}>{item.symbol}</Text>
                  <Text style={styles.tokenItemName}>{item.name} • {item.network}</Text>
                </View>
                {selectedToken.id === item.id && (
                  <Ionicons name="checkmark" size={20} color={Colors.accent} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={CommonStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoButton} onPress={() => navigation.navigate('Activity')}>
          <View style={styles.logoCircle}>
            <Image
              source={require("../assets/main_logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.searchButton} onPress={() => console.log("search pressed")}>
          <Ionicons name="search" size={20} color={Colors.gray} />
          <Text style={styles.searchPlaceholder}>Search</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('More')}>
          <Ionicons name="notifications-outline" size={24} color={Colors.white} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Network Badge */}
        <View style={styles.networkBadge}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.accent} />
          <Text style={styles.networkText}>Sepolia Testnet</Text>
        </View>

        {/* Swap Tokens */}
        <View style={styles.swapSection}>
          {/* You Pay */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>You Pay</Text>
            <View style={styles.row}>
              <TextInput
                keyboardAppearance="dark"
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor={Colors.gray}
                keyboardType="numeric"
                value={payAmount}
                onChangeText={setPayAmount}
              />
              <TouchableOpacity
                style={styles.tokenButton}
                onPress={onSelectPayToken}
                activeOpacity={0.7}
              >
                <View style={styles.tokenIconContainer}>
                  {renderTokenIconOutside(payToken)}
                </View>
                <Text style={styles.tokenSymbol}>{payToken.symbol}</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Swap Button */}
          <TouchableOpacity
            style={styles.swapButton}
            onPress={swapTokens}
            activeOpacity={0.7}
          >
            <Ionicons name="swap-vertical" size={24} color={Colors.white} />
          </TouchableOpacity>

          {/* You Receive */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>You Receive</Text>
            <View style={styles.row}>
              <Text style={[styles.amountInput, { paddingTop: 12 }]}>
                {receiveAmount || '0'}
              </Text>
              <TouchableOpacity
                style={styles.tokenButton}
                onPress={onSelectReceiveToken}
                activeOpacity={0.7}
              >
                <View style={styles.tokenIconContainer}>
                  {renderTokenIconOutside(receiveToken)}
                </View>
                <Text style={styles.tokenSymbol}>{receiveToken.symbol}</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Execute Swap Button */}
          <TouchableOpacity
            style={[styles.executeSwapButton, isLoading && styles.executeSwapButtonDisabled]}
            onPress={onSwapPress}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="refresh" size={20} color={Colors.white} style={styles.spinning} />
                <Text style={styles.executeSwapText}>Processing...</Text>
              </View>
            ) : (
              <Text style={styles.executeSwapText}>
                Swap {payToken.symbol} for {receiveToken.symbol}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Trending Tokens */}
        <Text style={styles.trendingTitle}>Trending Pairs</Text>
        {Trending.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.simpleCard}
            onPress={() => console.log("Pressed Trending Token:", item.name)}
            activeOpacity={0.6}
          >
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={20} color={Colors.accent} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
          </TouchableOpacity>
        ))}

        {/* Disclaimer */}
        <Text style={styles.disclaimerText}>
          ⚠️ This is a testnet environment. Only testnet tokens are supported. Trading involves risk. Please do your own research before making any trades.
        </Text>
      </ScrollView>

      {/* Token Selection Modals */}
      {renderTokenModal(showPayTokenModal, () => setShowPayTokenModal(false), payToken, handleTokenSelect)}
      {renderTokenModal(showReceiveTokenModal, () => setShowReceiveTokenModal(false), receiveToken, handleTokenSelect)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingTop: statusbarHeight,
  },
  logoButton: {
    padding: Spacing.xs,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    width: 24,
    height: 24,
  },
  searchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  searchPlaceholder: {
    fontSize: FontSizes.md,
    color: Colors.gray,
    marginLeft: Spacing.lg,
  },
  headerButton: {
    padding: Spacing.sm,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.massive,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: Spacing.lg,
  },
  networkText: {
    color: Colors.accent,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.xs,
  },
  swapSection: {
    alignItems: 'center',
    marginBottom: Spacing.massive,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.xl,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardLabel: {
    color: Colors.gray,
    fontSize: FontSizes.base,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    color: Colors.white,
    fontSize: FontSizes.xxl,
  },
  tokenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
  },
  tokenIconContainer: {
    marginRight: Spacing.sm,
  },
  tokenSymbol: {
    color: Colors.white,
    marginRight: 4,
    fontWeight: FontWeights.semiBold,
  },
  swapButton: {
    position: 'absolute',
    top: 100,
    backgroundColor: Colors.accent,
    padding: Spacing.lg,
    borderRadius: 24,
    zIndex: 10,
  },
  executeSwapButton: {
    width: '100%',
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  executeSwapButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinning: {
    marginRight: Spacing.sm,
  },
  executeSwapText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  trendingTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.lg,
  },
  simpleCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent + '20',
    marginRight: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
  },
  cardSubtitle: {
    color: Colors.gray,
    fontSize: FontSizes.base,
  },
  disclaimerText: {
    color: Colors.white,
    opacity: 0.5,
    fontSize: FontSizes.sm,
    lineHeight: 18,
    marginTop: Spacing.xxl,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  tokenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedTokenItem: {
    backgroundColor: Colors.accent + '20',
  },
  tokenItemText: {
    flex: 1,
  },
  tokenItemSymbol: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
  },
  tokenItemName: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
  },
});
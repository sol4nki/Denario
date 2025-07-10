import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  CommonStyles,
} from "../styles/theme";

import { ethers } from "ethers";
import { loadWalletAddress, loadPvtKey } from '../storage.js'; 

const SEPOLIA_RPC = "https://sepolia.drpc.org/";
const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);

const TOKENS = [
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    address: null,
    decimals: 18,
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    id: "weth",
    name: "Wrapped ETH",
    symbol: "WETH",
    address: "0xdd13e55209fd76afe204dbda4007c227904f0a81",
    decimals: 18,
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
];



const scamAddresses = [

  "0x9DFC9439d7ee26aff147cBCf2A9FEDcd751ECC92",
  "0xf4838dc566085db24A26e7B3DCB6d29bD29811D1",
  "0x8dd0baefA3e9E26903ec33141426DC3d472Df12c",
  "0xA559DF5B3753abC98C3bACE7752bFa9d570AcaCa",
  "0xbb4b732751097fe814af781b6f19848b91ec9099",
  "0x82d5F87bfcB468577e181A1FbeFDD61121269390",
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43"
  
];

async function fetchTokenBalances(walletAddress) {
  if (!walletAddress) throw new Error("No wallet address provided");
  const lower = walletAddress.toLowerCase();
  const balances = [];
  try {
    // ETH
    const ethBalance = await provider.getBalance(lower);
    balances.push({
      ...TOKENS[0],
      balance: Number(ethers.formatEther(ethBalance)),
      current_price: 0,
    });
  } catch (e) {
    console.error("Failed to fetch ETH balance", e);
    balances.push({ ...TOKENS[0], balance: 0, current_price: 0 });
  }
  try {
    const wethContract = new ethers.Contract(
      TOKENS[1].address,
      ["function balanceOf(address) view returns (uint256)"],
      provider
    );
    const wethBalance = await wethContract.balanceOf(lower);
    balances.push({
      ...TOKENS[1],
      balance: Number(ethers.formatUnits(wethBalance, 18)),
      current_price: 0,
    });
  } catch (e) {
    console.error("Failed to fetch WETH balance", e);
    balances.push({ ...TOKENS[1], balance: 0, current_price: 0 });
  }
  return balances;
}


async function logTransactionToFirestore(transactionData) {
  try {
    const ip = await getPublicIP();
    const now = new Date();

    const logData = {
      timestamp: now.toISOString(),
      ipAddress: ip,
      walletAddress: wallet.address,
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
      collection(db, "wallets", wallet.address, "transactionHistory"),
      logData
    );
    console.log("Swap transaction logged to Firestore!");
  } catch (error) {
    console.error("Error logging to Firestore:", error);
  }
}

const Send = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [coins, setCoins] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [coinsLoading, setCoinsLoading] = useState(true);
  const [txHash, setTxHash] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadTokens = async () => {
      setCoinsLoading(true);
      setLoadError("");
      try {
        const address = await loadWalletAddress();

        if (!address) {
          setLoadError("Wallet address not found. Please create a wallet first.");
          setCoins([]);
          setSelectedToken(null);
          return;
        }

        let tokenList = [];
        try {
          tokenList = await fetchTokenBalances(address);
        } catch (err) {
          setLoadError("Failed to fetch token balances. Check your network.");
          setCoins([]);
          setSelectedToken(null);
          return;
        }

        if (!tokenList || tokenList.length === 0) {
          setLoadError("No tokens found. Try again later.");
          setCoins([]);
          setSelectedToken(null);
          return;
        }

        setCoins(tokenList);
        setSelectedToken(tokenList[0]);
      } finally {
        setCoinsLoading(false);
      }
    };

    loadTokens();
  }, []);


  useEffect(() => {
    if (route.params && route.params.recipientAddress) {
      setRecipient(route.params.recipientAddress);
    }
  }, [route.params]);

  const handleCopy = () => {
    Clipboard.setStringAsync(recipient);
  };

  const handleMax = () => {
    if (selectedToken) {
      setAmount(selectedToken.balance?.toString() || "");
    }
  };

  const handleSend = async () => {
    if (!selectedToken) {
      Alert.alert("Error", "No token selected.");
      return;
    }
    if (!recipient || recipient.length < 6) {
      Alert.alert("Invalid Address", "Please enter a valid recipient address.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount to send.");
      return;
    }
    if (Number(amount) > selectedToken.balance) {
      Alert.alert("Insufficient Balance", "You do not have enough balance.");
      return;
    }

    try {
      setLoading(true);
      setTxHash("");

      console.log("[handleSend] Loading private key from secure storage...");
      const privateKey = await loadPvtKey();
      if (!privateKey) {
        Alert.alert("Error", "No private key found in secure storage. Please create a wallet first.");
        return;
      }
      console.log("[handleSend] Private key loaded:", privateKey.slice(0, 6) + "...");

      console.log("[handleSend] Loading wallet address from secure storage...");
      const walletAddress = await loadWalletAddress();
      if (!walletAddress) {
        Alert.alert("Error", "No wallet address found in secure storage.");
        return;
      }
      console.log("[handleSend] Wallet address loaded:", walletAddress);

      const wallet = new ethers.Wallet(privateKey, provider);

      let tx;
      if (!selectedToken.address || selectedToken.symbol === "ETH") {
        console.log("[handleSend] Sending ETH transaction...");
        tx = await wallet.sendTransaction({
          to: recipient,
          value: ethers.parseEther(amount),
        });
      } else {
        console.log("[handleSend] Sending ERC-20 transaction...");
        const contract = new ethers.Contract(
          selectedToken.address,
          [
            "function transfer(address to, uint amount) public returns (bool)",
            "function decimals() view returns (uint8)"
          ],
          wallet
        );
        const decimals = await contract.decimals();
        const value = ethers.parseUnits(amount, decimals);
        tx = await contract.transfer(recipient, value);
      }

      console.log("[handleSend] Waiting for transaction confirmation...");
      await tx.wait();

      setTxHash(tx.hash);
      Alert.alert("Success", `Sent ${amount} ${selectedToken.symbol} to ${recipient}`);
      setAmount("");
      setRecipient("");
      console.log("[handleSend] Refreshing token balances...");
      let tokenList = [];
      try {
        tokenList = await fetchTokenBalances(walletAddress);
      } catch (err) {
        setLoadError("Failed to refresh token balances.");
        console.error("[handleSend] Error refreshing token balances:", err);
        return;
      }

      setCoins(tokenList);
      setSelectedToken(tokenList.find(t => t.symbol === selectedToken.symbol) || tokenList[0]);

    } catch (error) {
      console.error("Send Error:", error);
      Alert.alert("Error", "Failed to send tokens.");
    } finally {
      setLoading(false);
      console.log("[handleSend] Finished processing transaction.");
    }
  };

  
  

  return (
    <SafeAreaView style={CommonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Send</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Error Message */}
        {loadError ? (
          <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{loadError}</Text>
        ) : null}
        {/* Token Selector */}
        <Text style={styles.label}>Token</Text>
        <TouchableOpacity
          style={styles.tokenSelector}
          activeOpacity={0.7}
          onPress={() => setModalVisible(true)}
        >
          {selectedToken && (
            <Image
              source={{ uri: selectedToken.image }}
              style={styles.tokenImage}
            />
          )}
          <Text style={styles.tokenText}>
            {selectedToken ? selectedToken.symbol.toUpperCase() : ""}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={Colors.gray}
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
        {/* Balance */}
        {selectedToken && (
          <Text style={styles.balanceText}>
            Price:{" "}
            <Text style={{ color: Colors.white }}>
              ${selectedToken.current_price} USD
            </Text>
          </Text>
        )}

        {/* Recipient Address */}
        <Text style={styles.label}>Recipient Address</Text>
        <View style={styles.recipientRow}>
          <TextInput
            keyboardAppearance="dark"
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter wallet address"
            placeholderTextColor={Colors.gray}
            value={recipient}
            onChangeText={text => {
              setRecipient(text);
              if (scamAddresses.some(addr => addr.toLowerCase() === text.trim().toLowerCase())) {
                Alert.alert(
                  "Scam Address Warning",
                  "These are flagged as scam addresses in our database. Please proceed with caution."
                );
              }
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {recipient ? (
            <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
              <Ionicons name="copy-outline" size={20} color={Colors.accent} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Amount Input */}
        <Text style={styles.label}>Amount</Text>
        <View style={styles.inputRow}>
          <TextInput
            keyboardAppearance="dark"
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={Colors.gray}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Text style={styles.inputToken}>
            {selectedToken ? selectedToken.symbol : ""}
          </Text>
          {/* Max Button */}
          <TouchableOpacity onPress={handleMax} style={{ marginLeft: 8, padding: 6 }}>
            <Text style={{ color: Colors.accent, fontWeight: "bold" }}>Max</Text>
          </TouchableOpacity>
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={[
            CommonStyles.button,
            styles.sendButton,
            (loading ||
              !recipient ||
              !amount ||
              isNaN(amount) ||
              Number(amount) <= 0 ||
              Number(amount) > selectedToken.balance) && { opacity: 0.5 },
          ]}
          onPress={handleSend}
          activeOpacity={0.8}
          disabled={
            loading ||
            !recipient ||
            !amount ||
            isNaN(amount) ||
            Number(amount) <= 0 ||
            Number(amount) > selectedToken.balance
          }
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>
              Send {selectedToken ? selectedToken.symbol : ""}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Token Selector Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Token</Text>
            {coinsLoading ? (
              <ActivityIndicator
                size="large"
                color={Colors.accent}
                style={{ marginVertical: 30 }}
              />
            ) : (
              <FlatList
                data={coins}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedToken(item);
                      setModalVisible(false);
                    }}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={styles.tokenImage}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.tokenText}>{item.symbol.toUpperCase()}</Text>
                      <Text style={{ color: Colors.gray, fontSize: 12 }}>
                        Balance: {item.balance}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Transaction Hash Display */}
      {txHash ? (
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text style={{ color: Colors.accent, fontSize: 13 }}>
            Tx Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default Send;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
  },
  backButton: {
    marginRight: 12,
    padding: 6,
  },
  title: {
    ...CommonStyles.title,
    fontSize: FontSizes.xl,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  label: {
    color: Colors.gray,
    fontSize: FontSizes.base,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xl,
  },
  tokenSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tokenText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
  },
  balanceText: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xl,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: FontSizes.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: "transparent",
  },
  inputToken: {
    color: Colors.gray,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginLeft: 8,
  },
  sendButton: {
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    textAlign: "center",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: Spacing.massive,
    width: "85%",
    maxHeight: "60%",
    alignItems: "stretch",
  },
  modalTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xl,
    textAlign: "center",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tokenImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    backgroundColor: Colors.cardBackground,
  },
  closeModalBtn: {
    marginTop: Spacing.xl,
    alignSelf: "center",
  },
  closeModalText: {
    color: Colors.accent,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
  },
  recipientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  copyButton: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
});

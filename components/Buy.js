import { 
  StyleSheet, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  View, 
  TextInput, 
  Alert, 
  Modal, 
  FlatList, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Vibration
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';

import { apiService, transactionUtils } from './api';


const TOKENS = [
  { 
    symbol: 'ETH', 
    name: 'Ethereum', 
    balance: 2.1, 
    price: 3200, 
    icon: 'wallet-outline',
    network: 'Sepolia',
    contractAddress: '0x0000000000000000000000000000000000000000' 
  },
  { 
    symbol: 'SOL', 
    name: 'Solana', 
    balance: 12.34, 
    price: 150, 
    icon: 'wallet-outline',
    network: 'Solana',
    contractAddress: null
  },
  { 
    symbol: 'USDC', 
    name: 'USD Coin', 
    balance: 1000, 
    price: 1, 
    icon: 'logo-usd',
    network: 'Sepolia',
    contractAddress: '0xA0b86a33E6417e88d9C4fE93c72D9A3B1a4F5e5b' 
  },
];

const Buy = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const executeTransaction = async (tokenSymbol, amount, toAddress) => {
    try {
      setTransactionStatus('Preparing transaction...');
      
     
      const response = await apiService.executeTransaction({
        tokenSymbol,
        amount,
        toAddress,
        network: selectedToken.network,
      });

      return response;
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  };

  const handleBuy = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to buy.');
      Vibration.vibrate(100);
      return;
    }

    if (Number(amount) > selectedToken.balance) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough balance for this transaction.');
      Vibration.vibrate(100);
      return;
    }

    setLoading(true);
    setTransactionStatus('Initiating transaction...');
    
    try {

      const recipientAddress = "0xBc5Fef730fEBc7432230f52868d30Fe07A3cf959";
      
      setTransactionStatus('Broadcasting transaction...');
      const result = await executeTransaction(selectedToken.symbol, amount, recipientAddress);
      
      if (result.success) {
        setTransactionHash(result.txHash);
        setTransactionStatus('Transaction confirmed!');
        
   
        selectedToken.balance -= Number(amount);
        
        Vibration.vibrate([100, 50, 100]);
        
        Alert.alert(
          'Transaction Successful!', 
          `You have bought ${amount} ${selectedToken.symbol}!\n\nTransaction Hash: ${transactionUtils.formatTxHash(result.txHash)}`,
          [
            {
              text: 'View on Explorer',
              onPress: () => {
                console.log('Open explorer:', result.explorerUrl);
              }
            },
            {
              text: 'OK',
              onPress: () => {
                setAmount('');
                setTransactionHash('');
                setTransactionStatus('');
              }
            }
          ]
        );
      } else {
        throw new Error(result.error || 'Transaction failed');
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      setTransactionStatus('');
      
      let errorMessage = 'Transaction failed. Please try again.';
      if (error.message.includes('insufficient')) {
        errorMessage = 'Insufficient funds for this transaction.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('gas')) {
        errorMessage = 'Gas estimation failed. Please try again.';
      }
      
      Alert.alert('Transaction Failed', errorMessage);
      Vibration.vibrate(200);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (text) => {

    const numericValue = text.replace(/[^0-9.]/g, '');
    

    const decimalCount = (numericValue.match(/\./g) || []).length;
    if (decimalCount <= 1) {
      setAmount(numericValue);
    }
  };

  const setMaxAmount = () => {
    setAmount(selectedToken.balance.toString());
    Vibration.vibrate(50);
  };

  const estimatedCost = amount ? (Number(amount) * selectedToken.price).toFixed(2) : '0.00';
  const isValidAmount = amount && !isNaN(amount) && Number(amount) > 0 && Number(amount) <= selectedToken.balance;

  return (
    <SafeAreaView style={CommonStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={[styles.header, keyboardVisible && { paddingTop: Spacing.lg }]}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.title}>Buy Crypto</Text>
              <View style={styles.headerRight}>
                <Ionicons name="shield-checkmark" size={20} color={Colors.accent} />
              </View>
            </View>

            <ScrollView 
              style={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Network Badge */}
              <View style={styles.networkBadge}>
                <Ionicons name="globe-outline" size={16} color={Colors.accent} />
                <Text style={styles.networkText}>{selectedToken.network} Network</Text>
              </View>

              {/* Token Selector */}
              <Text style={styles.label}>Select Token</Text>
              <TouchableOpacity 
                style={styles.tokenSelector} 
                activeOpacity={0.7} 
                onPress={() => setModalVisible(true)}
              >
                <View style={styles.tokenSelectorLeft}>
                  <Ionicons name={selectedToken.icon} size={24} color={Colors.accent} />
                  <View style={styles.tokenInfo}>
                    <Text style={styles.tokenText}>{selectedToken.symbol}</Text>
                    <Text style={styles.tokenName}>{selectedToken.name}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-down" size={18} color={Colors.gray} />
              </TouchableOpacity>

              {/* Balance */}
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceValue}>
                  {selectedToken.balance} {selectedToken.symbol}
                </Text>
                <TouchableOpacity onPress={setMaxAmount} style={styles.maxButton}>
                  <Text style={styles.maxButtonText}>MAX</Text>
                </TouchableOpacity>
              </View>

              {/* Amount Input */}
              <Text style={styles.label}>Amount to Buy</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  keyboardAppearance="dark"
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={Colors.gray}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={handleAmountChange}
                  maxLength={12}
                  returnKeyType="done"
                />
                <Text style={styles.inputToken}>{selectedToken.symbol}</Text>
              </View>

              {/* Amount Validation */}
              {amount && Number(amount) > selectedToken.balance && (
                <Text style={styles.errorText}>
                  Insufficient balance. Maximum: {selectedToken.balance} {selectedToken.symbol}
                </Text>
              )}

              {/* Estimated Cost */}
              <View style={styles.estimateBox}>
                <View style={styles.estimateRow}>
                  <Text style={styles.estimateLabel}>Estimated Cost</Text>
                  <Text style={styles.estimateValue}>${estimatedCost}</Text>
                </View>
                <View style={styles.estimateRow}>
                  <Text style={styles.estimateLabel}>Price per {selectedToken.symbol}</Text>
                  <Text style={styles.estimateSubValue}>${selectedToken.price}</Text>
                </View>
                {amount && (
                  <View style={styles.estimateRow}>
                    <Text style={styles.estimateLabel}>Network Fee</Text>
                    <Text style={styles.estimateSubValue}>~$2.50</Text>
                  </View>
                )}
              </View>

              {/* Transaction Status */}
              {transactionStatus && (
                <View style={styles.statusContainer}>
                  <ActivityIndicator size="small" color={Colors.accent} />
                  <Text style={styles.statusText}>{transactionStatus}</Text>
                </View>
              )}

              {/* Buy Button */}
              <TouchableOpacity
                style={[
                  CommonStyles.button, 
                  styles.buyButton,
                  (!isValidAmount || loading) && styles.buttonDisabled
                ]}
                onPress={handleBuy}
                activeOpacity={0.8}
                disabled={!isValidAmount || loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <View style={styles.buttonContent}>
                    <Ionicons name="card-outline" size={20} color={Colors.white} />
                    <Text style={styles.buttonText}>Buy {selectedToken.symbol}</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Security Notice */}
              <View style={styles.securityNotice}>
                <Ionicons name="shield-checkmark" size={16} color={Colors.accent} />
                <Text style={styles.securityText}>
                  Your transaction is secured by blockchain technology
                </Text>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Enhanced Token Selector Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Token</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={Colors.gray} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={TOKENS}
              keyExtractor={item => item.symbol}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedToken.symbol === item.symbol && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setSelectedToken(item);
                    setModalVisible(false);
                    setAmount(''); 
                  }}
                >
                  <View style={styles.modalItemLeft}>
                    <Ionicons name={item.icon} size={24} color={Colors.accent} />
                    <View style={styles.modalTokenInfo}>
                      <Text style={styles.modalTokenSymbol}>{item.symbol}</Text>
                      <Text style={styles.modalTokenName}>{item.name}</Text>
                    </View>
                  </View>
                  <View style={styles.modalItemRight}>
                    <Text style={styles.modalTokenBalance}>{item.balance}</Text>
                    <Text style={styles.modalTokenPrice}>${item.price}</Text>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Buy;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
  },
  title: {
    ...CommonStyles.title,
    fontSize: FontSizes.xl,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  networkText: {
    color: Colors.accent,
    fontSize: FontSizes.sm,
    marginLeft: Spacing.xs,
    fontWeight: FontWeights.medium,
  },
  label: {
    color: Colors.gray,
    fontSize: FontSizes.base,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    fontWeight: FontWeights.medium,
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tokenSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tokenInfo: {
    marginLeft: Spacing.md,
  },
  tokenText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  tokenName: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  balanceLabel: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
  },
  balanceValue: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semiBold,
    flex: 1,
    textAlign: 'right',
    marginRight: Spacing.md,
  },
  maxButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  maxButtonText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: FontSizes.xxl,
    paddingVertical: Spacing.xl,
    backgroundColor: 'transparent',
    fontWeight: FontWeights.medium,
  },
  inputToken: {
    color: Colors.accent,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginLeft: Spacing.md,
  },
  errorText: {
    color: Colors.error || '#ff4444',
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
    marginLeft: Spacing.sm,
  },
  estimateBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  estimateLabel: {
    color: Colors.gray,
    fontSize: FontSizes.base,
  },
  estimateValue: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  estimateSubValue: {
    color: Colors.gray,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statusText: {
    color: Colors.accent,
    fontSize: FontSizes.sm,
    marginLeft: Spacing.sm,
    fontWeight: FontWeights.medium,
  },
  buyButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.xl,
    borderRadius: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginLeft: Spacing.sm,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.massive,
    paddingHorizontal: Spacing.lg,
  },
  securityText: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    marginLeft: Spacing.sm,
    textAlign: 'center',
  },
  // Enhanced Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.massive,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  modalCloseButton: {
    padding: Spacing.sm,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    borderRadius: 12,
    marginBottom: Spacing.xs,
  },
  modalItemSelected: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.accent,
    borderWidth: 1,
  },
  modalItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalTokenInfo: {
    marginLeft: Spacing.md,
  },
  modalTokenSymbol: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  modalTokenName: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  modalItemRight: {
    alignItems: 'flex-end',
  },
  modalTokenBalance: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semiBold,
  },
  modalTokenPrice: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
});
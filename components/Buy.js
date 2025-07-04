import { StyleSheet, Text, SafeAreaView, TouchableOpacity, View, TextInput, Alert, Modal, FlatList, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';

const TOKENS = [
  { symbol: 'SOL', name: 'Solana', balance: 12.34, price: 150, icon: 'logo-bitcoin' },
  { symbol: 'USDC', name: 'USD Coin', balance: 1000, price: 1, icon: 'logo-usd' },
  { symbol: 'ETH', name: 'Ethereum', balance: 2.1, price: 3200, icon: 'logo-bitcoin' },
];

const Buy = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBuy = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to buy.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', `You have bought ${amount} ${selectedToken.symbol}!`);
      setAmount('');
    }, 1200);
  };

  const estimatedCost = amount ? (Number(amount) * selectedToken.price).toFixed(2) : '0.00';

  return (
    <SafeAreaView style={CommonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Buy Crypto</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Token Selector */}
        <Text style={styles.label}>Token</Text>
        <TouchableOpacity style={styles.tokenSelector} activeOpacity={0.7} onPress={() => setModalVisible(true)}>
          <Ionicons name={selectedToken.icon} size={22} color={Colors.accent} style={{ marginRight: 10 }} />
          <Text style={styles.tokenText}>{selectedToken.symbol}</Text>
          <Ionicons name="chevron-down" size={18} color={Colors.gray} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
        {/* Balance */}
        <Text style={styles.balanceText}>Balance: <Text style={{ color: Colors.white }}>{selectedToken.balance} {selectedToken.symbol}</Text></Text>

        {/* Amount Input */}
        <Text style={styles.label}>Amount to Buy</Text>
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
          <Text style={styles.inputToken}>{selectedToken.symbol}</Text>
        </View>

        {/* Estimated Cost */}
        <View style={styles.estimateBox}>
          <Text style={styles.estimateLabel}>Estimated Cost</Text>
          <Text style={styles.estimateValue}>${estimatedCost} USD</Text>
        </View>

        {/* Buy Button */}
        <TouchableOpacity
          style={[CommonStyles.button, styles.buyButton, (!amount || isNaN(amount) || Number(amount) <= 0 || loading) && { opacity: 0.5 }]}
          onPress={handleBuy}
          activeOpacity={0.8}
          disabled={!amount || isNaN(amount) || Number(amount) <= 0 || loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Buy {selectedToken.symbol}</Text>
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
            <FlatList
              data={TOKENS}
              keyExtractor={item => item.symbol}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedToken(item);
                    setModalVisible(false);
                  }}
                >
                  <Ionicons name={item.icon} size={22} color={Colors.accent} style={{ marginRight: 10 }} />
                  <Text style={styles.tokenText}>{item.symbol} <Text style={styles.modalTokenName}>({item.name})</Text></Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: 'transparent',
  },
  inputToken: {
    color: Colors.gray,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginLeft: 8,
  },
  estimateBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: Spacing.lg,
    marginBottom: Spacing.massive,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimateLabel: {
    color: Colors.gray,
    fontSize: FontSizes.base,
  },
  estimateValue: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semiBold,
  },
  buyButton: {
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: Spacing.massive,
    width: '85%',
    maxHeight: '60%',
    alignItems: 'stretch',
  },
  modalTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTokenName: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  closeModalBtn: {
    marginTop: Spacing.xl,
    alignSelf: 'center',
  },
  closeModalText: {
    color: Colors.accent,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
  },
});

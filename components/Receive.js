import { StyleSheet, Text, SafeAreaView, TouchableOpacity, View, Modal, FlatList, Alert } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import QRCode from 'react-native-qrcode-svg';

const TOKENS = [
  { symbol: 'SOL', name: 'Solana', address: '7f8d...solana', icon: 'logo-bitcoin' },
  { symbol: 'USDC', name: 'USD Coin', address: '0x1234...usdc', icon: 'logo-usd' },
  { symbol: 'ETH', name: 'Ethereum', address: '0x5678...eth', icon: 'logo-bitcoin' },
];

const Receive = () => {
  const navigation = useNavigation();
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCopy = () => {
    Clipboard.setStringAsync(selectedToken.address);
    Alert.alert('Copied', 'Wallet address copied to clipboard!');
  };

  const handleShare = async () => {
    try {
      await Sharing.shareAsync(undefined, {
        dialogTitle: 'Share Wallet Address',
        mimeType: 'text/plain',
        UTI: 'public.text',
        message: selectedToken.address,
      });
    } catch (e) {
      Alert.alert('Error', 'Could not share address.');
    }
  };

  return (
    <SafeAreaView style={CommonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Receive</Text>
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

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <QRCode
            value={selectedToken.address}
            size={200}
            // backgroundColor={Colors.background}
            // color={Colors.accent}
          />
        </View>

        {/* Wallet Address */}
        <View style={styles.addressBox}>
          <Text style={styles.addressLabel}>Wallet Address</Text>
          <Text style={styles.addressValue}>{selectedToken.address}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCopy}>
            <Ionicons name="copy-outline" size={22} color={Colors.accent} />
            <Text style={styles.actionText}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={22} color={Colors.accent} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
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

export default Receive;

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
    alignItems: 'center',
  },
  label: {
    color: Colors.gray,
    fontSize: FontSizes.base,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xl,
    alignSelf: 'flex-start',
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignSelf: 'stretch',
  },
  tokenText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
  },
  qrContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.massive,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addressBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  addressLabel: {
    color: Colors.gray,
    fontSize: FontSizes.base,
    marginBottom: Spacing.sm,
  },
  addressValue: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    letterSpacing: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.xl,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  actionText: {
    color: Colors.accent,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    marginLeft: 8,
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

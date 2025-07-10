import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  Modal,
  Clipboard,
  ToastAndroid,
  Animated,
  Dimensions,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native';
import Constants from "expo-constants";

import { loadWalletAddress } from '../storage.js'; 


import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { db } from "../firebaseconfig.js";
import { collection, getDocs } from "firebase/firestore";

const { width, height } = Dimensions.get('window');
const statusbarHeight = Platform.OS === 'android' ? Constants.statusBarHeight : 0;


async function fetchLoginHistory(walletAddress) {
  const loginRef = collection(db, "wallets", walletAddress, "loginHistory");
  try {
    const snapshot = await getDocs(loginRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching login history:", error);
    return [];
  }
}

async function fetchTransactionHistory(walletAddress) {
  const txRef = collection(db, "wallets", walletAddress, "transactionHistory");
  try {
    const snapshot = await getDocs(txRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return [];
  }
}

export default function RecentLogs({ navigation }) {
  const [loginHistory, setLoginHistory] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);

  const [selectedLogin, setSelectedLogin] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTxModalVisible, setIsTxModalVisible] = useState(false);

  const [showAllLogins, setShowAllLogins] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const [walletAddress, setWalletAddress] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
      const loadWallet = async () => {
        try {
         
          const address = await loadWalletAddress();
  
          if (!address) {
            throw new Error('No wallet address found in secure storage');
          }
  
          setWalletAddress(address);
          console.log('[loadWallet] Loaded address from secure storage:', address);
  
          
        } catch (error) {
          console.error('Failed to load wallet address:', error);
          Alert.alert('Error', 'Could not load wallet address.');
        }
      };
  
      loadWallet();
    }, []);

  useEffect(() => {
    if (!walletAddress) return;
    async function fetchData() {
      setLoginHistory(await fetchLoginHistory(walletAddress));
      setTransactionHistory(await fetchTransactionHistory(walletAddress));
    }
    fetchData();
  }, [walletAddress]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (walletAddress) {
        setLoginHistory(await fetchLoginHistory(walletAddress));
        setTransactionHistory(await fetchTransactionHistory(walletAddress));
      }
    } catch (e) {
      console.error('Failed to refresh activity logs:', e);
    } finally {
      setRefreshing(false);
    }
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const truncateAddress = (address, startLength = 8, endLength = 6) => {
    if (!address) return 'N/A';
    if (address.length <= startLength + endLength) return address;
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  };

  const getLoginIcon = (event) => {
    switch (event?.toLowerCase()) {
      case 'login':
        return 'log-in-outline';
      case 'logout':
        return 'log-out-outline';
      case 'failed':
        return 'alert-circle-outline';
      default:
        return 'person-circle-outline';
    }
  };

  const getTransactionIcon = (network) => {
    switch (network?.toLowerCase()) {
      case 'ethereum':
        return 'wallet-outline';
      case 'bitcoin':
        return 'wallet-outline';
      default:
        return 'swap-horizontal-outline';
    }
  };

  const renderLoginCard = (item, index) => (
    <TouchableOpacity
      key={item.id || index}
      style={styles.enhancedCard}
      onPress={() => {
        setSelectedLogin(item);
        setIsModalVisible(true);
      }}
    >
      <View style={[styles.iconCircle, { backgroundColor: Colors.accent + '20' }]}>
        <Ionicons name={getLoginIcon(item.event)} size={20} color={Colors.accent} />
      </View>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.event || 'Login Event'}</Text>
        <Text style={styles.cardSubtitle}>
          {formatTimestamp(item.timestamp)}
        </Text>
        <Text style={styles.cardSubtitle}>
          {item.ipAddress || 'Unknown IP'}
        </Text>
      </View>
      <View style={styles.cardArrow}>
        <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
      </View>
    </TouchableOpacity>
  );

  const renderTransactionCard = (item, index) => (
    <TouchableOpacity
      key={item.id || index}
      style={styles.enhancedCard}
      onPress={() => {
        setSelectedTransaction(item);
        setIsTxModalVisible(true);
      }}
    >
      <View style={[styles.iconCircle, { backgroundColor: Colors.accent + '20' }]}>
        <Ionicons name={getTransactionIcon(item.network)} size={20} color={Colors.accent} />
      </View>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>
          To: {truncateAddress(item.toAddress, 6, 4)}
        </Text>
        <Text style={styles.cardSubtitle}>
          {item.valueSent || '0'} ETH • {item.network || 'Unknown'}
        </Text>
        <Text style={styles.cardSubtitle}>
          {truncateAddress(item.txHash, 10, 6)}
        </Text>
      </View>
      <View style={styles.cardArrow}>
        <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
      </View>
    </TouchableOpacity>
  );

  const renderDetailRow = (icon, label, value, copyable = false) => (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={18} color={Colors.accent} />
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <View style={styles.detailValueContainer}>
          <Text style={styles.detailValue}>{value || 'N/A'}</Text>
          {copyable && value && (
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyToClipboard(value)}
            >
              <Ionicons name="copy-outline" size={16} color={Colors.accent} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={CommonStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoButton} onPress={() => navigation.navigate('More')}>
          <View style={styles.logoCircle}>
            <Image source={require("../assets/main_logo.png")} style={styles.headerLogo} resizeMode="contain" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('SearchActivity')}>
          <Ionicons name="search" size={20} color={Colors.gray} />
          <Text style={styles.searchPlaceholder}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Activity')}>
          <Ionicons name="notifications-outline" size={24} color={Colors.white} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
      >
        {/* Login Attempts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Login Attempts</Text>
            <TouchableOpacity 
              style={styles.seeMoreButton}
              onPress={() => setShowAllLogins(!showAllLogins)}
            >
              <Text style={styles.seeMoreText}>
                {showAllLogins ? 'Show less' : `View all (${loginHistory.length})`}
              </Text>
              <Ionicons 
                name={showAllLogins ? "chevron-up" : "chevron-down"} 
                size={16} 
                color={Colors.accent} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardsContainer}>
            {(showAllLogins ? loginHistory : loginHistory.slice(0, 3)).map(renderLoginCard)}
            {loginHistory.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="person-circle-outline" size={48} color={Colors.gray} />
                <Text style={styles.emptyStateText}>No login attempts found</Text>
              </View>
            )}
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transaction History</Text>
            <TouchableOpacity 
              style={styles.seeMoreButton}
              onPress={() => setShowAllTransactions(!showAllTransactions)}
            >
              <Text style={styles.seeMoreText}>
                {showAllTransactions ? 'Show less' : `View all (${transactionHistory.length})`}
              </Text>
              <Ionicons 
                name={showAllTransactions ? "chevron-up" : "chevron-down"} 
                size={16} 
                color={Colors.accent} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardsContainer}>
            {(showAllTransactions ? transactionHistory : transactionHistory.slice(0, 3)).map(renderTransactionCard)}
            {transactionHistory.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="swap-horizontal-outline" size={48} color={Colors.gray} />
                <Text style={styles.emptyStateText}>No transactions found</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Enhanced Login Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Login Details</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Modal Content */}
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {selectedLogin && (
                <>
                  {/* Basic Info */}
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    {renderDetailRow('person-circle-outline', 'Event', selectedLogin.event)}
                    {renderDetailRow('globe-outline', 'IP Address', selectedLogin.ipAddress, true)}
                    {renderDetailRow('time-outline', 'Timestamp', formatTimestamp(selectedLogin.timestamp))}
                  </View>

                  {/* Location Info */}
                  {selectedLogin.location && (
                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Location</Text>
                      {renderDetailRow('location-outline', 'City', selectedLogin.location.city)}
                      {renderDetailRow('flag-outline', 'Country', selectedLogin.location.country)}
                      {renderDetailRow('map-outline', 'Region', selectedLogin.location.region)}
                      {renderDetailRow('business-outline', 'Organization', selectedLogin.location.org)}
                    </View>
                  )}

                  {/* Device Info */}
                  {selectedLogin.deviceInfo && (
                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Device Information</Text>
                      {renderDetailRow('phone-portrait-outline', 'OS', selectedLogin.deviceInfo.os)}
                      {renderDetailRow('code-slash-outline', 'Node Version', selectedLogin.deviceInfo.nodeVersion)}
                    </View>
                  )}

                  {/* Raw Data */}
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Raw Data</Text>
                    <View style={styles.rawDataContainer}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <Text style={styles.rawDataText}>
                          {JSON.stringify(selectedLogin, null, 2)}
                        </Text>
                      </ScrollView>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Enhanced Transaction Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={isTxModalVisible}
        onRequestClose={() => setIsTxModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsTxModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Transaction Details</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Modal Content */}
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {selectedTransaction && (
                <>
                  {/* Transaction Info */}
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Transaction Information</Text>
                    {renderDetailRow('arrow-forward-outline', 'To Address', selectedTransaction.toAddress, true)}
                    {renderDetailRow('wallet-outline', 'Value Sent', `${selectedTransaction.valueSent || '0'} ETH`)}
                    {renderDetailRow('layers-outline', 'Network', selectedTransaction.network)}
                    {renderDetailRow('finger-print-outline', 'Transaction Hash', selectedTransaction.txHash, true)}
                    {renderDetailRow('globe-outline', 'IP Address', selectedTransaction.ipAddress, true)}
                  </View>

                  {/* Raw Data */}
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Raw Data</Text>
                    <View style={styles.rawDataContainer}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <Text style={styles.rawDataText}>
                          {JSON.stringify(selectedTransaction, null, 2)}
                        </Text>
                      </ScrollView>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.huge,
  },
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
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    paddingBottom: Spacing.lg,
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.lg,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  seeMoreText: {
    color: Colors.accent,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginRight: Spacing.xs,
  },
  cardsContainer: {
    gap: Spacing.md,
  },
  enhancedCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    marginBottom: 2,
  },
  cardArrow: {
    padding: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyStateText: {
    color: Colors.gray,
    fontSize: FontSizes.md,
    marginTop: Spacing.md,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    paddingBottom: Spacing.lg,
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    marginBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  placeholder: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  modalSection: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: FontSizes.sm,
    color: Colors.gray,
    marginBottom: Spacing.xs,
    fontWeight: FontWeights.medium,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailValue: {
    fontSize: FontSizes.md,
    color: Colors.white,
    fontWeight: FontWeights.medium,
    flex: 1,
    marginRight: Spacing.md,
  },
  copyButton: {
    padding: Spacing.sm,
    borderRadius: 8,
    backgroundColor: Colors.accent + '20',
  },
  rawDataContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  rawDataText: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
    fontFamily: 'monospace',
  },
});
import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Modal,
  Clipboard,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from "../firebaseconfig.js";
import { collection, getDocs } from "firebase/firestore";


import { loadWalletAddress } from '../storage.js';

const Colors = {
  background: '#0D0A19',
  cardBackground: '#1A1629',
  border: '#2C1E51',
  white: '#FFFFFF',
  gray: '#8B8B8B',
  accent: '#6366F1',
  primary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
};

const FontWeights = {
  normal: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};




async function fetchLoginHistory(walletAddress) {
  const loginRef = collection(db, "wallets", walletAddress, "loginHistory");
  try {
    const snapshot = await getDocs(loginRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'login' }));
  } catch (error) {
    console.error("Error fetching login history:", error);
    return [];
  }
}

async function fetchTransactionHistory(walletAddress) {
  const txRef = collection(db, "wallets", walletAddress, "transactionHistory");
  try {
    const snapshot = await getDocs(txRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'transaction' }));
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return [];
  }
}

export default function SearchActivity() {
  const navigation = useNavigation();
  
  const [walletAddress, setWalletAddress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const loadWallet = async () => {
      try {
        const address = await loadWalletAddress();
        if (!address) throw new Error('No wallet address found in secure storage');
        setWalletAddress(address);
      } catch (error) {
        console.error('Failed to load wallet address:', error);
      }
    };
    loadWallet();
  }, []);

  useEffect(() => {
    if (!walletAddress) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [loginData, transactionData] = await Promise.all([
          fetchLoginHistory(walletAddress),
          fetchTransactionHistory(walletAddress)
        ]);
        const combinedData = [...loginData, ...transactionData];
        setAllData(combinedData);
        setSearchResults(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [walletAddress]);

  const filteredData = useMemo(() => {
    let filtered = allData;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const searchableFields = [
          item.event,
          item.ipAddress,
          item.timestamp,
          item.toAddress,
          item.txHash,
          item.network,
          item.valueSent,
          item.location?.city,
          item.location?.country,
          item.location?.region,
          item.deviceInfo?.os,
        ];
        
        return searchableFields.some(field => 
          field && field.toString().toLowerCase().includes(query)
        );
      });
    }
    
    return filtered;
  }, [allData, searchQuery, activeFilter]);

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

  const getItemIcon = (item) => {
    if (item.type === 'login') {
      switch (item.event?.toLowerCase()) {
        case 'login':
          return 'log-in-outline';
        case 'logout':
          return 'log-out-outline';
        case 'failed':
          return 'alert-circle-outline';
        default:
          return 'person-circle-outline';
      }
    } else {
      switch (item.network?.toLowerCase()) {
        case 'ethereum':
          return 'logo-ethereum';
        case 'bitcoin':
          return 'logo-bitcoin';
        default:
          return 'swap-horizontal-outline';
      }
    }
  };

  const getItemColor = (item) => {
    if (item.type === 'login') {
      return item.event?.toLowerCase() === 'failed' ? Colors.error : Colors.accent;
    }
    return Colors.primary;
  };

  const renderSearchResult = (item, index) => (
    <TouchableOpacity
      key={item.id || index}
      style={styles.resultCard}
      onPress={() => {
        setSelectedItem(item);
        setIsModalVisible(true);
      }}
    >
      <View style={[styles.iconCircle, { backgroundColor: getItemColor(item) + '20' }]}>
        <Ionicons name={getItemIcon(item)} size={20} color={getItemColor(item)} />
      </View>
      
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>
            {item.type === 'login' ? (item.event || 'Login Event') : `Transaction to ${truncateAddress(item.toAddress, 6, 4)}`}
          </Text>
          <View style={[styles.typeChip, { backgroundColor: getItemColor(item) + '20' }]}>
            <Text style={[styles.typeChipText, { color: getItemColor(item) }]}>
              {item.type}
            </Text>
          </View>
        </View>
        
        <Text style={styles.resultSubtitle}>
          {item.type === 'login' 
            ? `${item.ipAddress || 'Unknown IP'} • ${formatTimestamp(item.timestamp)}`
            : `${item.valueSent || '0'} ETH • ${item.network || 'Unknown'}`
          }
        </Text>
        
        {item.type === 'transaction' && (
          <Text style={styles.resultHash}>
            {truncateAddress(item.txHash, 10, 6)}
          </Text>
        )}
      </View>
      
      <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Search Activity</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.gray} />
          <TextInput
            style={styles.searchInput}
            keyboardAppearance="dark"
            placeholder="Search transactions, IPs, addresses..."
            placeholderTextColor={Colors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {[
          { key: 'all', label: 'All', count: allData.length },
          { key: 'login', label: 'Logins', count: allData.filter(item => item.type === 'login').length },
          { key: 'transaction', label: 'Transactions', count: allData.filter(item => item.type === 'transaction').length },
        ].map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              activeFilter === filter.key && styles.activeFilterTab
            ]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Text style={[
              styles.filterTabText,
              activeFilter === filter.key && styles.activeFilterTabText
            ]}>
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <Text style={styles.loadingText}>Loading data...</Text>
          </View>
        ) : (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {filteredData.length} result{filteredData.length !== 1 ? 's' : ''} found
              </Text>
            </View>
            
            <ScrollView style={styles.resultsList} showsVerticalScrollIndicator={false}>
              {filteredData.length > 0 ? (
                filteredData.map(renderSearchResult)
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="search-outline" size={64} color={Colors.gray} />
                  <Text style={styles.emptyStateTitle}>No results found</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Try adjusting your search terms or filters
                  </Text>
                </View>
              )}
            </ScrollView>
          </>
        )}
      </View>

      {/* Detail Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {selectedItem?.type === 'login' ? 'Login Details' : 'Transaction Details'}
              </Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {selectedItem && (
                <>
                  {selectedItem.type === 'login' ? (
                    <>
                      <View style={styles.modalSection}>
                        <Text style={styles.sectionTitle}>Basic Information</Text>
                        {renderDetailRow('person-circle-outline', 'Event', selectedItem.event)}
                        {renderDetailRow('globe-outline', 'IP Address', selectedItem.ipAddress, true)}
                        {renderDetailRow('time-outline', 'Timestamp', formatTimestamp(selectedItem.timestamp))}
                      </View>

                      {selectedItem.location && (
                        <View style={styles.modalSection}>
                          <Text style={styles.sectionTitle}>Location</Text>
                          {renderDetailRow('location-outline', 'City', selectedItem.location.city)}
                          {renderDetailRow('flag-outline', 'Country', selectedItem.location.country)}
                          {renderDetailRow('map-outline', 'Region', selectedItem.location.region)}
                          {renderDetailRow('business-outline', 'Organization', selectedItem.location.org)}
                        </View>
                      )}

                      {selectedItem.deviceInfo && (
                        <View style={styles.modalSection}>
                          <Text style={styles.sectionTitle}>Device Information</Text>
                          {renderDetailRow('phone-portrait-outline', 'OS', selectedItem.deviceInfo.os)}
                          {renderDetailRow('code-slash-outline', 'Node Version', selectedItem.deviceInfo.nodeVersion)}
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Transaction Information</Text>
                      {renderDetailRow('arrow-forward-outline', 'To Address', selectedItem.toAddress, true)}
                      {renderDetailRow('logo-ethereum', 'Value Sent', `${selectedItem.valueSent || '0'} ETH`)}
                      {renderDetailRow('layers-outline', 'Network', selectedItem.network)}
                      {renderDetailRow('finger-print-outline', 'Transaction Hash', selectedItem.txHash, true)}
                      {renderDetailRow('globe-outline', 'IP Address', selectedItem.ipAddress, true)}
                    </View>
                  )}

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Raw Data</Text>
                    <View style={styles.rawDataContainer}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <Text style={styles.rawDataText}>
                          {JSON.stringify(selectedItem, null, 2)}
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
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    marginRight: Spacing.md,
    padding: Spacing.sm,
  },
  title: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: FontSizes.md,
    marginLeft: Spacing.md,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeFilterTab: {
    backgroundColor: Colors.accent + '20',
    borderColor: Colors.accent,
  },
  filterTabText: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  activeFilterTabText: {
    color: Colors.accent,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.gray,
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
  },
  resultsHeader: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  resultsCount: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  resultsList: {
    flex: 1,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  resultContent: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  resultTitle: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    flex: 1,
  },
  typeChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: Spacing.sm,
  },
  typeChipText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    textTransform: 'uppercase',
  },
  resultSubtitle: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    marginBottom: 2,
  },
  resultHash: {
    color: Colors.gray,
    fontSize: FontSizes.xs,
    fontFamily: 'monospace',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyStateTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semiBold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyStateSubtitle: {
    color: Colors.gray,
    fontSize: FontSizes.md,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
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
    maxHeight: '85%',
    paddingBottom: Spacing.lg,
    flex:1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
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
  sectionTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
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
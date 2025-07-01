import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  SafeAreaView,
  FlatList
} from "react-native";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const tokenData = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      balance: '0.00234',
      usdValue: '156.78',
      changePercent: 2.45,
      iconName: 'bitcoin',
      iconColor: '#F7931A'
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      balance: '1.2456',
      usdValue: '2,834.56',
      changePercent: -1.23,
      iconName: 'ethereum',
      iconColor: '#627EEA'
    },
    {
      name: 'Cardano',
      symbol: 'ADA',
      balance: '1,000.00',
      usdValue: '450.00',
      changePercent: 5.67,
      iconName: 'coins',
      iconColor: '#0033AD'
    },
    {
      name: 'Polkadot',
      symbol: 'DOT',
      balance: '25.789',
      usdValue: '123.45',
      changePercent: 0.89,
      iconName: 'circle',
      iconColor: '#E6007A'
    },
    {
      name: 'Chainlink',
      symbol: 'LINK',
      balance: '156.23',
      usdValue: '987.65',
      changePercent: -3.21,
      iconName: 'link',
      iconColor: '#375BD2'
    }
  ];

// Reusable Token List Item Component
const TokenListItem = ({ 
  name = "Loading...", 
  symbol = "ERR", 
  balance = "Err...", 
  usdValue = "Err...", 
  changePercent = "Err...", 
  iconName = 'coins',
  iconColor = '#4ECDC4',
  onPress 
}) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const isPositive = changePercent >= 0;

  return (
    <Animated.View style={[styles.tokenItem, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        style={styles.tokenContent}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <View style={styles.tokenLeft}>
          <View style={[styles.tokenIcon, { backgroundColor: iconColor + '20' }]}>
            <FontAwesome5 name={iconName} size={20} color={iconColor} />
          </View>
          <View style={styles.tokenInfo}>
            <Text style={styles.tokenName}>{name}</Text>
            <Text style={styles.tokenSymbol}>{symbol}</Text>
          </View>
        </View>
        
        <View style={styles.tokenRight}>
          <Text style={styles.tokenBalance}>{balance}</Text>
          <View style={styles.tokenValueRow}>
            <Text style={styles.tokenUsdValue}>${usdValue}</Text>
            <Text style={[
              styles.tokenChange, 
              { color: isPositive ? '#4ECDC4' : '#FF6B6B' }
            ]}>
              {isPositive ? '+' : ''}{changePercent}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Action Button Component
const ActionButton = ({ icon, label, onPress, color = '#16112B' }) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.actionButton, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        style={[styles.actionButtonContent, { backgroundColor: color }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={[styles.actionIcon, { backgroundColor: color }]}>
          <FontAwesome5 name={icon} size={16} color="#FFFFFF" />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Main Homepage Component
export default function Homepage() {
  const [refreshing, setRefreshing] = useState(false);

  
  const totalBalance = tokenData.reduce((sum, token) => sum + parseFloat(token.usdValue.replace(',', '')), 0);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0A19" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => console.log("hamburg menu pressed")}>
          <Ionicons name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={() => console.log("qr scanner pressed")}>
            <Ionicons name="scan" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => console.log("search menu pressed")}>
            <Ionicons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      >
        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
            <View style={styles.balanceChange}>
              <FontAwesome5 name="arrow-up" size={12} color="#4ECDC4" />
              <Text style={styles.balanceChangeText}>+$156.78 (+2.45%)</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <ActionButton 
            icon="shopping-cart" 
            label="Buy" 
            color="#16112B"
            onPress={() => console.log('Buy pressed')}
          />
          <ActionButton 
            icon="download" 
            label="Receive" 
            color="#16112B"
            onPress={() => console.log('Receive pressed')}
          />
          <ActionButton 
            icon="paper-plane" 
            label="Send" 
            color="#16112B"
            onPress={() => console.log('Send pressed')}
          />
          <ActionButton 
            icon="chart-line" 
            label="Activity" 
            color="#16112B"
            onPress={() => console.log('Activity pressed')}
          />
        </View>

        {/* Token List Section */}
        <View style={styles.tokenSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Token List</Text>
            <TouchableOpacity onPress={() => console.log('See all tokens pressed')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={tokenData}
            keyExtractor={(item, index) => `${item.symbol}-${index}`}
            renderItem={({ item }) => (
              <TokenListItem
                name={item.name}
                symbol={item.symbol}
                balance={item.balance}
                usdValue={item.usdValue}
                changePercent={item.changePercent}
                iconName={item.iconName}
                iconColor={item.iconColor}
                onPress={() => console.log(`${item.name} pressed`)}
              />
            )}
            ItemSeparatorComponent={() => (
              <View style={styles.separator} />
            )}
            contentContainerStyle={styles.tokenList}
          />

        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log("Home pressed")}>
          <Ionicons name="home" size={24} color="#7B68EE" />
          <Text style={[styles.navLabel, { color: '#7B68EE' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log("Swap pressed")}>
          <FontAwesome5 name="exchange-alt" size={20} color="#6B7280" />
          <Text style={styles.navLabel}>Swap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log("Activity pressed")}>
          <Ionicons name="time" size={24} color="#6B7280" />
          <Text style={styles.navLabel}>Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log("More info pressed")}>
          <Ionicons name="card" size={24} color="#6B7280" />
          <Text style={styles.navLabel}>More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0A19',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#0D0A19',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  balanceSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  balanceCard: {
    backgroundColor: '#16112B',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C1E51',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceChangeText: {
    fontSize: 14,
    color: '#4ECDC4',
    marginLeft: 6,
    fontWeight: '500',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonContent: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C1E51',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  tokenSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#7B68EE',
    fontWeight: '500',
  },
  tokenList: {
    backgroundColor: '#16112B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C1E51',
    overflow: 'hidden', // optional for rounded corners
  },

  separator: {
    height: 1,
    backgroundColor: '#2C1E51',
  },
  tokenContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  tokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tokenIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  tokenSymbol: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  tokenRight: {
    alignItems: 'flex-end',
  },
  tokenBalance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  tokenValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenUsdValue: {
    fontSize: 13,
    color: '#9CA3AF',
    marginRight: 8,
  },
  tokenChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#16112B',
    paddingVertical: 12,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#2C1E51',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
});

// export default Homepage;
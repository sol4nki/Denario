import React, { useState, useEffect } from "react";
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
  FlatList,
  Image,
  Platform,
  RefreshControl,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  CommonStyles,
} from "../styles/theme";

import Constants from "expo-constants";
import fetchCoinList from "../services/coinList";
import fetchBalance from "../services/balanceFetch";

const statusBarHeight =
  Platform.OS === "android" ? Constants.statusBarHeight + 8 : 0;

const { width } = Dimensions.get("window");
function formatMarketCap(num, digits = 2) {
  const lookup = [
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "K" },
    { value: 1, symbol: "" },
  ];

  const absNum = Math.abs(num);
  const item = lookup.find((i) => absNum >= i.value) || {
    value: 0,
    symbol: "",
  };
  const scaled = num / item.value;

  return item.value === 0
    ? num.toString()
    : scaled.toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") +
        item.symbol;
}
const TokenListItem = ({
  name = "Loading...",
  symbol = "ERR",
  balance = "Err...",
  usdValue = "Err...",
  changePercent = "Err...",
  iconName = "coins",
  iconColor = "#4ECDC4",
  onPress,
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
    <Animated.View
      style={[styles.tokenItem, { transform: [{ scale: scaleValue }] }]}
    >
      <TouchableOpacity
        style={styles.tokenContent}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <View style={styles.tokenLeft}>
          <View style={[styles.tokenIcon]}>
            <Image
              source={{ uri: iconName }}
              style={{ width: 28, height: 28, borderRadius: 14 }}
            />
          </View>
          <View style={styles.tokenInfo}>
            <Text style={styles.tokenName}>{name}</Text>
            <Text style={styles.tokenSymbol}>{symbol.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.tokenRight}>
          <Text style={styles.tokenBalance}>{balance}</Text>
          <View style={styles.tokenValueRow}>
            <Text style={styles.tokenUsdValue}>${usdValue}</Text>
            <Text
              style={[
                styles.tokenChange,
                { color: isPositive ? "#4ECDC4" : "#FF6B6B" },
              ]}
            >
              {isPositive ? "+" : ""}
              {changePercent}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Action Button Component
const ActionButton = ({ icon, label, onPress, color = "#16112B" }) => {
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
    <Animated.View
      style={[styles.actionButton, { transform: [{ scale: scaleValue }] }]}
    >
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
export default function Homepage({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [tokenData, setTokenData] = useState([]);
  const [totalBalance, setBalance] = useState(null);

  const loadTokenData = async () => {
    try {
      const data = await fetchCoinList();
      setTokenData(data);
    } catch (error) {
      console.error("Failed to fetch token data:", error);
    }
  };

  useEffect(() => {
    loadTokenData();
  }, []);

  const loadBalance = async () => {
    try {
      const data = await fetchBalance();
      setBalance(parseFloat(data.balance) || 0);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setBalance(0);
    }
  };

  useEffect(() => {
    loadBalance();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadTokenData(),
        loadBalance(),
      ]);
    } catch (error) {
      console.error('Failed to refresh homepage data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0A19" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoButton}
          onPress={() => navigation.navigate("More")}
        >
          <View style={styles.logoCircle}>
            <Image
              source={require("../assets/main_logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("QRscanner")}
          >
            <Ionicons name="scan" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("Search")}
          >
            <Ionicons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#4ECDC4"
            colors={["#4ECDC4"]}
          />
        }
      >
        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>
              
              {(totalBalance || 0).toLocaleString("en-US", {
                minimumFractionDigits: 5,
              })} ETH
            </Text>
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
            onPress={() => navigation.navigate("Buy")}
          />
          <ActionButton
            icon="download"
            label="Receive"
            color="#16112B"
            onPress={() => navigation.navigate("Receive")}
          />
          <ActionButton
            icon="paper-plane"
            label="Send"
            color="#16112B"
            onPress={() => navigation.navigate("Send")}
          />
          <ActionButton
            icon="chart-line"
            label="Activity"
            color="#16112B"
            onPress={() => navigation.navigate("Activity")}
          />
        </View>

        {/* Token List Section */}
        <View style={styles.tokenSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Token List</Text>
            <TouchableOpacity
              onPress={() => console.log("See all tokens pressed")}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {tokenData.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading tokens...</Text>
            </View>
          ) : (
            <FlatList
              data={tokenData}
              keyExtractor={(item, index) => `${item.symbol}-${index}`}
              renderItem={({ item,index }) => (
                <TokenListItem
                  name={item.name || "Unknown"}
                  symbol={item.symbol || "N/A"}
                  balance={item.balance || "0.00"}
                  usdValue={formatMarketCap(
                    (item.current_price || 0).toFixed(5),
                  )}
                  changePercent={
                    item.price_change_percentage_24h?.toFixed(2) ?? 0
                  }
                  iconName={item.image || "https://via.placeholder.com/28"}
                  iconColor="#FFA500"
                  onPress={() =>
                    navigation.navigate("CoinDetails", { coinId: item.id , 
                      coinList:tokenData.map (token => token.id), 
                      currentIndex: index})
                  }
                />
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.tokenList}
            />
          )}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: statusBarHeight,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background,
  },
  headerButton: {
    paddingHorizontal: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  headerRight: {
    flexDirection: "row",
  },
  scrollView: {
    flex: 1,
  },
  balanceSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.massive,
  },
  balanceCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: Spacing.massive,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  balanceLabel: {
    fontSize: FontSizes.base,
    color: Colors.gray,
    marginBottom: Spacing.md,
  },
  balanceAmount: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  balanceChange: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceChangeText: {
    fontSize: FontSizes.base,
    color: Colors.green,
    marginLeft: Spacing.sm,
    fontWeight: FontWeights.medium,
  },
  actionsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.massive,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonContent: {
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    backgroundColor: Colors.accent,
  },
  actionLabel: {
    fontSize: FontSizes.sm,
    color: Colors.white,
    fontWeight: FontWeights.medium,
  },
  tokenSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  seeAllText: {
    fontSize: FontSizes.base,
    color: Colors.accent,
    fontWeight: FontWeights.medium,
  },
  tokenList: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },
  tokenContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
  },
  tokenLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  tokenIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
    backgroundColor: Colors.accent + "20",
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    color: Colors.white,
    marginBottom: 2,
  },
  tokenSymbol: {
    fontSize: FontSizes.base,
    color: Colors.gray,
  },
  tokenRight: {
    alignItems: "flex-end",
  },
  tokenBalance: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    color: Colors.white,
    marginBottom: 2,
  },
  tokenValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tokenUsdValue: {
    fontSize: FontSizes.base,
    color: Colors.gray,
    marginRight: Spacing.md,
  },
  tokenChange: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: Colors.cardBackground,
    paddingVertical: 12,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: FontSizes.xs,
    color: Colors.navInactive,
    marginTop: 4,
    fontWeight: FontWeights.medium,
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
    justifyContent: "center",
    alignItems: "center",
  },
  headerLogo: {
    width: 24,
    height: 24,
  },
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
  },
});

// export default Homepage;

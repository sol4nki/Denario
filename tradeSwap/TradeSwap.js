import React, { useState } from 'react';
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
  SafeAreaView
} from 'react-native';
import { FontAwesome5,Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';


//going to add api for different crypto with the help of ai//
const Trending = [
  { name: "Trending 1", desc: "short description" },
  { name: "Trending 2", desc: "short desc" },
  { name: "Trending 3", desc: "same thing" },
  { name: "Trending 4", desc: "short description" },
  { name: "Trending 5", desc: "short desc" },
  { name: "Trending 6", desc: "same thing" },
  { name: "Trending 7", desc: "same thing" },
  { name: "Trending 8", desc: "same thing" },
  { name: "Trending 9", desc: "same thing" },
  { name: "Trending 10", desc: "same thing" },
  { name: "Trending 11", desc: "same thing" },
];

export default function TradeSwap() {
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');

  const onSelectPayToken = () => console.log('Pay token selected');
  const onSelectReceiveToken = () => console.log('Receive token selected');
  const onSwapPress = () => console.log('Swap pressed');

  return (
    <SafeAreaView style={CommonStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => console.log("hamburg menu pressed")}> 
          <Ionicons name="menu" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Swap</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={() => console.log("search menu pressed")}> 
            <Ionicons name="search" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      {/* ─── Scrollable Content ─── */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Swap Tokens ─── */}
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
                <Image source={require('./assets/icon.png')} style={styles.tokenIcon} />
                <Text style={styles.tokenSymbol}>SOL</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
          {/* Swap Button */}
          <TouchableOpacity
            style={styles.swapButton}
            onPress={onSwapPress}
            activeOpacity={0.7}
          >
            <Ionicons name="swap-vertical" size={24} color={Colors.white} />
          </TouchableOpacity>
          {/* You Receive */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>You Receive</Text>
            <View style={styles.row}>
              <TextInput
                keyboardAppearance="dark"
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor={Colors.gray}
                keyboardType="numeric"
                value={receiveAmount}
                onChangeText={setReceiveAmount}
              />
              <TouchableOpacity
                style={styles.tokenButton}
                onPress={onSelectReceiveToken}
                activeOpacity={0.7}
              >
                <Image source={require('./assets/adaptive-icon.png')} style={styles.tokenIcon} />
                <Text style={styles.tokenSymbol}>USDC</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* ─── Trending Tokens ─── */}
        <Text style={styles.trendingTitle}>Trending Tokens</Text>
        {Trending.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.simpleCard}
            onPress={() => console.log("Pressed Trending Token:", item.name)}
            activeOpacity={0.6}
          >
            <View style={styles.iconCircle} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
        {/* ─── Disclaimer ─── */}
        <Text style={styles.disclaimerText}>
          Trending token lists are generated using market data from various third party providers
          including CoinGecko, Birdeye and Jupiter and based on popular tokens swapped by Phantom
          users via the Swapper over the stated time period. Past performance is not indicative of
          future performance.
        </Text>
      </ScrollView>
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log("Home pressed")}> 
          <Ionicons name="home" size={24} color={Colors.navInactive} />
          <Text style={[styles.navLabel, { color: Colors.navInactive }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log("Swap pressed")}> 
          <FontAwesome5 name="exchange-alt" size={20} color={Colors.accent} />
          <Text style={[styles.navLabel, { color: Colors.accent }]}>Swap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log("Activity pressed")}> 
          <Ionicons name="time" size={24} color={Colors.navInactive} />
          <Text style={[styles.navLabel, { color: Colors.navInactive }]}>Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log("More info pressed")}> 
          <Ionicons name="card" size={24} color={Colors.navInactive} />
          <Text style={styles.navLabel}>More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 20,
  },
  headerButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  headerRight: {
    flexDirection: 'row',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.massive,
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
  tokenIcon: {
    width: 20,
    height: 20,
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
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    paddingVertical: 12,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 11,
    color: Colors.navInactive,
    marginTop: 4,
    fontWeight: '500',
  },
});
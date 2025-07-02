import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,

} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';

function CoinDetailsHeader({ coinId, symbol, marketCapRank }) {
  
  return (
    <View style={styles.headerStyle}>
      <Ionicons
        name="chevron-back-sharp"
        size={24}
        color={Colors.accent}
      />
      <View style={styles.detailsContainer}>
        <FontAwesome5 name="bitcoin" size={30} color="#f2a900" />
        <Text style={styles.coinName}>{symbol.toUpperCase()}</Text>
        <View style={styles.rankContainer}>
          <Text style={{ color: Colors.white, fontWeight: FontWeights.bold, fontSize: FontSizes.md }}>
            #{marketCapRank}
          </Text>
        </View>
      </View>
      <FontAwesome5
        name={"star"}
        size={24}
        color={Colors.white}
      />
    </View>
  );
}

export default function CoinDetails() {
  const coinChangeVal = "100";
  const coinVal = "1234324.3143142132";
  const changeSign = coinChangeVal > 0 ? '+' : '-';

  const [textWidth, setTextWidth] = useState(0);

  // const icons = [
  //   'caret-back-outline',
  //   'repeat-outline',
  //   'logo-usd',
  //   'caret-forward-outline'
  // ];

  const coinData = {
    id: "bitcoin",
    symbol: "BTC",
    network: "Bitcoin",
    mintAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    marketCap: "$1.2T",
    totalSupply: "21,000,000",
    circulatingSupply: "19,500,000",
    holders: "1.5M",
    contractVerified: true,
    topHolders: "Own ~10%",
    mintable: false,
    authority: "Decentralized"
  };

  const shortenAddress = (address) => {
    if (!address) return '';
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  const infoData = [
    { label: 'Symbol', value: coinData.symbol },
    { label: 'Network', value: coinData.network },
    { label: 'Mint Address', value: shortenAddress(coinData.mintAddress) },
    { label: 'Market Cap', value: coinData.marketCap },
    { label: 'Total Supply', value: coinData.totalSupply },
    { label: 'Circulating Supply', value: coinData.circulatingSupply },
    { label: 'Holders', value: coinData.holders }
  ];

  const securityData = [
    { label: 'Contract Verified', value: coinData.contractVerified ? 'Yes' : 'No' },
    { label: 'Top 10 Holders', value: coinData.topHolders },
    { label: 'Mintable', value: coinData.mintable ? 'Yes' : 'No' },
    { label: 'Authority', value: coinData.authority },
  ];

  const InfoRow = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  const actionButtons = [
    { icon: 'arrow-left', label: 'Back' },
    { icon: 'sync-alt', label: 'Refresh' },
    { icon: 'dollar-sign', label: 'USD' },
    { icon: 'arrow-right', label: 'Next' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.stickyHeader}>
        <CoinDetailsHeader
          coinId="bitcoin"
          symbol="BTC"
          marketCapRank="1"
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.coinInfoStyle, {width:'100%'}] }>
          <ScrollView horizontal showsHorizontalScrollIndicator style={{ width: '100%' }} contentContainerStyle={{ flexGrow: 1 }}>
            <Text
              style={styles.priceStyle}
              numberOfLines={1}
              ellipsizeMode="clip"
              minWidth= {(coinVal.length)*(24)}
              onPress={() => console.log(coinVal.length * 40)}
            >
              ${coinVal}
            </Text>
          </ScrollView>
          <View style={[
            styles.changeValContainer,
            { backgroundColor: coinChangeVal > 0 ? Colors.green : '#FF6B6B' },
            { shadowColor: coinChangeVal > 0 ? Colors.green : '#FF6B6B' }
          ]}>
            <Text style={styles.coinChangeValStyle}>
              {changeSign}
              {coinChangeVal}%
            </Text>
          </View>
        </View>
        <View style={styles.graphBox} />
        <View style={styles.miniGraphBox} />
        <View style={styles.buttonsContainer}>
          {actionButtons.map((btn, index) => (
            <TouchableOpacity key={index} style={styles.button}>
              <FontAwesome5 name={btn.icon} size={24} color={Colors.accent} />
              <Text style={styles.buttonLabel}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.coinExtraDetails}>
          <Text style={styles.coinDetailsTitle}> Info </Text>
          {infoData.map((item, index) => (
            <InfoRow key={index} label={item.label} value={item.value} />
          ))}
          <Text style={styles.coinDetailsTitle}> Security </Text>
          {securityData.map((item, index) => (
            <InfoRow key={index} label={item.label} value={item.value} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  stickyHeader: {
    backgroundColor: Colors.background,
    elevation: 10,
  },
  headerStyle: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinName: {
    color: Colors.white,
    fontWeight: FontWeights.bold,
    marginHorizontal: Spacing.md,
    fontSize: FontSizes.lg,
  },
  rankContainer: {
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 5,
    marginLeft: Spacing.sm,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  coinInfoStyle: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'column',
    alignItems: 'center',
    
  },
  priceStyle: {
    color: Colors.white,
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    maxWidth: '100%',
    alignSelf: 'center',
  },
  coinChangeValStyle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.white,
    borderRadius: 5,
  },
  changeValContainer: {
    paddingHorizontal: Spacing.md,
    borderRadius: 5,
    elevation: 3,
    shadowColor: Colors.green,
    backgroundColor: Colors.green,
    marginTop: Spacing.sm,
  },
  button: {
    flex: 1,
    margin: Spacing.sm,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowRadius: 10,
    elevation: 5,
    paddingVertical: Spacing.lg,
    minWidth: 70,
  },
  buttonLabel: {
    color: Colors.accent,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginTop: 6,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  graphBox: {
    marginTop: Spacing.xl,
    alignSelf: 'center',
    width: '90%',
    height: 250,
    borderColor: Colors.border,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    // marginLeft: '3%',
    // marginRight: '3%',
  },
  miniGraphBox: {
    marginTop: Spacing.md,
    alignSelf: 'center',
    width: '75%',
    height: 50,
    borderColor: Colors.border,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    // marginLeft: '7%',
    // marginRight: '7%',
  },
  coinExtraDetails: {
    flexDirection: 'column',
    marginTop: Spacing.xl,
  },
  coinDetailsTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    marginVertical: Spacing.md,
    marginLeft: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: 10,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.xl,
    shadowColor: Colors.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    color: Colors.gray,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    flex: 1,
  },
  value: {
    color: Colors.white,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
    textAlign: 'right',
    flex: 1,
  },
});


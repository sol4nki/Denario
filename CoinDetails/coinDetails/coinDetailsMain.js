import React from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from "react-native";
import CoinDetailsHeader from  "../coinDetailHeader/coinDetailsHeader"
import { Ionicons } from "@expo/vector-icons";
import { useFonts, Quicksand_400Regular, Quicksand_600SemiBold } from '@expo-google-fonts/quicksand';
import styles from './styles';




export default function CoinDetails() {
  const coinChangeVal = "100";
  const coinVal = "1234324.3143142132";
  const changeSign = coinChangeVal > 0 ? '+' : '-';
  let [fontsLoaded] = useFonts({
  Quicksand_400Regular,
  Quicksand_600SemiBold,
});



  const icons = [
    'caret-back-outline',
    'repeat-outline',
    'logo-usd',
    'caret-forward-outline'
  ];

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

  return (
  <SafeAreaView style={styles.safeArea}>
    <StatusBar barStyle="light-content" backgroundColor="#0D0A19" />

    <View style={styles.stickyHeader}>
      <CoinDetailsHeader
        coinId="bitcoin"
        symbol="BTC"
        marketCapRank="1"
      />
    </View>

    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.coinInfoStyle}>
        <Text numberOfLines={1} ellipsizeMode="clip" style={styles.priceStyle}>
          ${coinVal}
        </Text>

        <View style={[
          styles.changeValContainer,
          { backgroundColor: coinChangeVal > 0 ? 'lime' : 'red' },
          { shadowColor: coinChangeVal > 0 ? 'lime' : 'red' }
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
        {icons.map((iconName, index) => (
    <TouchableOpacity key={index} style={styles.button}>
      <Ionicons name={iconName} size={28} color="white" />
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


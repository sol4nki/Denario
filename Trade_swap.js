import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

export default function App() {
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');

  const onSelectPayToken = () => console.log('Pay token selected');
  const onSelectReceiveToken = () => console.log('Receive token selected');
  const onSwapPress = () => console.log('Swap pressed');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#0D0A19" />
       
      {/* ─── Top Bar ─── */}
      
     <View style={styles.topBar}>
      {/*backbutton*/}
  <TouchableOpacity
    onPress={() => console.log('Back pressed')}
    activeOpacity={0.6}
    style={styles.topBarSideButton}
  >
    <Ionicons name="arrow-back-outline" size={24} color="#FFF" />
  </TouchableOpacity>

  <Text style={styles.topBarText}>Token Swapper</Text>

    {/*settingsbutton*/}
  <TouchableOpacity
    onPress={() => console.log('Settings pressed')}
    activeOpacity={0.6}
    style={styles.topBarSideButton}
  >
    <Ionicons name="settings-outline" size={24} color="#FFF" />
  </TouchableOpacity>
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
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor="#777"
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
                <Ionicons name="chevron-down" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Swap Button */}
          <TouchableOpacity
            style={styles.swapButton}
            onPress={onSwapPress}
            activeOpacity={0.7}
          >
            <Ionicons name="swap-vertical" size={24} color="#FFF" />
          </TouchableOpacity>

          {/* You Receive */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>You Receive</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor="#777"
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
                <Ionicons name="chevron-down" size={16} color="#FFF" />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0A19',
  },
 topBar: {
  height: 80,
  backgroundColor: '#16112B',
  borderBottomWidth: 1,
  borderBottomColor: '#29273A',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  zIndex: 1000,
},

topBarText: {
  paddingTop:5,
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: 'bold',
},

topBarSideButton: {
  padding: 4,
  paddingTop: 14,
},
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  swapSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  card: {
    width: '100%',
    backgroundColor: '#1C172E',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  cardLabel: {
    color: '#AAA',
    fontSize: 14,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 24,
  },
  tokenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A42E0',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tokenIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  tokenSymbol: {
    color: '#FFF',
    marginRight: 4,
    fontWeight: '600',
  },
  swapButton: {
    position: 'absolute',
    top: 100,
    backgroundColor: '#4A42E0',
    padding: 12,
    borderRadius: 24,
    zIndex: 10,
  },
  trendingTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  simpleCard: {
    backgroundColor: '#291B4C',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D85EF3',
    marginRight: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: '#A0A0A0',
    fontSize: 13,
  },
  disclaimerText: {
    color: '#FFFFFF',
    opacity: 0.5,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

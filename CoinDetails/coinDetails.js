import React, { useState, useEffect } from 'react';
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
  Dimensions,
  Linking,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';
import fetchCoinData, { fetchCoinMarketChart } from '../services/coinData';
import { LineChart } from 'react-native-chart-kit';
import Svg, { Path, Line, Circle } from 'react-native-svg';
import Constants from "expo-constants";

import { useNavigation } from '@react-navigation/native';

const statusbarHeight = Platform.OS === 'android' ? Constants.statusBarHeight : 0;

const CustomLineChart = ({ data, width, height, onTouch }) => {
  if (!data || data.length === 0) return null;

  const prices = data.map(item => item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  const pathData = data.map((item, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((item.price - minPrice) / priceRange) * height;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <Svg width={width} height={height} style={{ position: 'absolute' }}>
      <Path
        d={pathData}
        stroke="white"
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
};

function formatMarketCap(num, digits=2) {

  if (num === null || num === undefined || isNaN(num)) {
    return 'N/A';
  }
  
  const lookup = [
    { value: 1e12, symbol: 'T' },  
    { value: 1e9, symbol: 'B' },  
    { value: 1e6, symbol: 'M' },   
    { value: 1e3, symbol: 'K' },   
    { value: 1, symbol: '' },      
  ];

  const absNum = Math.abs(num);
  const item = lookup.find(i => absNum >= i.value) || { value: 0, symbol: '' };
  const scaled = num / item.value;

  if (item.value === 0) {
    return String(num);
  }
  
  const formatted = scaled.toFixed(digits);
  const trimmed = formatted.replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1');
  return trimmed + item.symbol;
}


function CoinDetailsHeader({ coinId, symbol, marketCapRank, coinIcon }) {
  const navigation = useNavigation();
  return (
    <View style={styles.headerStyle}>
      <Ionicons
        name="chevron-back-sharp"
        size={24}
        color={Colors.accent}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.detailsContainer}>
        <Image source={{ uri: coinIcon }} style={styles.coinIcon} />
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

export default function CoinDetails({ route, navigation }) {
  const screenWidth = Dimensions.get('window')?.width || 350;
   const { coinId, coinList, currentIndex } = route.params;
  
  const [tokenData, setTokenData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [cursorPosition, setCursorPosition] = useState(null);
  const [textWidth, setTextWidth] = useState(0);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(null);

  const loadTokenData = async (coinId) => {
    try {
      const data = await fetchCoinData({ coinId });
      setTokenData(data);
    } catch (error) {
      console.error("Failed to fetch token data:", error);
    }
  };

  const loadChartData = async (coinId, timeRange) => {
    try {
      const now = Math.floor(Date.now() / 1000);
      let from;
      
      switch (timeRange) {
        case '1d':
          from = now - (24 * 60 * 60);
          break;
        case '7d':
          from = now - (7 * 24 * 60 * 60);
          break;
        case '30d':
          from = now - (30 * 24 * 60 * 60);
          break;
        default:
          from = now - (7 * 24 * 60 * 60);
      }

      const data = await fetchCoinMarketChart({ coinId, from, to: now });
      
      const prices = data.prices.map(([timestamp, price]) => ({
        timestamp,
        price,
        date: new Date(timestamp).toLocaleDateString(),
        time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      
     
      let filteredPrices = prices;
      if (prices.length > 50) {
        const step = Math.ceil(prices.length / 50);
        filteredPrices = prices.filter((_, index) => index % step === 0);
      }
      
      setChartData(filteredPrices);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return; 
    
    setIsRefreshing(true);
    try {
      const { coinId } = route.params;
      await Promise.all([
        loadTokenData(coinId),
        loadChartData(coinId, selectedTimeRange)
      ]);
      console.log('Data refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const { coinId } = route.params;
    loadTokenData(coinId);
    loadChartData(coinId, selectedTimeRange);
  }, [selectedTimeRange]);

  if (!tokenData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const coinChangeVal = tokenData.market_data.price_change_percentage_24h;
  const currentPrice = tokenData.market_data?.current_price?.usd || '0';
  const coinVal = displayPrice || currentPrice;
  

  const infoData = [
    { label: 'Symbol', value: tokenData.symbol.toUpperCase() || 'N/A' },
    { label: 'Market Cap', value: formatMarketCap(tokenData.market_data.market_cap.usd) || 'N/A' },
    { label: 'Total Supply', value: formatMarketCap(tokenData.market_data.total_supply) || 'N/A' },
    { label: 'Circulating Supply', value: formatMarketCap(tokenData.market_data.circulating_supply) || 'N/A' },
    { label: '24h Vol', value: formatMarketCap(tokenData.market_data.total_volume.usd) || 'N/A' },
    { label: 'Sentiment', value: <Text>
      <Text style={{ color: 'green' }}> {tokenData.sentiment_votes_up_percentage || 0}%  </Text>
      <Text style={{ color: 'white' }}> | </Text>
      <Text style={{ color: 'red' }}> {tokenData.sentiment_votes_down_percentage || 0}%</Text>
    </Text> },
    { label: 'All-Time High', value: `$${formatMarketCap(tokenData.market_data?.ath?.usd)}` },
    { label: 'All-Time Low', value: `$${formatMarketCap(tokenData.market_data?.atl?.usd)}` },
    { label: '24h Low / High', value: `$${formatMarketCap(tokenData.market_data?.low_24h?.usd)} / $${formatMarketCap(tokenData.market_data?.high_24h?.usd)}` },
  ];


  const InfoRow = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  const actionButtons = [
    { icon: 'arrow-left', label: 'Back', onPress: () => console.log('Back pressed') },
    { icon: 'sync-alt', label: 'Refresh', onPress: handleRefresh },
    { icon: 'dollar-sign', label: 'USD', onPress: () => console.log('USD pressed') },
    { icon: 'arrow-right', label: 'Next', onPress: () => {navigation.replace ("CoinDetails" ,
      {
        coinId: coinList [ currentIndex+1],
      coinList,
    currentIndex:currentIndex+1
})} },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.stickyHeader}>
        <CoinDetailsHeader
          coinId={tokenData.id}
          symbol={tokenData.symbol}
          marketCapRank={tokenData.market_cap_rank}
          coinIcon={tokenData.image.small}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
       
        <View style={[styles.coinInfoStyle, { width: '100%' }] }>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ width: '100%' }}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: String(coinVal).length > 15 ? 'flex-start' : 'center'
            }}
          >
            <Text
              style={[
                styles.priceStyle,
                { textAlign: String(coinVal).length > 15 ? 'left' : 'center' }
              ]}
              numberOfLines={1}
              ellipsizeMode="clip"
              minWidth={(String(coinVal).length) * (24)}
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
              {coinChangeVal.toFixed(3)}%
            </Text>
          </View>
        </View>
      
        <View style={styles.chartCardImproved}>
        
          {cursorPosition && (
            <View style={styles.dateTimeDisplay}>
              <Text style={styles.dateTimeText}>
                {cursorPosition.date} {cursorPosition.time}{'\n'}
                <Text style={{ fontWeight: 'bold', color: Colors.accent }}>${cursorPosition.price.toFixed(4)}</Text>
              </Text>
            </View>
          )}
          {chartData && chartData.length > 0 ? (
            <View
              style={styles.chartTouchContainerImproved}
              onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                setChartDimensions({ width, height });
              }}
              onTouchStart={(event) => {
                const { locationX, locationY } = event.nativeEvent;
                const chartWidth = chartDimensions.width;
                const chartHeight = chartDimensions.height;
                
              
                const xRatio = Math.max(0, Math.min(1, locationX / chartWidth));
                const dataIndex = Math.floor(xRatio * (chartData.length - 1));
                
                if (dataIndex >= 0 && dataIndex < chartData.length) {
                  const dataPoint = chartData[dataIndex];
                  
                
                  const prices = chartData.map(d => d.price);
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);
                  const priceRange = maxPrice - minPrice;
                  
                 
                  const yRatio = priceRange > 0 ? (dataPoint.price - minPrice) / priceRange : 0.5;
                  const calculatedY = chartHeight * (1 - yRatio);
                  
                  setCursorPosition({
                    x: locationX,
                    y: calculatedY,
                    price: dataPoint.price,
                    date: dataPoint.date,
                    time: dataPoint.time
                  });
                  setDisplayPrice(dataPoint.price);
                }
              }}
              onTouchMove={(event) => {
                const { locationX, locationY } = event.nativeEvent;
                const chartWidth = chartDimensions.width;
                const chartHeight = chartDimensions.height;
                
               
                const xRatio = Math.max(0, Math.min(1, locationX / chartWidth));
                const dataIndex = Math.floor(xRatio * (chartData.length - 1));
                
                if (dataIndex >= 0 && dataIndex < chartData.length) {
                  const dataPoint = chartData[dataIndex];
                  
         
                  const prices = chartData.map(d => d.price);
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);
                  const priceRange = maxPrice - minPrice;
                  
                 
                  const yRatio = priceRange > 0 ? (dataPoint.price - minPrice) / priceRange : 0.5;
                  const calculatedY = chartHeight * (1 - yRatio);
                  
                  setCursorPosition({
                    x: locationX,
                    y: calculatedY,
                    price: dataPoint.price,
                    date: dataPoint.date,
                    time: dataPoint.time
                  });
                  setDisplayPrice(dataPoint.price);
                }
              }}
              onTouchEnd={() => {
                setCursorPosition(null);
                setDisplayPrice(null); 
              }}
            >
              <CustomLineChart
                data={chartData}
                width={chartDimensions.width}
                height={chartDimensions.height}
                gradient
              />
          
              {cursorPosition && (
                <View style={[styles.cursorImproved, { left: cursorPosition.x, top: cursorPosition.y }]}> 
                  <View style={styles.cursorDotImproved} />
                </View>
              )}
            </View>
          ) : (
            <View style={styles.loadingChartContainer}>
              <Text style={styles.loadingChartText}>Loading chart...</Text>
            </View>
          )}
        </View>
      
        <View style={styles.timeRangeImprovedContainer}>
          {['1D', '7D', '30D'].map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangePillImproved,
                selectedTimeRange === range.toLowerCase() && styles.timeRangePillActiveImproved
              ]}
              onPress={() => setSelectedTimeRange(range.toLowerCase())}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.timeRangeTextImproved,
                selectedTimeRange === range.toLowerCase() && styles.timeRangeTextActiveImproved
              ]}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
       
        <View style={styles.actionButtonsImprovedContainer}>
          {actionButtons.map((btn, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionButtonImproved,
                btn.label === 'Refresh' && isRefreshing && styles.buttonDisabled
              ]}
              onPress={btn.onPress}
              disabled={btn.label === 'Refresh' && isRefreshing}
              activeOpacity={0.8}
            >
              <View style={styles.actionButtonCircleImproved}>
                <FontAwesome5
                  name={btn.icon}
                  size={22}
                  color={Colors.white}
                />
              </View>
              <Text style={[
                styles.actionButtonLabelImproved,
                btn.label === 'Refresh' && isRefreshing && styles.buttonLabelDisabled
              ]}>
                {btn.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
    
        <View style={styles.coinExtraDetails}>
          <Text style={styles.coinDetailsTitle}> Info </Text>
          {infoData.map((item, index) => (
            <InfoRow key={index} label={item.label} value={item.value} />
          ))}
     
          {tokenData?.links?.homepage?.[0] ? (
            <InfoRow
              label="Site"
              value={
                <Text
                  style={{ color: Colors.accent, textDecorationLine: 'underline' }}
                  onPress={() => Linking.openURL(tokenData.links.homepage[0])}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {tokenData.links.homepage[0]}
                </Text>
              }
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: statusbarHeight,
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
    textAlign: 'center',
    width: '100%',
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonLabelDisabled: {
    color: Colors.gray,
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
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  loadingChartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingChartText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  timeRangeButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 50
  },
  timeRangeButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  timeRangeButtonText: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    alignSelf: 'center',
  },
  timeRangeButtonTextActive: {
    color: Colors.white,
  },
  chartTouchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
  },
  cursor: {
    position: 'absolute',
    width: 1,
    zIndex: 10,
    pointerEvents: 'none',
  },
  cursorDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.white,
    top: -4,
    left: -4,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  cursorTooltip: {
    position: 'absolute',
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    top: -40,
    left: 10,
    minWidth: 80,
  },
  cursorTooltipText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
  },
  dateTimeDisplay: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    zIndex: 20,
  },
  dateTimeText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
  },
  coinIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  // New styles for improved header
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerIconButton: {
    padding: Spacing.sm,
  },
  coinIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  usdLabel: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.sm,
  },
  // New styles for improved price card
  priceCard: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  // New styles for improved graph card
  graphCard: {
    marginTop: Spacing.md,
    alignSelf: 'center',
    width: '90%',
    height: 250,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  // New styles for improved time range pill
  timeRangePill: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  timeRangePillActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  // New styles for improved action buttons
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  actionLabel: {
    color: Colors.accent,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  // New styles for improved info card
  infoCard: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  // New styles for modernized components
  headerFloatingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 5,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerCenterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  coinIconCircleLarge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  coinIconLarge: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  coinNameLarge: {
    color: Colors.white,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.xl,
  },
  rankContainerModern: {
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 5,
    marginLeft: Spacing.sm,
  },
  rankTextModern: {
    color: Colors.white,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.md,
  },
  priceGlassCard: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  priceLabel: {
    color: Colors.gray,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  priceRowModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  priceStyleModern: {
    color: Colors.white,
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    textAlign: 'center',
    width: '100%',
  },
  usdLabelModern: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginLeft: Spacing.sm,
  },
  changeValContainerModern: {
    paddingHorizontal: Spacing.md,
    borderRadius: 5,
    elevation: 3,
    shadowColor: Colors.green,
    backgroundColor: Colors.green,
    marginTop: Spacing.sm,
  },
  coinChangeValStyleModern: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.white,
    borderRadius: 5,
  },
  chartModernCard: {
    marginTop: Spacing.md,
    alignSelf: 'center',
    width: '90%',
    height: 250,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  chartTooltip: {
    position: 'absolute',
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    top: -40,
    left: 10,
    minWidth: 80,
    zIndex: 10,
  },
  chartTooltipText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
  },
  chartTouchContainerModern: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
  },
  cursorModern: {
    position: 'absolute',
    width: 1,
    zIndex: 10,
    pointerEvents: 'none',
  },
  cursorDotModern: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.white,
    top: -4,
    left: -4,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  timeRangeSegmentedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    marginHorizontal: Spacing.xl,
  },
  timeRangeSegment: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeRangeSegmentActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  timeRangeSegmentText: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    alignSelf: 'center',
  },
  timeRangeSegmentTextActive: {
    color: Colors.white,
  },
  actionButtonsModernContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    marginHorizontal: Spacing.xl,
  },
  actionButtonModern: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonCircleModern: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  actionButtonLabelModern: {
    color: Colors.accent,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  infoModernCard: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  coinDetailsTitleModern: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    marginVertical: Spacing.md,
    marginLeft: Spacing.xl,
  },
  infoRowModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  infoRowEven: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  infoRowOdd: {
    backgroundColor: Colors.cardBackground,
  },
  infoLabelModern: {
    color: Colors.gray,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    flex: 1,
  },
  infoValueModern: {
    color: Colors.white,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
    textAlign: 'right',
    flex: 1,
  },
  // New styles for improved chart, time range, and action buttons
  chartCardImproved: {
    marginTop: Spacing.xl,
    alignSelf: 'center',
    width: '90%',
    height: 250,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  chartTooltipImproved: {
    position: 'absolute',
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    top: -40,
    left: 10,
    minWidth: 80,
    zIndex: 10,
  },
  chartTooltipTextImproved: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
  },
  chartTouchContainerImproved: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
  },
  cursorImproved: {
    position: 'absolute',
    width: 1,
    zIndex: 10,
    pointerEvents: 'none',
  },
  cursorDotImproved: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.white,
    top: -4,
    left: -4,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  timeRangeImprovedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    marginHorizontal: Spacing.xl,
  },
  timeRangePillImproved: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeRangePillActiveImproved: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  timeRangeTextImproved: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    alignSelf: 'center',
  },
  timeRangeTextActiveImproved: {
    color: Colors.white,
  },
  actionButtonsImprovedContainer: {
    flexDirection: 'row',
    // flexWrap: 'wrap', // allow wrapping if not enough space
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  
  
  actionButtonImproved: {
    width: 90, // keep it compact, or use flex: 1 with maxWidth
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingVertical: Spacing.lg,  // ↓ reduced from lg to sm
    paddingHorizontal: Spacing.sm,
    marginHorizontal: Spacing.xs, // ↓ smaller margins
    borderWidth: 1,
    borderColor: Colors.border,
  },
  
  
  
  actionButtonCircleImproved: {
    width: 36, // ↓ slightly smaller
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  
  
  actionButtonLabelImproved: {
    color: Colors.accent,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
  },
  
});


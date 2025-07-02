import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  SafeAreaView,
  TextInput,
  FlatList
} from "react-native";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';

// Sample data for recent and trending tokens
const recentTokens = [
  { id: '1', symbol: 'BUNK', name: 'Bunk Token', color: '#FF6B9D' },
  { id: '2', symbol: 'BUNK', name: 'Bunk Protocol', color: '#4ECDC4' },
  { id: '3', symbol: 'BUNK', name: 'Bunk Coin', color: '#45B7D1' },
];

const trendingTokens = [
  { 
    id: '1', 
    name: 'Name of wtv it is', 
    description: 'short description',
    color: '#FF6B9D',
    trending: true
  },
  { 
    id: '2', 
    name: 'Name', 
    description: 'short desc',
    color: '#4ECDC4',
    trending: false
  },
  { 
    id: '3', 
    name: 'wtv', 
    description: 'some thing',
    color: '#45B7D1',
    trending: false
  },
  { 
    id: '4', 
    name: 'Name of wtv it is', 
    description: 'short description',
    color: '#9B59B6',
    trending: true
  },
  { 
    id: '5', 
    name: 'Name', 
    description: 'short desc',
    color: '#F39C12',
    trending: false
  },
  { 
    id: '6', 
    name: 'Name of wtv it is', 
    description: 'short description',
    color: '#E74C3C',
    trending: true
  },
  { 
    id: '7', 
    name: 'Name', 
    description: 'short desc',
    color: '#2ECC71',
    trending: false
  },
];

// Enhanced Token Item Component
const TokenItem = ({ item, onPress, isRecent = false }) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const [opacityValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

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

  if (isRecent) {
    return (
      <Animated.View style={[
        styles.recentTokenItem, 
        { 
          transform: [{ scale: scaleValue }],
          opacity: opacityValue 
        }
      ]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <View style={[styles.recentTokenIcon, { backgroundColor: item.color }]}>
            <Text style={styles.recentTokenText}>{item.symbol}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[
      styles.trendingTokenItem, 
      { 
        transform: [{ scale: scaleValue }],
        opacity: opacityValue 
      }
    ]}>
      <TouchableOpacity
        style={styles.trendingTokenContent}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <View style={styles.trendingTokenLeft}>
          <View style={[styles.trendingTokenIcon, { backgroundColor: item.color }]}>
            <View style={styles.tokenIconInner} />
          </View>
          <View style={styles.trendingTokenInfo}>
            <View style={styles.trendingTokenNameRow}>
              <Text style={styles.trendingTokenName}>{item.name}</Text>
              {item.trending && (
                <View style={styles.trendingBadge}>
                  <FontAwesome5 name="fire" size={10} color="#FF6B6B" />
                </View>
              )}
            </View>
            <Text style={styles.trendingTokenDescription}>{item.description}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={16} color="#7B68EE" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Enhanced Search Header Component
const SearchHeader = ({ searchQuery, setSearchQuery, onCancel }) => {
  const [focusAnimation] = useState(new Animated.Value(0));
  const textInputRef = useRef(null);

  useEffect(() => {
    // Auto-focus and animate on mount
    setTimeout(() => {
      textInputRef.current?.focus();
      Animated.timing(focusAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, 100);
  }, []);

  const handleCancel = () => {
    Animated.timing(focusAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      onCancel();
    });
  };

  return (
    <Animated.View style={[
      styles.searchHeader,
      {
        backgroundColor: focusAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['#0D0A19', '#16112B'],
        }),
      }
    ]}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            keyboardAppearance="dark"
            ref={textInputRef}
            style={styles.searchInput}
            placeholder="Search Tokens"
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            selectionColor="#7B68EE"
            
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Main Search Component
export default function TokenSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [slideAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCancel = () => {
    console.log('Cancel pressed - navigate back');
  };

  const handleTokenPress = (token, isRecent = false) => {
    console.log(`${isRecent ? 'Recent' : 'Trending'} token pressed:`, token);
  };

  const handleClearRecents = () => {
    console.log('Clear recents pressed');
  };

  // Filter trending tokens based on search query
  const filteredTrendingTokens = trendingTokens.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0A19" />
      
      <SearchHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCancel={handleCancel}
      />

      <Animated.View style={[
        styles.content,
        {
          transform: [{
            translateY: slideAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
          opacity: slideAnimation,
        }
      ]}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Recent Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recents</Text>
              <TouchableOpacity onPress={handleClearRecents}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.recentTokensContainer}>
              {recentTokens.map((token, index) => (
                <TokenItem
                  key={token.id}
                  item={token}
                  isRecent={true}
                  onPress={() => handleTokenPress(token, true)}
                />
              ))}
            </View>
          </View>

          {/* Trending Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending</Text>
            </View>
            
            <View style={styles.trendingTokensContainer}>
              {filteredTrendingTokens.map((token, index) => (
                <TokenItem
                  key={token.id}
                  item={token}
                  isRecent={false}
                  onPress={() => handleTokenPress(token, false)}
                />
              ))}
            </View>
            
            {searchQuery.length > 0 && filteredTrendingTokens.length === 0 && (
              <View style={styles.noResultsContainer}>
                <FontAwesome5 name="search" size={40} color="#6B7280" />
                <Text style={styles.noResultsText}>No tokens found</Text>
                <Text style={styles.noResultsSubtext}>Try searching with different keywords</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchHeader: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.white,
    paddingVertical: Spacing.lg,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  cancelText: {
    fontSize: FontSizes.md,
    color: Colors.accent,
    fontWeight: FontWeights.medium,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.massive,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  clearText: {
    fontSize: FontSizes.base,
    color: Colors.accent,
    fontWeight: FontWeights.medium,
  },
  recentTokensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  recentTokenItem: {
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  recentTokenIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.background,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: Colors.accent,
  },
  recentTokenText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  trendingTokensContainer: {
    gap: Spacing.sm,
  },
  trendingTokenItem: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.background,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  trendingTokenContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  trendingTokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trendingTokenIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.background,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    backgroundColor: Colors.accent,
  },
  tokenIconInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white + '30',
  },
  trendingTokenInfo: {
    flex: 1,
  },
  trendingTokenNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  trendingTokenName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    color: Colors.white,
    marginRight: Spacing.sm,
  },
  trendingBadge: {
    backgroundColor: Colors.green + '20',
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  trendingTokenDescription: {
    fontSize: FontSizes.base,
    color: Colors.gray,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.massive,
  },
  noResultsText: {
    fontSize: FontSizes.lg,
    color: Colors.white,
    fontWeight: FontWeights.semiBold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  noResultsSubtext: {
    fontSize: FontSizes.base,
    color: Colors.gray,
    textAlign: 'center',
  },
});
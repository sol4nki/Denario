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
    backgroundColor: '#0D0A19',
  },
  searchHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2C1E51',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16112B',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#2C1E51',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 16,
    color: '#7B68EE',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  clearText: {
    fontSize: 14,
    color: '#7B68EE',
    fontWeight: '500',
  },
  recentTokensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  recentTokenItem: {
    marginRight: 8,
    marginBottom: 8,
  },
  recentTokenIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recentTokenText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  trendingTokensContainer: {
    gap: 8,
  },
  trendingTokenItem: {
    backgroundColor: '#16112B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C1E51',
    shadowColor: '#000',
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
    padding: 16,
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
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  tokenIconInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  trendingTokenInfo: {
    flex: 1,
  },
  trendingTokenNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  trendingTokenName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  trendingBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  trendingTokenDescription: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(123, 104, 238, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7B68EE',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
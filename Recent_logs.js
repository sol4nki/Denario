import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';

import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from './styles/theme';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

const loginAttempts = [
  { name: "Token 1", abb: "BUNK", price: "$0.00123", change: "+17.324%" },
  { name: "Token 2", abb: "BUNK", price: "$0.00123", change: "-7.324%" },
  { name: "Token 3", abb: "BUNK", price: "$0.00123", change: "+2.456%" },
  { name: "Token 4", abb: "BUNK", price: "$0.00123", change: "+1.999%" },
  { name: "Token 5", abb: "BUNK", price: "$0.00123", change: "-3.200%" },
];

const purchaseHistory = [
  { name: "Purchase 1", desc: "short description" },
  { name: "Purchase 2", desc: "short desc" },
  { name: "Purchase 3", desc: "same thing" },
  { name: "Purchase 4", desc: "short description" },
  { name: "Purchase 5", desc: "short desc" },
  { name: "Purchase 6", desc: "same thing" },
];

// Reusable TopBar Component
const TopBar = ({ title = "Title", onBackPress, onSettingsPress }) => (
  <View style={styles.header}>
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.headerButton}
      onPress={onBackPress}
    >
      <Ionicons name="arrow-back-outline" size={24} color={Colors.white} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.headerButton}
      onPress={onSettingsPress}
    >
      <Ionicons name="settings-outline" size={24} color={Colors.white} />
    </TouchableOpacity>
  </View>
);

export default function RecentLogs() {
  return (
    <SafeAreaView style={CommonStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      {/* <TopBar
        title="Logs"
        onBackPress={() => console.log("Back pressed")}
        onSettingsPress={() => console.log("Settings pressed")}
        
      /> */}
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => console.log("hamburg menu pressed")}>
          <Ionicons name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={() => console.log("search menu pressed")}>
            <Ionicons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Attempts Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Login attempts</Text>
          <TouchableOpacity activeOpacity={0.6} onPress={() => console.log('See more pressed')}>
            <Text style={styles.seeMore}>See more</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.sectionScroll} nestedScrollEnabled>
          {loginAttempts.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              activeOpacity={0.6}
              onPress={() => console.log("Pressed token:", item.name)}
            >
              <View style={styles.iconCircle} />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.abb}</Text>
              </View>
              <View style={styles.rightText}>
                <Text style={styles.price}>{item.price}</Text>
                <Text
                  style={[
                    styles.change,
                    { color: item.change.includes('-') ? Colors.green : Colors.accent },
                  ]}
                >
                  {item.change}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Purchase History Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Purchase History</Text>
          <TouchableOpacity activeOpacity={0.6} onPress={() => console.log('See more pressed')}>
            <Text style={styles.seeMore}>See more</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.sectionScroll} nestedScrollEnabled>
          {purchaseHistory.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.simpleCard}
              activeOpacity={0.6}
              onPress={() => console.log("Pressed purchase item:", item.name)}
            >
              <View style={styles.iconCircle} />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log("Home pressed")}>
          <Ionicons name="home" size={24} color="#6B7280" />
          <Text style={[styles.navLabel, { color: '#6B7280' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log("Swap pressed")}>
          <FontAwesome5 name="exchange-alt" size={20} color="#6B7280" />
          <Text style={styles.navLabel}>Swap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log("Activity pressed")}>
          <Ionicons name="time" size={24} color="#7B68EE" />
          <Text style={[styles.navLabel, { color: '#7B68EE' }]}>Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log("More info pressed")}>
          <Ionicons name="card" size={24} color="#6B7280" />
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
  section: {
    marginBottom: Spacing.massive,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  seeMore: {
    color: Colors.accent,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
  },
  sectionScroll: {
    maxHeight: 220,
    paddingRight: 4,
    paddingHorizontal: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderColor: Colors.border,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  simpleCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
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
    marginBottom: 2,
  },
  cardSubtitle: {
    color: Colors.gray,
    fontSize: FontSizes.base,
  },
  rightText: {
    alignItems: 'flex-end',
  },
  price: {
    color: Colors.white,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
  },
  change: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
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

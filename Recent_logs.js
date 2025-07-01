import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  <View style={styles.topBar}>
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.topBarSideButton}
      onPress={onBackPress}
    >
      <Ionicons name="arrow-back-outline" size={24} color="#FFF" />
    </TouchableOpacity>

    <Text style={styles.topBarTitle}>{title}</Text>

    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.topBarSideButton}
      onPress={onSettingsPress}
    >
      <Ionicons name="settings-outline" size={24} color="#FFF" />
    </TouchableOpacity>
  </View>
);

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#0D0A19" />
      <TopBar
        title="Logs"
        onBackPress={() => console.log("Back pressed")}
        onSettingsPress={() => console.log("Settings pressed")}
      />

      {/* Login Attempts Section */}
      <View style={styles.section}>
        <View style={styles.headerRow}>
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
                    { color: item.change.includes('-') ? 'red' : '#00FF9D' },
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
        <View style={styles.headerRow}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D0A19',
    flex: 1,
    paddingTop: 0,
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
    paddingTop: 30,
    marginBottom: 16,
  },
  topBarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  topBarSideButton: {
    padding: 4,
  },
  section: {
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeMore: {
    color: '#6C63FF',
    fontSize: 14,
  },
  sectionScroll: {
    maxHeight: 220,
    paddingRight: 4,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#1C172E',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderColor: '#4A42E0',
    borderWidth: 1,
    marginBottom: 10,
  },
  simpleCard: {
    backgroundColor: '#1C172E',
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
  rightText: {
    alignItems: 'flex-end',
  },
  price: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  change: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});

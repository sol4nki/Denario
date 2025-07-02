import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Pressable,
  SafeAreaView
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
// import { useFonts, Quicksand_400Regular, Quicksand_600SemiBold } from '@expo-google-fonts/quicksand';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';


export default function Miscellaneous() {
  const [modalVisible, setModalVisible] = useState(false);
  // let [fontsLoaded] = useFonts({
  //   Quicksand_400Regular,
  //   Quicksand_600SemiBold,
  // });
  

  const buttons = [
    { name: "settings-outline", label: "Settings", onPress: () => {} },
    { name: "shield-checkmark-outline", label: "Security", onPress: () => {} },
    { name: "globe-outline", label: "Site", onPress: () => {} },
    { name: "notifications-outline", label: "Alerts", onPress: () => {} },
    { name: "person-outline", label: "Profile", onPress: () => {} },
    { name: "chatbubble-ellipses-outline", label: "Messages", onPress: () => {} },
  ];

  // Dummy news articles
  const dummyArticles = [
    {
      id: 1,
      title: "Breaking News: Crypto Market Surges",
      summary:
        "The crypto market saw a sudden surge today with Bitcoin reaching new heights.",
    },
    {
      id: 2,
      title: "Security Tips for Your Wallet",
      summary: "Learn how to keep your crypto wallet safe with these essential tips.",
    },
    {
      id: 3,
      title: "New Features in Our App",
      summary: "We're rolling out exciting new features to improve your experience.",
    },
    {
      id: 4,
      title: "Global Market Trends",
      summary: "An overview of current trends impacting the global economy.",
    },
  ];

  return (
    <SafeAreaView style={CommonStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => console.log("hamburg menu pressed")}> 
          <Ionicons name="menu" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Miscellaneous</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={() => console.log("search menu pressed")}> 
            <Ionicons name="search" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("./logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.username}>@YourUsername</Text>
      {/* Buttons Grid */}
      <View style={styles.buttonsGrid}>
        {buttons.map((btn, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={btn.onPress}
            activeOpacity={0.7}
          >
            <Ionicons name={btn.name} size={28} color={Colors.white} />
            {btn.label && <Text style={styles.buttonLabel}>{btn.label}</Text>}
          </TouchableOpacity>
        ))}
      </View>
      {/* Articles Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>News & Updates</Text>
      </View>
      <ScrollView style={styles.articlesContainer} contentContainerStyle={{ paddingBottom: 20 }}>
        {dummyArticles.map(({ id, title, summary }) => (
          <View key={id} style={styles.articleCard}>
            <Text style={styles.articleTitle}>{title}</Text>
            <Text style={styles.articleSummary}>{summary}</Text>
          </View>
        ))}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.viewNewsButton}
        activeOpacity={0.8}
      >
        <Text style={styles.viewNewsText}>View All News</Text>
      </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)} >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalTitleHolder}>
              <Text style={styles.modalTitle}>Blog Posts</Text>
            </View>
            <ScrollView>
              {dummyArticles.map(({ id, title, summary }) => (
                <View key={id} style={styles.articleCard}>
                  <Text style={styles.articleTitle}>{title}</Text>
                  <Text style={styles.articleSummary}>{summary}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.viewNewsButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
          <Ionicons name="time" size={24} color="#6B7280" />
          <Text style={styles.navLabel}>Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => console.log("More info pressed")}>
          <Ionicons name="card" size={24} color="#7B68EE" />
          <Text style={[styles.navLabel, { color: '#7B68EE' }]}>More</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  username: {
    fontSize: FontSizes.md,
    color: Colors.white,
    fontWeight: FontWeights.semiBold,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: Spacing.xl,
    alignSelf: 'center',
  },
  button: {
    width: '30%',
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 5,
    marginHorizontal: 5,
  },
  buttonLabel: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginTop: 6,
    textAlign: 'center',
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
  articlesContainer: {
    maxHeight: 290,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
  },
  articleCard: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.md,
    shadowColor: Colors.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  articleTitle: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    marginBottom: 6,
  },
  articleSummary: {
    color: Colors.gray,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.regular,
  },
  viewNewsButton: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    alignSelf: 'center',
    shadowColor: Colors.background,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 50,
  },
  viewNewsText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    textAlign: 'center',
  },
  modalOverlay: {
    // paddingTop: 40,
    backgroundColor: Colors.background,
    flex: 1,
    
  },
  modalContent: {
    backgroundColor: Colors.background,
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: '3%',
  },
  modalTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    alignSelf: 'center',
    marginVertical: Spacing.xl,
  },
  modalTitleHolder: {},
  closeButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    textAlign: 'center',
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


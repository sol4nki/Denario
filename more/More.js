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

import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';

export default function More({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const profileSection = [
    { 
      name: "person-outline", 
      label: "Profile", 
      onPress: () => {},
      rightIcon: "chevron-forward"
    },
    { 
      name: "settings-outline", 
      label: "Settings", 
      onPress: () => {},
      rightIcon: "chevron-forward"
    },
    { 
      name: "shield-checkmark-outline", 
      label: "Security & Privacy", 
      onPress: () => {},
      rightIcon: "chevron-forward"
    },
  ];

  const appSection = [
    { 
      name: "notifications-outline", 
      label: "Notifications", 
      onPress: () => {},
      rightIcon: "chevron-forward"
    },
    { 
      name: "chatbubble-ellipses-outline", 
      label: "Support", 
      onPress: () => {},
      rightIcon: "chevron-forward"
    },
    { 
      name: "globe-outline", 
      label: "Website", 
      onPress: () => {},
      rightIcon: "open-outline"
    },
  ];

  const aboutSection = [
    { 
      name: "document-text-outline", 
      label: "Terms of Service", 
      onPress: () => {},
      rightIcon: "open-outline"
    },
    { 
      name: "shield-outline", 
      label: "Privacy Policy", 
      onPress: () => {},
      rightIcon: "open-outline"
    },
    { 
      name: "information-circle-outline", 
      label: "About", 
      onPress: () => {},
      rightIcon: "chevron-forward"
    },
  ];

  // Dummy news articles
  const dummyArticles = [
    {
      id: 1,
      title: "Breaking News: Crypto Market Surges",
      summary: "The crypto market saw a sudden surge today with Bitcoin reaching new heights.",
      timestamp: "2h ago",
      category: "Market"
    },
    {
      id: 2,
      title: "Security Tips for Your Wallet",
      summary: "Learn how to keep your crypto wallet safe with these essential tips.",
      timestamp: "1d ago",
      category: "Security"
    },
    {
      id: 3,
      title: "New Features in Our App",
      summary: "We're rolling out exciting new features to improve your experience.",
      timestamp: "3d ago",
      category: "Updates"
    },
    {
      id: 4,
      title: "Global Market Trends",
      summary: "An overview of current trends impacting the global economy.",
      timestamp: "5d ago",
      category: "Analysis"
    },
  ];

  const renderMenuSection = (title, items) => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.menuContainer}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index === items.length - 1 && styles.lastMenuItem
            ]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.name} size={20} color={Colors.white} />
              </View>
              <Text style={styles.menuItemLabel}>{item.label}</Text>
            </View>
            <Ionicons 
              name={item.rightIcon} 
              size={18} 
              color={Colors.gray} 
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={CommonStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoButton} onPress={() => navigation.navigate('More')}>
          <View style={styles.logoCircle}>
            <Image
              source={require("../assets/main_logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.searchButton} onPress={() => console.log("search pressed")}>
          <Ionicons name="search" size={20} color={Colors.gray} />
          <Text style={styles.searchPlaceholder}>Search</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Activity')}>
          <Ionicons name="notifications-outline" size={24} color={Colors.white} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={require("../assets/main_logo.png")}
                style={styles.avatar}
                resizeMode="contain"
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.username}>Setup Biometric</Text>
              <Text style={styles.userStatus}>Verify your Face ID</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="hello" size={16} color={Colors.gray} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Sections */}
        {renderMenuSection("Account", profileSection)}
        {renderMenuSection("App", appSection)}
        {renderMenuSection("About", aboutSection)}

        {/* News Section */}
        <View style={styles.newsSection}>
          <View style={styles.newsSectionHeader}>
            <Text style={styles.sectionTitle}>News & Updates</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.newsContainer}>
            {dummyArticles.slice(0, 3).map((article) => (
              <TouchableOpacity key={article.id} style={styles.newsCard} activeOpacity={0.8}>
                <View style={styles.newsHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{article.category}</Text>
                  </View>
                  <Text style={styles.timestamp}>{article.timestamp}</Text>
                </View>
                <Text style={styles.newsTitle} numberOfLines={2}>{article.title}</Text>
                <Text style={styles.newsSummary} numberOfLines={3}>{article.summary}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal 
        visible={modalVisible} 
        animationType="slide" 
        onRequestClose={() => setModalVisible(false)}
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>All News</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {dummyArticles.map((article) => (
              <TouchableOpacity key={article.id} style={styles.modalNewsCard} activeOpacity={0.8}>
                <View style={styles.newsHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{article.category}</Text>
                  </View>
                  <Text style={styles.timestamp}>{article.timestamp}</Text>
                </View>
                <Text style={styles.newsTitle}>{article.title}</Text>
                <Text style={styles.newsSummary}>{article.summary}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background,
  },
  logoButton: {
    padding: Spacing.xs,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    width: 24,
    height: 24,
  },
  searchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  searchPlaceholder: {
    fontSize: FontSizes.md,
    color: Colors.gray,
    marginLeft: Spacing.lg,
  },
  headerButton: {
    padding: Spacing.sm,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  scrollContainer: {
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 35,
    height: 35,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    marginBottom: 2,
  },
  userStatus: {
    fontSize: FontSizes.sm,
    color: Colors.gray,
  },
  editButton: {
    padding: Spacing.sm,
  },
  menuSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    color: Colors.gray,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuItemLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.white,
  },
  newsSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  newsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  viewAllText: {
    fontSize: FontSizes.sm,
    color: Colors.accent,
    fontWeight: FontWeights.medium,
  },
  newsContainer: {
    gap: Spacing.md,
  },
  newsCard: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    color: Colors.white,
    fontWeight: FontWeights.medium,
  },
  timestamp: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
  },
  newsTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  newsSummary: {
    fontSize: FontSizes.sm,
    color: Colors.gray,
    lineHeight: 18,
  },
  versionSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  versionText: {
    fontSize: FontSizes.sm,
    color: Colors.gray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    paddingVertical: Spacing.md,

  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  modalNewsCard: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.sm,
  },
});
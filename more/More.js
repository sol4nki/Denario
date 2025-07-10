import React, { useState, useEffect } from "react";
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
  SafeAreaView,
  Linking,
  RefreshControl,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  CommonStyles,
} from "../styles/theme";

import fetchNews from "../services/newsService";
import NewsCard from "../components/NewsCard";

const statusBarHeight =
  Platform.OS === "android" ? Constants.statusBarHeight + 8 : 0;

export default function More({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  const profileSection = [
    {
      name: "person-outline",
      label: "Profile",
      onPress: () => setProfileModalVisible(true),
      rightIcon: "chevron-forward",
      description: "Manage your account",
    },
    {
      name: "settings-outline",
      label: "Settings",
      onPress: () => setSettingsModalVisible(true),
      rightIcon: "chevron-forward",
      description: "App preferences",
    },
    {
      name: "shield-checkmark-outline",
      label: "Security & Privacy",
      onPress: () => {},
      rightIcon: "chevron-forward",
      description: "Privacy settings",
    },
  ];

  const appSection = [
    {
      name: "notifications-outline",
      label: "Notifications",
      onPress: () => {},
      rightIcon: "chevron-forward",
      description: "Manage notifications",
      badge: "3",
    },
    {
      name: "chatbubble-ellipses-outline",
      label: "Support",
      onPress: () => {},
      rightIcon: "chevron-forward",
      description: "Get help",
    },
    {
      name: "globe-outline",
      label: "Website",
      onPress: () => {},
      rightIcon: "open-outline",
      description: "Visit our website",
    },
  ];

  const aboutSection = [
    {
      name: "document-text-outline",
      label: "Terms of Service",
      onPress: () => {},
      rightIcon: "open-outline",
      description: "Legal terms",
    },
    {
      name: "shield-outline",
      label: "Privacy Policy",
      onPress: () => {},
      rightIcon: "open-outline",
      description: "Privacy information",
    },
    {
      name: "information-circle-outline",
      label: "About",
      onPress: () => {},
      rightIcon: "chevron-forward",
      description: "App information",
    },
  ];
  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const articles = await fetchNews(10);
      setNewsArticles(articles);
    } catch (error) {
      console.error("Failed to load news:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  const handleArticlePress = (article) => {
    const url = article.url || article.URL || article.guid || article.GUID;
    if (url && url !== "https://www.google.com") {
      Linking.openURL(url);
    }
  };

  const renderMenuSection = (title, items) => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.menuContainer}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index === items.length - 1 && styles.lastMenuItem,
            ]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.name} size={20} color={Colors.white} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
                {item.description && (
                  <Text style={styles.menuItemDescription}>
                    {item.description}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.menuItemRight}>
              {item.badge && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons name={item.rightIcon} size={18} color={Colors.gray} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={CommonStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoButton}
          onPress={() => navigation.navigate("More")}
        >
          <View style={styles.logoCircle}>
            <Image
              source={require("../assets/main_logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => console.log("search pressed")}
        >
          <Ionicons name="search" size={20} color={Colors.gray} />
          <Text style={styles.searchPlaceholder}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("Activity")}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={Colors.white}
          />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
      >
        {/* Enhanced Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.profileLeft}>
              <View style={styles.avatarContainer}>
                <Image
                  source={require("../assets/main_logo.png")}
                  style={styles.avatar}
                  resizeMode="contain"
                />
                <View style={styles.statusIndicator} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.username}>Setup Biometric</Text>
                <Text style={styles.userStatus}>Verify your Face ID</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: "90%" }]} />
                  </View>
                  <Text style={styles.progressText}>90% Complete</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("Biometric")}
            >
              <Ionicons name="settings" size={18} color={Colors.gray} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Ionicons name="document-text" size={24} color={Colors.accent} />
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Articles Read</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="bookmark" size={24} color={Colors.accent} />
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Bookmarked</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="share" size={24} color={Colors.accent} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Shared</Text>
          </View>
        </View>

        {/* Menu Sections */}
        {renderMenuSection("Account", profileSection)}
        {renderMenuSection("App", appSection)}
        {renderMenuSection("About", aboutSection)}

        {/* Enhanced News Section */}
        <View style={styles.newsSection}>
          <View style={styles.newsSectionHeader}>
            <View style={styles.newsSectionLeft}>
              <Text style={styles.sectionTitle}>Latest News</Text>
              <Text style={styles.sectionSubtitle}>Stay updated with trending stories</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.accent} />
            </TouchableOpacity>
          </View>

          <View style={styles.newsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingSpinner}>
                  <Ionicons name="refresh" size={24} color={Colors.accent} />
                </View>
                <Text style={styles.loadingText}>Loading latest news...</Text>
              </View>
            ) : newsArticles && newsArticles.length > 0 ? (
              newsArticles
                .slice(0, 3)
                .map((article, index) => (
                  <NewsCard
                    key={article.id || article.ID || index}
                    article={article}
                    onPress={() => handleArticlePress(article)}
                  />
                ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="newspaper-outline" size={48} color={Colors.gray} />
                <Text style={styles.emptyText}>No news available</Text>
                <Text style={styles.emptySubtext}>Pull down to refresh</Text>
              </View>
            )}
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.buildText}>Build 2025.07.08</Text>
        </View>
      </ScrollView>

      {/* Enhanced Profile Modal */}
      <Modal
        visible={profileModalVisible}
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
              <Ionicons name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Profile</Text>
            <TouchableOpacity>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalPlaceholder}>Profile settings coming soon...</Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Enhanced Settings Modal */}
      <Modal
        visible={settingsModalVisible}
        animationType="slide"
        onRequestClose={() => setSettingsModalVisible(false)}
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
              <Ionicons name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Settings</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalPlaceholder}>Settings panel coming soon...</Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Enhanced News Modal */}
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
            <TouchableOpacity onPress={onRefresh}>
              <Ionicons name="refresh" size={24} color={Colors.accent} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.accent}
                colors={[Colors.accent]}
              />
            }
          >
            {newsArticles && newsArticles.length > 0 ? (
              newsArticles.map((article, index) => (
                <NewsCard
                  key={article.id || article.ID || index}
                  article={article}
                  onPress={() => handleArticlePress(article)}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="newspaper-outline" size={48} color={Colors.gray} />
                <Text style={styles.emptyText}>No news available</Text>
                <Text style={styles.emptySubtext}>Pull down to refresh</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background,
    paddingTop: statusBarHeight,
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
    justifyContent: "center",
    alignItems: "center",
  },
  headerLogo: {
    width: 24,
    height: 24,
  },
  searchButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.cardBackground,
    padding: Spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.cardBackground,
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
    marginBottom: Spacing.sm,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.background,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  progressText: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
    fontWeight: FontWeights.medium,
  },
  editButton: {
    padding: Spacing.sm,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    marginVertical: Spacing.sm,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
    textAlign: "center",
    fontWeight: FontWeights.medium,
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
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.gray,
    marginBottom: Spacing.sm,
  },
  menuContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.white,
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  badgeContainer: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    fontSize: FontSizes.xs,
    color: Colors.white,
    fontWeight: FontWeights.bold,
  },
  newsSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  newsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  newsSectionLeft: {
    flex: 1,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  viewAllText: {
    fontSize: FontSizes.sm,
    color: Colors.accent,
    fontWeight: FontWeights.medium,
  },
  newsContainer: {
    gap: Spacing.md,
  },
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  loadingSpinner: {
    marginBottom: Spacing.md,
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: Colors.gray,
    textAlign: "center",
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.gray,
    fontWeight: FontWeights.medium,
    marginTop: Spacing.md,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    color: Colors.gray,
    marginTop: Spacing.xs,
    textAlign: "center",
  },
  versionSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  versionText: {
    fontSize: FontSizes.sm,
    color: Colors.gray,
    fontWeight: FontWeights.medium,
  },
  buildText: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  modalSaveText: {
    fontSize: FontSizes.md,
    color: Colors.accent,
    fontWeight: FontWeights.medium,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  modalPlaceholder: {
    fontSize: FontSizes.md,
    color: Colors.gray,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
});
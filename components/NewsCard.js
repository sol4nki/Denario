import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  LinearGradient,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSizes, FontWeights, Spacing } from "../styles/theme";

const { width } = Dimensions.get("window");

const NewsCard = ({ article, onPress }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 90) => {
    if (!text || text.length <= maxLength) return text || "";
    return text.substring(0, maxLength) + "...";
  };

  const getArticleData = () => {
    return {
      title: article.title || "No Title",
      body: article.body || "No description available",
      imageUrl: article.imageurl || "https://via.placeholder.com/150x150",
      source: article.source || "Unknown Source",
      publishedOn: article.published_on || Date.now() / 1000,
      url: article.url || article.guid || "https://www.google.com",
    };
  };

  const articleData = getArticleData();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: articleData.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>NEWS</Text>
            </View>
          </View>
        </View>

        <View style={styles.textContainer}>
          <View style={styles.header}>
            <Text style={styles.source}>{articleData.source}</Text>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={12} color={Colors.gray} />
              <Text style={styles.date}>
                {formatDate(articleData.publishedOn)}
              </Text>
            </View>
          </View>
          
          <Text style={styles.title} numberOfLines={2}>
            {articleData.title}
          </Text>
          
          <Text style={styles.description} numberOfLines={2}>
            {truncateText(articleData.body)}
          </Text>
          
          <View style={styles.footer}>
            <View style={styles.readMoreContainer}>
              <Text style={styles.readMoreText}>Read more</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.accent} />
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="bookmark-outline" size={16} color={Colors.gray} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={16} color={Colors.gray} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    height: 140,
  },
  imageContainer: {
    width: "35%",
    height: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: Spacing.sm,
  },
  categoryBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    opacity: 0.9,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    color: Colors.white,
    fontWeight: FontWeights.bold,
    letterSpacing: 0.5,
  },
  textContainer: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  source: {
    fontSize: FontSizes.xs,
    color: Colors.accent,
    fontWeight: FontWeights.semiBold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  date: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
    fontWeight: FontWeights.medium,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSizes.sm,
    color: Colors.gray,
    lineHeight: 18,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  readMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  readMoreText: {
    fontSize: FontSizes.xs,
    color: Colors.accent,
    fontWeight: FontWeights.semiBold,
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.xs,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
});

export default NewsCard;
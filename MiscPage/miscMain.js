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
  Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, Quicksand_400Regular, Quicksand_600SemiBold } from '@expo-google-fonts/quicksand';
import miscStyles from "./miscStyles";


export default function Miscellaneous() {
  const [modalVisible, setModalVisible] = useState(false);
  let [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_600SemiBold,
  });

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
    <View style={miscStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0A19" />

      <Image
        source={require("./logo.png") }
        style={miscStyles.logo}
        resizeMode="contain"
      />

      <Text style={miscStyles.username}>@YourUsername</Text>

      <View style={miscStyles.buttonsGrid}>
        {buttons.map((btn, index) => (
          <TouchableOpacity
            key={index}
            style={[
              miscStyles.button,
              { backgroundColor: vibrantColors[index] },
              { shadowColor: vibrantColors[index] },
            ]}
            onPress={btn.onPress}
            activeOpacity={0.7}
          >
            <Ionicons name={btn.name} size={28} color="white" />
            {btn.label && <Text style={miscStyles.buttonLabel}>{btn.label}</Text>}
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={miscStyles.articlesContainer} contentContainerStyle={{ paddingBottom: 20 }}>
        {dummyArticles.map(({ id, title, summary }) => (
          <View key={id} style={miscStyles.articleCard}>
            <Text style={miscStyles.articleTitle}>{title}</Text>
            <Text style={miscStyles.articleSummary}>{summary}</Text>
          </View>
        ))}
      </ScrollView>
       <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => [
          miscStyles.viewNewsButton,
        ]}
      >
        <Text style={miscStyles.viewNewsText}>View All News</Text>
      </Pressable>  
      <Modal visible={modalVisible}  animationType="slide" onRequestClose={setModalVisible}>
        <View style={miscStyles.modalOverlay}>
          <View style={miscStyles.modalContent}>
            <View style={miscStyles.modaTitleHolder}>
              <Text style={miscStyles.modalTitle}>Blog Posts</Text>
            </View>
            <ScrollView>
              {dummyArticles.map(({ id, title, summary }) => (
                <View key={id} style={miscStyles.articleCard}>
                  <Text style={miscStyles.articleTitle}>{title}</Text>
                  <Text style={miscStyles.articleSummary}>{summary}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={miscStyles.viewNewsButton}
            >
              <Text style={miscStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const vibrantColors = [
  "#FF6B6B",
  "#6BCB77",
  "#4D96FF",
  "#FFB100",
  "#C77DFF",
  "#FF3F34",
];


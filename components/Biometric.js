import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Text,
  Button,
  SafeAreaView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  CommonStyles,
} from "../styles/theme";

import Constants from "expo-constants";
import * as LocalAuthentication from "expo-local-authentication";
import { Camera } from "expo-camera";

export default function Biometric() {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [cameraPermission, setCameraPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = React.useRef(null);

  const handleScanPress = async () => {

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
   
    if (hasHardware) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with Biometrics",
        fallbackLabel: "Use Passcode",
      });
      setModalMessage(
        result.success
          ? "Biometric authentication successful!"
          : "Authentication failed.",
      );
      setIsModalVisible(true);
    } else {

      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
      if (status === "granted") {
        setShowCamera(true);
      } else {
        setModalMessage("Camera permission denied.");
        setIsModalVisible(true);
      }
    }
  };

  const handlePhotoTaken = async () => {
    if (cameraRef.current) {
      await cameraRef.current.takePictureAsync();
      setShowCamera(false);
      setModalMessage("Photo taken (simulated biometric fallback).");
      setIsModalVisible(true);
    }
  };

  const statusBarHeight =
    Platform.OS === "android" ? Constants.statusBarHeight + 8 : 0;

  return (
    <SafeAreaView
      style={[CommonStyles.container, { paddingTop: statusBarHeight }]}
    >
      <StatusBar style="light" backgroundColor={Colors.background} />

      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={24} color={Colors.white} />
        </TouchableOpacity>

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={styles.headerTitle}>Biometric Scan</Text>
        </View>

    
        <View style={{ width: 40 }} />
      </View>

      {/* Main Card Section */}
      <View style={styles.cardSection}>
        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.scanButton}
            onPress={handleScanPress}
          >
            <SvgComponent />
          </TouchableOpacity>
          <Text style={styles.scanText}>Tap to Scan</Text>
        </View>
      </View>

      {/* Camera fallback modal */}
      {showCamera && cameraPermission && (
        <Modal visible={showCamera} animationType="slide" transparent={false}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#000",
            }}
          >
            <Camera style={{ flex: 1, width: "100%" }} ref={cameraRef} />
            <Button title="Take Photo" onPress={handlePhotoTaken} />
            <Button title="Cancel" onPress={() => setShowCamera(false)} />
          </View>
        </Modal>
      )}

      {/* Result Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 15,
              padding: 30,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: FontSizes.lg,
                marginBottom: Spacing.xl,
                color: "#000",
              }}
            >
              {modalMessage}
            </Text>
            <Button title="Close" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// SVG Component
function SvgComponent(props) {
  return (
    <Svg
      width={150}
      height={150}
      viewBox="0 0 200 201"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M20 200.125c-5.5 0-10.208-1.958-14.125-5.875S0 185.625 0 180.125v-37.5a2.5 2.5 0 115 0v37.5c0 8.284 6.716 15 15 15h37.5a2.5 2.5 0 110 5H20zm-17.5-140a2.5 2.5 0 01-2.5-2.5v-37.5C0 14.625 1.958 9.917 5.875 6S14.5.125 20 .125h37.5a2.5 2.5 0 010 5H20c-8.284 0-15 6.716-15 15v37.5a2.5 2.5 0 01-2.5 2.5zm140 140a2.5 2.5 0 110-5H180c8.284 0 15-6.716 15-15v-37.5a2.5 2.5 0 115 0v37.5c0 5.5-1.958 10.208-5.875 14.125s-8.625 5.875-14.125 5.875h-37.5zm55-140a2.5 2.5 0 01-2.5-2.5v-37.5c0-8.284-6.716-15-15-15h-37.5a2.5 2.5 0 110-5H180c5.5 0 10.208 1.958 14.125 5.875S200 14.625 200 20.125v37.5a2.5 2.5 0 01-2.5 2.5z"
        fill="#fff"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.white,
    alignSelf: "center",
  },
  cardSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: Spacing.massive,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    width: "100%",
    maxWidth: 350,
    shadowColor: Colors.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  scanButton: {
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  scanText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    marginTop: 0,
    fontWeight: FontWeights.medium,
  },
  modalView: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
});

import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  CommonStyles,
} from "../styles/theme";

const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight : 0;

const QRscanner = () => {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState("");

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text>
          No access to camera. Please enable camera permissions in your device
          settings.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScanning(false);
    setData(data);
    console.log("Scanned QR code value:", data);
    navigation.navigate("Send", { recipientAddress: data });
  };

  return (
    <SafeAreaView style={CommonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Scan QR Code</Text>
      </View>
      <View style={styles.content}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={
            scanning && !scanned ? handleBarCodeScanned : undefined
          }
        />
        {!scanned && (
          <TouchableOpacity
            style={styles.scanButtonOverlay}
            onPress={() => {
              setScanning(true);
              setScanned(false);
              setData("");
            }}
          >
            <Text style={styles.scanButtonOverlayText}>Scan QR Code</Text>
          </TouchableOpacity>
        )}
        {scanned && (
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => {
              setScanning(false);
              setScanned(false);
              setData("");
            }}
          >
            <Text style={styles.scanAgainButtonText}>Tap to Scan Again</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.dataText}>{data}</Text>
        <Text style={styles.instruction}>
          Tap the button to open your camera and scan a QR code from a photo.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default QRscanner;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
    paddingTop: statusBarHeight,
  },
  backButton: {
    marginRight: 12,
    padding: 6,
  },
  title: {
    ...CommonStyles.title,
    fontSize: FontSizes.xl,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  button: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 40,
    borderWidth: 3,
    borderColor: "#007AFF",
  },
  buttonText: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  scanButtonOverlay: {
    position: "absolute",
    alignSelf: "center",
    bottom: "15%",
    backgroundColor: "#007AFF",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderColor: "#fff",
    borderRadius: 10,
  },
  scanButtonOverlayText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 1,
  },
  scanAgainButton: {
    position: "absolute",
    bottom: 120,
    left: 40,
    right: 40,
    backgroundColor: "#007AFF",
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#fff",
  },
  scanAgainButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  dataText: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#fff",
    fontSize: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 40,
  },
  instruction: {
    color: Colors.gray,
    fontSize: FontSizes.base,
    textAlign: "center",
    marginVertical: Spacing.xl,
    marginHorizontal: Spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});

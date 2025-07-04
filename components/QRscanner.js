import { StyleSheet, Text, SafeAreaView, TouchableOpacity, View, Alert, Image } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';
import QrCode from 'qrcode-decoder';

const QRscanner = () => {
  const navigation = useNavigation();
  const [scannedImage, setScannedImage] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImageAndScan = async () => {
    setScannedResult(null);
    setScannedImage(null);
    setLoading(true);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.cancelled) {
      setScannedImage(result.uri);
      try {
        const qr = new QrCode();
        const res = await qr.decodeFromImage(result.uri);
        setScannedResult(res.data || 'No QR code found');
        if (res.data) {
          Alert.alert('QR Code Scanned', `Address: ${res.data}`, [
            { text: 'OK', onPress: () => navigation.goBack() },
            { text: 'Scan Again', onPress: () => { setScannedResult(null); setScannedImage(null); } }
          ]);
        } else {
          Alert.alert('No QR code found', 'Try again with a clearer image.');
        }
      } catch (e) {
        setScannedResult('No QR code found');
        Alert.alert('No QR code found', 'Try again with a clearer image.');
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={CommonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Scan QR Code</Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.scanBtn} onPress={pickImageAndScan} disabled={loading}>
          <Ionicons name="camera" size={28} color={Colors.accent} style={{ marginRight: 10 }} />
          <Text style={styles.scanBtnText}>{loading ? 'Scanning...' : 'Scan QR from Camera'}</Text>
        </TouchableOpacity>
        {scannedImage && (
          <Image source={{ uri: scannedImage }} style={styles.previewImg} />
        )}
        {scannedResult && (
          <Text style={styles.resultText}>{scannedResult}</Text>
        )}
        <Text style={styles.instruction}>Tap the button to open your camera and scan a QR code from a photo.</Text>
      </View>
    </SafeAreaView>
  );
};

export default QRscanner;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.massive,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  scanBtnText: {
    color: Colors.accent,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
  },
  previewImg: {
    width: 220,
    height: 220,
    borderRadius: 16,
    marginVertical: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  resultText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  instruction: {
    color: Colors.gray,
    fontSize: FontSizes.base,
    textAlign: 'center',
    marginVertical: Spacing.xl,
    marginHorizontal: Spacing.xl,
  },
});

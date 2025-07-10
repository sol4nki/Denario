import React, { useState } from 'react';
import { ethers } from 'ethers';
import * as FileSystem from 'expo-file-system';

import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Dimensions, Image, Alert, ActivityIndicator
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';
import { generateWalletExpo } from '../wallet_gen.js';

import { getFirestore, doc, setDoc } from 'firebase/firestore';

import { db } from "../firebaseconfig.js";

import { saveWalletAddress, savePvtKey } from '../storage.js';



const { width } = Dimensions.get('window');

export default function RecoveryPhraseScreen({ navigation }) {
  const [recoveryPhrase, setRecoveryPhrase] = useState([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const wallet = await generateWalletExpo();
      const words = wallet.mnemonic.split(' ');
      const phrase = words.join(' ').trim();

      setRecoveryPhrase(words);
      setWalletAddress(wallet.address);
      setSaved(false);

      const recreatedWallet = ethers.Wallet.fromPhrase(phrase);
      const address = recreatedWallet.address;
      const privateKey = recreatedWallet.privateKey;

      await saveWalletAddress(address);
      await savePvtKey(privateKey);
      console.log('Wallet saved securely.');

      await setDoc(doc(db, 'wallets', address), {
        address,
        privateKey,
        createdAt: new Date().toISOString(),
      });
      console.log('Wallet saved to Firestore.');

      setLoading(false);
      Alert.alert('Wallet Generated', `Your wallet address:\n${address}`, `Please save your wallet Recovery Phrase`);
    } catch (err) {
      console.error('Wallet generation error:', err);
      setLoading(false);
      Alert.alert('Error', 'Failed to generate wallet.');
    }
  };


  const handleCopyPhrase = async () => {
    const fullPhrase = recoveryPhrase.join(' ');
    await Clipboard.setStringAsync(fullPhrase);
    Alert.alert('Copied', 'Full recovery phrase copied to clipboard.');
  };

  const handleCopyAddress = async () => {
    await Clipboard.setStringAsync(walletAddress);
    Alert.alert('Copied', 'Wallet address copied to clipboard.');
  };

  const handleContinue = () => {
    if (saved) navigation.navigate('Success', { recoveryPhrase });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/fourth.png')} style={styles.backgroundImage} resizeMode="contain" />
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.title}>Secret Recovery Phrase</Text>
        <Text style={styles.subtitle}>This phrase is the ONLY way to recover your wallet!</Text>

        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.generateButtonText}>
              {recoveryPhrase.length ? 'Regenerate Wallet' : 'Generate Wallet'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Wallet Address */}
        {walletAddress ? (
          <TouchableOpacity style={styles.addressBox} onPress={handleCopyAddress}>
            <Text style={styles.addressLabel}>Your Wallet Address:</Text>
            <Text style={styles.addressText}>{walletAddress}</Text>
            <Text style={styles.copyHint}>Tap to copy</Text>
          </TouchableOpacity>
        ) : null}

        {/* Recovery Phrase Display */}
        {recoveryPhrase.length > 0 && (
          <TouchableOpacity style={styles.phraseBox} onPress={handleCopyPhrase}>
            <View style={styles.phraseGrid}>
              {recoveryPhrase.map((word, idx) => (
                <View key={idx} style={styles.wordBox}>
                  <Text style={styles.wordIndex}>{idx + 1}.</Text>
                  <Text style={styles.wordText}>{word}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.copyHint}>Tap anywhere above to copy all</Text>
          </TouchableOpacity>
        )}

        {/* Confirm Checkbox */}
        {recoveryPhrase.length > 0 && (
          <TouchableOpacity style={styles.savedContainer} onPress={() => setSaved(!saved)}>
            <View style={[styles.checkbox, saved && styles.checkboxChecked]}>
              {saved && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.savedText}>I saved my Recovery Phrase</Text>
          </TouchableOpacity>
        )}

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, (!saved || recoveryPhrase.length !== 12) && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!saved || recoveryPhrase.length !== 12}
        >
          <View style={styles.button}><Text style={styles.buttonText}>Continue</Text></View>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, recoveryPhrase.length ? styles.activeDot : null]} />
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={styles.progressDot} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { ...CommonStyles.container },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    width: width,
    height: 375,
    resizeMode: 'cover',
    zIndex: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    opacity: 0.5,
    zIndex: 1,
  },
  content: {
    flex: 1,
    zIndex: 2,
    paddingHorizontal: '5%',
    paddingTop: 140,
  },
  title: {
    ...CommonStyles.title,
    fontSize: FontSizes.xxl,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...CommonStyles.subtitle,
    fontSize: FontSizes.base,
    marginBottom: Spacing.massive,
    textAlign: 'center',
    lineHeight: 20,
  },
  generateButton: {
    backgroundColor: Colors.accent,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  generateButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
  },
  phraseBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: Spacing.xl,
    maxHeight: 230,
    marginBottom: Spacing.massive,
  },
  phraseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  wordBox: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minWidth: 60,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginBottom: 6,
  },
  wordIndex: {
    color: Colors.accent,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.sm,
  },
  wordText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  savedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.massive,
  },
  savedText: {
    color: Colors.gray,
    fontSize: FontSizes.base,
    flexShrink: 1,
    textAlign: 'left',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.navInactive,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  checkboxChecked: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  checkmark: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Spacing.xxl,
    width: '100%',
  },
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.xl / 2,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  activeDot: {
    backgroundColor: Colors.accent,
  },
  copyHint: {
    marginTop: Spacing.sm,
    textAlign: 'center',
    color: Colors.gray,
    fontSize: FontSizes.sm,
  },
  addressBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  addressLabel: {
    fontSize: FontSizes.sm,
    color: Colors.accent,
    marginBottom: 4,
    fontWeight: FontWeights.bold,
  },
  addressText: {
    fontSize: FontSizes.base,
    color: Colors.white,
    textAlign: 'center',
  },
});

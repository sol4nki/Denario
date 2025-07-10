import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Image, Dimensions, ScrollView,
  KeyboardAvoidingView, Platform, Alert, Animated, StatusBar, Easing
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';
import { logUserLogin } from '../loginLog';
import * as FileSystem from 'expo-file-system';
import { ethers } from 'ethers';
import * as Clipboard from 'expo-clipboard';

import { saveWalletAddress, savePvtKey } from '../storage.js'; 

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [recoveryWords, setRecoveryWords] = useState(Array(12).fill(''));
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const inputRefs = useRef(Array.from({ length: 12 }, () => React.createRef()));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 800, useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true
      }),
    ]).start();
  }, []);

  const handleWordChange = (i, txt) => {
    const words = [...recoveryWords];
    const split = txt.trim().split(/\s+/);
    if (split.length === 12) {
      setRecoveryWords(split);
      inputRefs.current[11]?.current?.focus();
    } else {
      words[i] = txt.toLowerCase();
      setRecoveryWords(words);
      if (txt && i < 11) inputRefs.current[i + 1]?.current?.focus();
    }
  };

  const handleKeyPress = (i, key) => {
    if (key === 'Backspace' && !recoveryWords[i] && i > 0) {
      inputRefs.current[i - 1]?.current?.focus();
    }
  };

  const isValid = recoveryWords.every(w => w.trim().length > 0);

  const clearAll = () => {
    setRecoveryWords(Array(12).fill(''));
    inputRefs.current[0]?.current?.focus();
  };

  const pasteClipboard = async () => {
    const text = (await Clipboard.getStringAsync()).trim();
    const parts = text.split(/\s+/);
    if (parts.length === 12) setRecoveryWords(parts);
    else Alert.alert('Invalid Format', 'Copy exactly 12 words.');
  };

  const handleLogin = async () => {
    if (!isValid) {
      Alert.alert('Invalid', 'Please complete all 12 words.');
      console.log('[handleLogin] Validation failed: incomplete recovery words');
      return;
    }

    setIsLoading(true);
    try {
      const phrase = recoveryWords.join(' ').trim();
      console.log('[handleLogin] Recovery phrase:', phrase);

      const wallet = ethers.Wallet.fromPhrase(phrase);
      const address = wallet.address;
      const privateKey = wallet.privateKey;

      console.log('[handleLogin] Derived wallet address:', address);
      console.log('[handleLogin] Derived private key:', privateKey);

      await saveWalletAddress(address);
      console.log('[handleLogin] Wallet address saved securely');
      await savePvtKey(privateKey);
      console.log('[handleLogin] Private key saved securely');

      await logUserLogin(address);
      console.log('[handleLogin] User login logged');

      Alert.alert('Success', 'Logged in!', [
        {
          text: 'Continue',
          onPress: () => {
            console.log('[handleLogin] Navigating to TabNavigator');
            navigation.navigate('TabNavigator');
          },
        },
      ]);
    } catch (e) {
      console.error('[handleLogin] Login error:', e);
      Alert.alert('Login Failed', 'Invalid recovery phrase.');
    } finally {
      setIsLoading(false);
      console.log('[handleLogin] Loading state set to false');
    }
  };


  return (
    <SafeAreaView style={CommonStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent />
      <Image
        source={require('../assets/fourth.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.contentWrapper, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }]}>
            <View style={styles.content}>
              <Text style={styles.title}>Login to Wallet</Text>
              <Text style={styles.subtitle}>Enter your 12-word recovery phrase.</Text>

              <View style={styles.recoveryPhraseSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recovery Phrase</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={clearAll} style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pasteClipboard} style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>Paste</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => setShowRecoveryPhrase(!showRecoveryPhrase)}
                    >
                      <Text style={styles.actionButtonText}>
                        {showRecoveryPhrase ? 'Hide' : 'Show'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.wordsGrid}>
                  {recoveryWords.map((w, i) => (
                    <View key={i} style={styles.wordInputContainer}>
                      <Text style={styles.wordNumber}>{i + 1}.</Text>
                      <TextInput
                        ref={inputRefs.current[i]}
                        style={styles.wordInput}
                        value={w}
                        onChangeText={t => handleWordChange(i, t)}
                        onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
                        placeholder="word"
                        placeholderTextColor="#888"
                        secureTextEntry={!showRecoveryPhrase}
                        autoCapitalize="none"
                      />
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[
                  CommonStyles.button,
                  !isValid && styles.disabledButton,
                  { opacity: !isValid ? 0.5 : 1 }
                ]}
                onPress={handleLogin}
                disabled={!isValid || isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Authenticating…' : 'Access Wallet'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createWalletButton}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={styles.createWalletText}>
                  Don't have a wallet? <Text style={styles.createWalletLink}>Create one</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    width: width,
    height: 375,
    resizeMode: 'cover',
    zIndex: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    minHeight: height - 100,
  },
  content: {
    paddingHorizontal: '5%',
    marginTop: 10,
    alignItems: 'stretch',
  },
  title: {
    ...CommonStyles.title,
    fontSize: FontSizes.xxl,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...CommonStyles.subtitle,
    fontSize: FontSizes.base,
    marginBottom: Spacing.massive,
    lineHeight: 22,
  },
  recoveryPhraseSection: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semiBold,
    color: Colors.white,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.cardBackground,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonText: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
  },
  toggleButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.accent,
    borderRadius: 6,
  },
  toggleButtonText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  wordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (width - 60) / 2 - Spacing.md,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  wordNumber: {
    color: Colors.gray,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginRight: Spacing.sm,
    minWidth: 20,
  },
  wordInput: {
    flex: 1,
    color: Colors.white,
    fontSize: FontSizes.md,
    paddingVertical: Spacing.xs,
  },
  wordInputFilled: {
    borderColor: Colors.accent,
    backgroundColor: Colors.cardBackground,
  },
  
  validationStatus: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  validationText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  validationSuccess: {
    color: '#10B981',
  },
  validationError: {
    color: Colors.gray,
  },
  forgotPhraseButton: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.massive,
  },
  forgotPhraseText: {
    color: Colors.accent,
    fontSize: FontSizes.sm,
    textDecorationLine: 'underline',
  },
  loginButtonContainer: {
    marginBottom: Spacing.xl,
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  buttonContent: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    borderRadius: 12,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  createWalletButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  createWalletText: {
    color: Colors.gray,
    fontSize: FontSizes.base,
    textAlign: 'center',
  },
  createWalletLink: {
    color: Colors.accent,
    fontWeight: FontWeights.semiBold,
  },
});
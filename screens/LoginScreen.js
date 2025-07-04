import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);

  const handleLogin = () => {
    if (walletAddress.trim() && recoveryPhrase.trim()) {
      // Add your wallet login logic here
      console.log('Wallet Address:', walletAddress);
      console.log('Recovery Phrase:', recoveryPhrase);
      
      // Navigate to wallet dashboard or home screen
      navigation.navigate('TabNavigator');
    }
  };

  const isValidForm = walletAddress.trim() && recoveryPhrase.trim();

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Image */}
      <Image
        source={require('../assets/fourth.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrapper}>
            <View style={styles.content}>
              <Text style={styles.title}>Login to Wallet</Text>
              <Text style={styles.subtitle}>
                Enter your wallet address and recovery phrase to access your wallet.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Wallet Address"
                placeholderTextColor="#6B7280"
                value={walletAddress}
                onChangeText={setWalletAddress}
                keyboardAppearance="dark"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <View style={styles.recoveryPhraseContainer}>
              <TextInput
                style={styles.input}
                placeholder="Secret Recovery Phrase"
                placeholderTextColor="#6B7280"
                value={recoveryPhrase}
                onChangeText={setRecoveryPhrase}
                keyboardAppearance="dark"
                secureTextEntry={!showRecoveryPhrase}
                autoCapitalize="none"
                autoCorrect={false}
               />  
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowRecoveryPhrase(!showRecoveryPhrase)}
                >
                  <Text style={styles.eyeIcon}>
                    {showRecoveryPhrase ? '👁️' : '🙈'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.forgotPhraseButton}
                onPress={() => navigation.navigate('RecoveryHelp')}
              >
                <Text style={styles.forgotPhraseText}>
                  Forgot your recovery phrase?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  !isValidForm && styles.disabledButton,
                ]}
                onPress={handleLogin}
                disabled={!isValidForm}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </View>
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
          </View>
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
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    color: Colors.white,
    fontSize: FontSizes.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
    alignSelf: 'stretch',
  },
  recoveryPhraseContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  recoveryPhraseInput: {
    minHeight: 80,
    paddingRight: 50,
    marginBottom: 0,
  },
  eyeButton: {
    position: 'absolute',
    right: Spacing.md,
    top: Spacing.md,
    padding: Spacing.sm,
  },
  eyeIcon: {
    fontSize: 20,
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
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    width: '100%',
    alignSelf: 'stretch',
  },
  buttonContent: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    borderRadius: 12,
    width: '100%',
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    textAlign: 'center',
    flexShrink: 1,
  },
  disabledButton: {
    opacity: 0.5,
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
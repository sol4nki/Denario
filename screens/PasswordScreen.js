import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';

const { width, height } = Dimensions.get('window');


export default function PasswordScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleContinue = () => {
    if (password && confirmPassword && password === confirmPassword && agreedToTerms) {
      navigation.navigate('RecoveryPhrase');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Overflowing Background Image */}
      <Image
        source={require('../assets/fourth.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      />

      <View style={styles.contentWrapper}>
        <View style={styles.content}>
          <Text style={styles.title}>Password</Text>
          <Text style={styles.subtitle}>Use this to access your wallet.</Text>

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            keyboardAppearance="dark"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            keyboardAppearance="dark"
          />

          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms of Service</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.continueButton,
              (!password || !confirmPassword || password !== confirmPassword || !agreedToTerms) && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!password || !confirmPassword || password !== confirmPassword || !agreedToTerms}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
      </View>
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
  contentWrapper: {
    flex: 1,
    zIndex: 1,
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: Spacing.giant,
    marginTop: 260,
  },
  title: {
    ...CommonStyles.title,
    fontSize: FontSizes.xl,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...CommonStyles.subtitle,
    fontSize: FontSizes.base,
    marginBottom: Spacing.massive,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    color: Colors.white,
    fontSize: FontSizes.md,
    marginBottom: Spacing.xl,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.massive,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.navInactive,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xl - Spacing.md,
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
  termsText: {
    color: Colors.gray,
    fontSize: FontSizes.base,
    flex: 1,
  },
  termsLink: {
    color: Colors.accent,
    textDecorationLine: 'underline',
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Spacing.xxl,
  },
  buttonContent: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
  },
  disabledButton: {
    opacity: 0.5,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Spacing.giant,
    gap: Spacing.xl / 2,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  progressDotActive: {
    backgroundColor: Colors.accent,
  },
});

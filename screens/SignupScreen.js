
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';

export default function SignupScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View
        
        style={styles.gradient}
      >
        

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/main_logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome to Denario</Text>
          <Text style={styles.welcomeSubtitle}>
            Your secure crypto wallet solution
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.signupButton]}
            onPress={() => navigation.navigate('Password')}
          >
            <View
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Create New Wallet</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.loginButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>I already have a wallet</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
  },
  gradient: {
    flex: 1,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing.giant,
    marginBottom: Spacing.xxl,
  },
  logo: {
    width: 120,
    height: 120,
  },
  welcomeContainer: {
    alignItems: 'center',

    marginBottom: Spacing.massive * 2 + Spacing.xl,
  },
  welcomeTitle: {
    ...CommonStyles.title,
    fontSize: FontSizes.xl,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    ...CommonStyles.subtitle,
    fontSize: FontSizes.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: '5%',
    gap: Spacing.xl,
    flexDirection: 'column',
    alignItems: 'stretch',
    marginBottom: Spacing.xl,
  },
  button: {
    ...CommonStyles.button,
    borderRadius: 12,
    marginBottom: Spacing.sm * 2,
    width: '100%',
    alignSelf: 'stretch',
    paddingVertical: Spacing.xl,
    paddingHorizontal: 0,
  },
  signupButton: {
    marginBottom: 0,
  },
  buttonGradient: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignItems: 'center',
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    textAlign: 'center',
    flexShrink: 1,
  },
  loginButton: {
    backgroundColor: 'none',
    borderWidth: 1,
    borderColor: Colors.accent,
    paddingVertical: Spacing.xl,
    paddingHorizontal: 0,
    alignItems: 'center',
    borderRadius: 12,
    width: '100%',
    alignSelf: 'stretch',
  },
  loginButtonText: {
    color: Colors.gray,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    textAlign: 'center',
    flexShrink: 1,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: Spacing.giant,
  },
  footerText: {
    color: Colors.navInactive,
    fontSize: FontSizes.xs,
    textAlign: 'center',
    lineHeight: 18,
  },
});
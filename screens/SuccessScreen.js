// screens/SuccessScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';

const { width } = Dimensions.get('window');

export default function SuccessScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Background */}
      <Image
              source={require('../assets/fourth.png')}
              style={styles.backgroundImage}
              resizeMode="contain"
      />
      <View style={styles.overlay} />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        </View>

        <Text style={styles.title}>You're now all done!</Text>
        <Text style={styles.subtitle}>Thank you for joining Denario</Text>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('TabNavigator')} // or your main app route
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>Continue</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={[styles.progressDot, styles.activeDot]} />
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
    zIndex: 0,
  },

  content: {
    flex: 1,
    zIndex: 2,
    // paddingHorizontal: Spacing.xl + Spacing.md,
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: Colors.cardBackground,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  successIcon: {
    backgroundColor: Colors.background,
    borderRadius: 40,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    color: Colors.accent,
    fontSize: FontSizes.xl + Spacing.md,
    fontWeight: FontWeights.bold,
  },
  title: {
    ...CommonStyles.title,
    fontSize: FontSizes.xl,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...CommonStyles.subtitle,
    fontSize: FontSizes.base,
    marginBottom: Spacing.massive,
    textAlign: 'center',
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Spacing.xxl,
    width: '100%',
    alignSelf: 'stretch',
  },
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.xl,
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl / 2,
    marginTop: Spacing.xxl,
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
});

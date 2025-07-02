import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';

const { width } = Dimensions.get('window');

const SAMPLE_RECOVERY_PHRASE = [
  'swing', 'rival', 'track', 'chicken', 'device', 'estate',
  'castle', 'energy', 'twist', 'fortune', 'ridge', 'planet',
  'filter', 'glory', 'pistol', 'stable', 'lumber', 'wealth',
  'genre', 'fabric', 'helmet', 'velvet', 'sugar', 'zone',
];

export default function RecoveryPhraseScreen({ navigation }) {
  const [saved, setSaved] = useState(false);

  const handleContinue = () => {
    if (saved) {
      navigation.navigate('Success');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background image */}
      <Image
              source={require('../assets/fourth.png')}
              style={styles.backgroundImage}
              resizeMode="contain"
      />

      {/* Overlay to darken background if needed */}
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.title}>Secret Recovery Phrase</Text>
        <Text style={styles.subtitle}>
          This phrase is the ONLY way to recover your wallet!
        </Text>

        <ScrollView
          style={styles.phraseContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.phraseGrid}>
            {SAMPLE_RECOVERY_PHRASE.map((word, index) => (
              <View key={index} style={styles.wordBox}>
                <Text style={styles.wordIndex}>{index + 1}.</Text>
                <Text style={styles.wordText}>{word}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.savedContainer}
          onPress={() => setSaved(!saved)}
        >
          <View style={[styles.checkbox, saved && styles.checkboxChecked]}>
            {saved && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.savedText}>I saved my Recovery Phrase</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueButton, !saved && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!saved}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>Continue</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={[styles.progressDot, styles.activeDot]} />
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    opacity: 0.5,
    zIndex: 1,
  },
  content: {
    flex: 1,
    zIndex: 2,
    // paddingHorizontal: Spacing.giant,
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
  phraseContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: Spacing.xl,
    maxHeight: 200,
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
    width: '100%',
    alignSelf: 'stretch',
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
});

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
    flex: 1,
    backgroundColor: '#0D0A19',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0, // Push it up above SafeAreaView
    width: width,
    height: 375, // Adjust to your image size
    resizeMode: 'cover',
    zIndex: 0,
  },

  content: {
    flex: 1,
    zIndex: 2,
    paddingHorizontal: 24,
    paddingTop: 140,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 32,
    lineHeight: 20,
  },
  phraseContainer: {
    backgroundColor: '#1E1B2E',
    borderRadius: 12,
    padding: 16,
    maxHeight: 240,
    marginBottom: 30,
  },
  phraseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  wordBox: {
    backgroundColor: '#100D1F',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    minWidth: 80,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  wordIndex: {
    color: '#8B5CF6',
    fontWeight: 'bold',
    fontSize: 12,
  },
  wordText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  savedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  savedText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#6B7280',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#374151',
  },
  activeDot: {
    backgroundColor: '#8B5CF6',
  },
});

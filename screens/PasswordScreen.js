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
  Modal,
  ScrollView

} from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';

import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';

const { width, height } = Dimensions.get('window');


export default function PasswordScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
      
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
            <FontAwesome5 name="times" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.titleModal}>Terms of Service</Text>

          {/* Scrollable Terms Text */}
          <ScrollView style={styles.scrollArea}>
          <Text style={styles.termsText}>
              {`
(HACKATHON DEMO)

This application is a prototype developed for demonstration purposes only as part of a Web3 hackathon. By using this app, you acknowledge and agree to the following terms:

1. NO WARRANTY OR GUARANTEE:
This app is provided “as-is” and “as available” without any warranties or guarantees of any kind, either express or implied. The app may contain bugs, security vulnerabilities, or incomplete features. The developers do not warrant that the app will be uninterrupted, error-free, or secure.

2. LIMITATION OF LIABILITY:
The developers and associated parties are not responsible or liable for any loss, damage, or inconvenience caused by the use or inability to use this app. This includes but is not limited to loss of data, digital assets, or any other damages resulting from app usage.

3. NO COLLECTION OF PERSONAL DATA:
This app does not collect, store, or share any personal or sensitive user information. Any data input during usage is only stored temporarily on your device and will not be transmitted to third parties.

4. USER RESPONSIBILITY:
By using this app, you accept full responsibility for your actions and any consequences that may arise. You agree to use the app only in accordance with applicable laws and regulations.

5. INTELLECTUAL PROPERTY:
All content, code, graphics, and trademarks associated with this app are the property of the developers unless otherwise stated. Unauthorized use, reproduction, or distribution is prohibited.

6. GOVERNING LAW:
These terms shall be governed and construed in accordance with the laws of the jurisdiction in which the hackathon is organized, without regard to conflict of law principles.

7. CHANGES TO TERMS:
As this is a demo app for a hackathon, the developers reserve the right to update or modify these terms at any time without prior notice.

IF YOU DO NOT AGREE WITH THESE TERMS AND CONDITIONS, PLEASE DO NOT USE THIS APPLICATION.
              `}
            </Text>

          </ScrollView>
        </View>
      </SafeAreaView>

    </Modal>

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
              I agree to the 
              <Text 
                style={styles.termsLink} 
                onPress={() => setIsModalVisible(true)}
              >Terms of Service</Text>
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
    // paddingHorizontal: Spacing.giant,
    paddingHorizontal: '5%',
    marginTop: 260,
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
  continueButtonText: {
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






  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 20,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    position: 'relative',
  },
  
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    
  },
  
  titleModal: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#fff',
  },
  
  scrollArea: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  
  termsText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#fff',
  },
});

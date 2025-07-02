import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Text,
  Button,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from './styles/theme';

export default function Biometric() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleScanPress = () => setIsModalVisible(true);

  return (
    <SafeAreaView style={CommonStyles.container}>
      <StatusBar style="light" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.headerButton}
          onPress={() => console.log('Back pressed')}
        >
          <Ionicons name="arrow-back-outline" size={24} color={Colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Biometric Scan</Text>

        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.headerButton}
          onPress={() => console.log('Settings pressed')}
        >
          <Ionicons name="settings-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Main Card Section */}
      <View style={styles.cardSection}>
        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.scanButton}
            onPress={handleScanPress}
          >
            <SvgComponent />
          </TouchableOpacity>
          <Text style={styles.scanText}>Tap to Scan</Text>
        </View>
      </View>

      {/* Modal View */}
      <Modal visible={isModalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalView}>
          <Text style={{ fontSize: FontSizes.lg, marginBottom: Spacing.xl }}>Camera dekho friends</Text>
          <Button title="Close Modal" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// SVG Component
function SvgComponent(props) {
  return (
    <Svg
      width={150}
      height={150}
      viewBox="0 0 200 201"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M20 200.125c-5.5 0-10.208-1.958-14.125-5.875S0 185.625 0 180.125v-37.5a2.5 2.5 0 115 0v37.5c0 8.284 6.716 15 15 15h37.5a2.5 2.5 0 110 5H20zm-17.5-140a2.5 2.5 0 01-2.5-2.5v-37.5C0 14.625 1.958 9.917 5.875 6S14.5.125 20 .125h37.5a2.5 2.5 0 010 5H20c-8.284 0-15 6.716-15 15v37.5a2.5 2.5 0 01-2.5 2.5zm140 140a2.5 2.5 0 110-5H180c8.284 0 15-6.716 15-15v-37.5a2.5 2.5 0 115 0v37.5c0 5.5-1.958 10.208-5.875 14.125s-8.625 5.875-14.125 5.875h-37.5zm55-140a2.5 2.5 0 01-2.5-2.5v-37.5c0-8.284-6.716-15-15-15h-37.5a2.5 2.5 0 110-5H180c5.5 0 10.208 1.958 14.125 5.875S200 14.625 200 20.125v37.5a2.5 2.5 0 01-2.5 2.5z"
        fill="#fff"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  cardSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: Spacing.massive,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
    maxWidth: 350,
    shadowColor: Colors.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  scanButton: {
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  scanText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    marginTop: 0,
    fontWeight: FontWeights.medium,
  },
  modalView: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
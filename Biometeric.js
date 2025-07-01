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

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleScanPress = () => setIsModalVisible(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#0D0A19" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.topBarSideButton}
          onPress={() => console.log('Back pressed')}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>Biometric Scan</Text>

        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.topBarSideButton}
          onPress={() => console.log('Settings pressed')}
        >
          <Ionicons name="settings-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Scan Section */}
      <View style={styles.mainContent}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.scanButton}
          onPress={handleScanPress}
        >
          <SvgComponent />
        </TouchableOpacity>

        <Text style={styles.scanText}>Tap to Scan</Text>

        {/* Modal View */}
        <Modal visible={isModalVisible} animationType="slide" transparent={false}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>Camera dekho friends</Text>
            <Button title="Close Modal" onPress={() => setIsModalVisible(false)} />
          </View>
        </Modal>
      </View>
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
  container: {
    flex: 1,
    backgroundColor: '#0D0A19',
  },
  topBar: {
    height: 80,
    backgroundColor: '#16112B',
    borderBottomWidth: 1,
    borderBottomColor: '#29273A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  topBarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  topBarSideButton: {
    padding: 4,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    padding:10,
    marginBottom: 20,
    marginVertical:-175
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 0,
  },
  modalView: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

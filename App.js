// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import PasswordScreen from './screens/PasswordScreen';
import RecoveryPhraseScreen from './screens/RecoveryPhraseScreen';
import SuccessScreen from './screens/SuccessScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0D0A19' }
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Password" component={PasswordScreen} />
        <Stack.Screen name="RecoveryPhrase" component={RecoveryPhraseScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


/*
To install dependencies, run:
npm install @react-navigation/native @react-navigation/stack expo-linear-gradient react-native-gesture-handler react-native-safe-area-context react-native-screens

For Expo CLI projects, also run:
expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
*/
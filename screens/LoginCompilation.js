import React from 'react';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from './SignupScreen';
import PasswordScreen from './PasswordScreen';
import RecoveryPhraseScreen from './RecoveryPhraseScreen';
import SuccessScreen from './SuccessScreen';
import LoginScreen from './LoginScreen.js'
import TabNavigator from '../TabNavigator.js';

const Stack = createStackNavigator();

export default function LoginCompilation() {
  return (
    <NavigationIndependentTree>
      <Stack.Navigator 
        initialRouteName="Signup"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0D0A19' }
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Password" component={PasswordScreen} />
        <Stack.Screen name="RecoveryPhrase" component={RecoveryPhraseScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="TabNavigator" component={TabNavigator}/>
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
}

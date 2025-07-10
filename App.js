import React, {useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";


import {
  Alert
} from 'react-native';

import SignupScreen from "./screens/SignupScreen";
import PasswordScreen from "./screens/PasswordScreen";
import RecoveryPhraseScreen from "./screens/RecoveryPhraseScreen";
import SuccessScreen from "./screens/SuccessScreen";
import LoginCompilation from "./screens/LoginCompilation";

// import Homepage from './homepage/Homepage';

import Biometric from "./components/Biometric";
import Buy from "./components/Buy";
import QRscanner from "./components/QRscanner";
import Receive from "./components/Receive";
import Search from "./components/Search";
import SearchActivity from "./components/SearchActivity";
import Send from "./components/Send";

import CoinDetails from "./coinDetails/coinDetails";
import RecentLogs from "./activity/RecentLogs";
import TradeSwap from "./tradeSwap/TradeSwap";

import More from "./more/More";

import Welcome from "./welcome/Welcome";
import Welcome1 from "./welcome/Welcome1";
import Welcome2 from "./welcome/Welcome2";
import Welcome3 from "./welcome/Welcome3";

import TabNavigator from "./TabNavigator";

import * as Device from 'expo-device';



const Stack = createStackNavigator();

const Loggedin = false;




export default function App() {

  useEffect(() => {
    if (Device.isDevice && Device.isRootedExperimentalAsync) {
      Alert.alert(
        "Security Warning",
        "Your device appears to be rooted or jailbroken. For your security, some features may be disabled."
    );
  }},[]);



  if (Loggedin) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="TabNavigator"
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
            ...TransitionPresets.FadeFromBottomAndroid,
          }}
        >
          {/* <Stack.Screen name="Welcome" component={Welcome} /> */}
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="Biometric" component={Biometric} />
          <Stack.Screen name="Buy" component={Buy} />
          <Stack.Screen name="QRscanner" component={QRscanner} />
          <Stack.Screen name="Receive" component={Receive} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="SearchActivity" component={SearchActivity} />
          <Stack.Screen name="Send" component={Send} />
          <Stack.Screen name="CoinDetails" component={CoinDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Welcome" component={Welcome} />
  
          <Stack.Screen name="Welcome1" component={Welcome1} />
          <Stack.Screen name="Welcome2" component={Welcome2} />
          <Stack.Screen name="Welcome3" component={Welcome3} />
          <Stack.Screen name="LoginCompilation" component={LoginCompilation} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="Biometric" component={Biometric} />
          <Stack.Screen name="Buy" component={Buy} />
          <Stack.Screen name="QRscanner" component={QRscanner} />
          <Stack.Screen name="Receive" component={Receive} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="SearchActivity" component={SearchActivity} />
          <Stack.Screen name="Send" component={Send} />
          <Stack.Screen name="CoinDetails" component={CoinDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

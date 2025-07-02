import React, { useEffect, useRef } from 'react';
import {
  
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
  LinearGradient,
  Stop,
  Platform
  
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import Svg, { Path, Defs, ClipPath, G, ForeignObject } from 'react-native-svg';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';


import Welcome1 from "./Welcome1.js";
import Welcome2 from "./Welcome2.js";
import Welcome3 from "./Welcome3.js";

const { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();

// Main Welcome Component
export default function Welcome() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome1"
        screenOptions={{ headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          gestureResponseDistance: Platform.OS === 'android'
          ? { horizontal: 300 }
          : undefined,

          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,

         }}
        
      >
        <Stack.Screen name="Welcome1" component={Welcome1} />
        <Stack.Screen name="Welcome2" component={Welcome2} />
        <Stack.Screen name="Welcome3" component={Welcome3} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
    justifyContent: 'space-between',
    paddingVertical: Spacing.massive,
  },
  svgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.giant / 2,
  },
  svg: {
    opacity: 0.9,
  },
  contentContainer: {
    paddingHorizontal: Spacing.giant,
    paddingBottom: Spacing.giant,
  },
  title: {
    ...CommonStyles.title,
    fontSize: FontSizes.xl,
    marginBottom: Spacing.xxl,
    lineHeight: 38,
    textAlign: 'left',
  },
  subtitle: {
    ...CommonStyles.subtitle,
    fontSize: FontSizes.md,
    marginBottom: Spacing.massive,
    lineHeight: 22,
    textAlign: 'left',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: Spacing.massive,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginRight: Spacing.sm,
  },
  activeDot: {
    backgroundColor: Colors.accent,
    width: 30,
  },
  nextButtonWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(109, 90, 207, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  getStartedButton: {
    ...CommonStyles.button,
    marginBottom: Spacing.xxl,
  },
  getStartedButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    textAlign: 'center',
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    color: Colors.gray,
    fontSize: FontSizes.base,
  },
  loginLink: {
    color: Colors.accent,
    fontWeight: FontWeights.semiBold,
  },
});

// export default App;
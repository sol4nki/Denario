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
  
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Svg, { Path, Defs, ClipPath, G, ForeignObject } from 'react-native-svg';
import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';


import Welcome1 from "./Welcome1.js";
import Welcome2 from "./Welcome2.js";
import Welcome3 from "./Welcome3.js";

const { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();

const AnimatedSVG1 = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ]),
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true
          })
        ),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ rotate }] }}>
      <Svg width={width * 0.8} height={height * 0.4} viewBox="0 0 390 352" style={styles.svg}>
        <Defs>
          <ClipPath id="clip1">
            <Path d="M..." />
          </ClipPath>
          <LinearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#33255c" />
            <Stop offset="100%" stopColor="#bea9fe" />
          </LinearGradient>
        </Defs>
        <G clipPath="url(#clip1)">
          <Path d="M..." fill="url(#gradient1)" />
        </G>
      </Svg>
    </Animated.View>
  );
};

// Animated SVG Component 2
const AnimatedSVG2 = () => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(slideAnim, {
            toValue: 50,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -50,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View 
      style={{ 
        transform: [
          { scale: scaleAnim },
          { translateX: slideAnim }
        ]
      }}
    >
      <Svg 
        width={width * 0.8} 
        height={height * 0.4} 
        viewBox="0 0 314 354" 
        style={styles.svg}
      >
        <Defs>
          <ClipPath id="clip2">
            <Path d="M748.56 -102.016L785.764 -97.3144L787.184 -108.555L782.143 -118.701L748.56 -102.016ZM288.56 311.984L284.063 274.755L288.56 311.984ZM748.56 -102.016L711.356 -106.718C697.53 2.68826 593.546 237.377 284.063 274.755L288.56 311.984L293.056 349.214C645.974 306.591 768.923 35.9464 785.764 -97.3144L748.56 -102.016ZM288.56 311.984L284.063 274.755C185.759 286.627 134.434 267.258 108.299 242.074C82.1527 216.88 71.7975 176.764 76.6449 125.247C81.4469 74.2119 100.819 18.506 125.196 -28.1064C137.297 -51.2453 150.231 -71.3693 162.477 -86.9385C175.205 -103.121 185.408 -112.097 191.455 -115.624L172.56 -148.016L153.665 -180.408C135.712 -169.935 118.603 -152.473 103.526 -133.304C87.9666 -113.522 72.6037 -89.3805 58.7359 -62.8631C31.1753 -10.163 7.92273 55.0061 1.9747 118.221C-3.92793 180.954 6.84189 248.463 56.258 296.081C105.686 343.71 184.361 362.341 293.056 349.214L288.56 311.984ZM172.56 -148.016L191.455 -115.624C241.552 -144.848 340.239 -207.591 444.862 -226.888C496.313 -236.378 546.358 -234.703 591.29 -215.159C635.648 -195.865 679.195 -157.352 714.976 -85.3311L748.56 -102.016L782.143 -118.701C739.925 -203.68 684.472 -256.417 621.205 -283.935C558.511 -311.204 492.307 -311.904 431.258 -300.644C310.881 -278.441 199.568 -207.184 153.665 -180.408L172.56 -148.016Z" />
          </ClipPath>
        </Defs>
        <G clipPath="url(#clip2)">
          <Path
            d="M748.56 -102.016L785.764 -97.3144L787.184 -108.555L782.143 -118.701L748.56 -102.016ZM288.56 311.984L284.063 274.755L288.56 311.984ZM748.56 -102.016L711.356 -106.718C697.53 2.68826 593.546 237.377 284.063 274.755L288.56 311.984L293.056 349.214C645.974 306.591 768.923 35.9464 785.764 -97.3144L748.56 -102.016ZM288.56 311.984L284.063 274.755C185.759 286.627 134.434 267.258 108.299 242.074C82.1527 216.88 71.7975 176.764 76.6449 125.247C81.4469 74.2119 100.819 18.506 125.196 -28.1064C137.297 -51.2453 150.231 -71.3693 162.477 -86.9385C175.205 -103.121 185.408 -112.097 191.455 -115.624L172.56 -148.016L153.665 -180.408C135.712 -169.935 118.603 -152.473 103.526 -133.304C87.9666 -113.522 72.6037 -89.3805 58.7359 -62.8631C31.1753 -10.163 7.92273 55.0061 1.9747 118.221C-3.92793 180.954 6.84189 248.463 56.258 296.081C105.686 343.71 184.361 362.341 293.056 349.214L288.56 311.984ZM172.56 -148.016L191.455 -115.624C241.552 -144.848 340.239 -207.591 444.862 -226.888C496.313 -236.378 546.358 -234.703 591.29 -215.159C635.648 -195.865 679.195 -157.352 714.976 -85.3311L748.56 -102.016L782.143 -118.701C739.925 -203.68 684.472 -256.417 621.205 -283.935C558.511 -311.204 492.307 -311.904 431.258 -300.644C310.881 -278.441 199.568 -207.184 153.665 -180.408L172.56 -148.016Z"
            fill="url(#gradient2)"
          />
        </G>
      </Svg>
    </Animated.View>
  );
};


// Main Welcome Component
export default function Welcome() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome1"
        screenOptions={{ headerShown: false }}
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
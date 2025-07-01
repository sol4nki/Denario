import React, { 
    useEffect, 
    useRef 
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image
} from 'react-native';

import { Colors, FontSizes, FontWeights, Spacing, CommonStyles } from '../styles/theme';

const { width, height } = Dimensions.get('window');

export default function Welcome3({ navigation }){
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Button pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.rootContainer}>
        {/* Overflowing image positioned absolutely */}
        <Image
        source={require('../assets/third.png')}
        style={styles.overflowImage}
            />
        <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        
        {/* <View style={styles.svgContainer}>
            <AnimatedSVG1 />
        </View> */}

        <Animated.View 
            style={[
            styles.contentContainer,
            {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
            }
            ]}
        >
            <Text style={styles.title}>QUICK AND EASY{'\n'}ON THE GO</Text>
            <Text style={styles.subtitle}>Track. Trade. Trust.{'\n'}Stay in control.</Text>

            <View style={styles.dotsContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity 
                style={styles.getStartedButton}
                onPress={() => {
                // Navigate to main app or handle completion
                console.log('Get Started pressed');
                }}
            >
                <Text style={styles.getStartedButtonText}>Get started</Text>
            </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.loginContainer}>
            <Text style={styles.loginText} onPress={() => console.log("login pressed")}>
                Already have an account? <Text style={styles.loginLink}>login</Text>
            </Text>
            </TouchableOpacity>
        </Animated.View>
        </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    ...CommonStyles.container,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: Spacing.massive,
  },
  overflowImage: {
    position: 'absolute',
    top: 0,
    width: width,
    height: 375,
    resizeMode: 'cover',
    zIndex: 0,
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



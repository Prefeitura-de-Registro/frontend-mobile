import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

const ART_W = 430;
const ART_H = 932;
const { width, height } = Dimensions.get('window');

const logo = require('../../../assets/images/logo-fala-registro.png');

const SPLASH_DURATION = 4000;

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  
  const [opacity] = useState(() => new Animated.Value(0));
  const [scale] = useState(() => new Animated.Value(0.92));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [onFinish, opacity, scale]);

  return (
    <View style={styles.container}>
      
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${ART_W} ${ART_H}`}
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          
          <RadialGradient id="bg" cx="50%" cy="50%" r="60%">
            <Stop offset="0" stopColor="#FFFFFF" />
            <Stop offset="1" stopColor="#F0F0F0" />
          </RadialGradient>

          
          <LinearGradient id="circle" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0072AE" />
            <Stop offset="1" stopColor="#4A9BC4" />
          </LinearGradient>

          
          <LinearGradient id="waveLight" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#5DB9E8" />
            <Stop offset="1" stopColor="#3AA8E8" />
          </LinearGradient>
          <LinearGradient id="waveDark" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#5B9FC4" />
            <Stop offset="1" stopColor="#0072AE" />
          </LinearGradient>
        </Defs>

        <Rect width={ART_W} height={ART_H} fill="url(#bg)" />

        
        <Circle cx={0} cy={0} r={208} fill="#3BA9E8" />
        <Circle cx={0} cy={0} r={200} fill="url(#circle)" />

        <Path
          d="M208 78 A222 222 0 0 1 20 228"
          stroke="#3BA9E8"
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M202 142 A248 248 0 0 1 90 233"
          stroke="#3BA9E8"
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />

        
        <Path
          d="M430 637 C360 670 312 722 306 790 C300 850 272 890 175 932 L430 932 Z"
          fill="url(#waveLight)"
        />
        <Path
          d="M430 680 C372 706 332 752 324 802 C316 852 292 896 232 932 L430 932 Z"
          fill="url(#waveDark)"
        />
        
        <Path
          d="M175 932 C215 912 245 890 268 862 C250 900 230 920 205 932 Z"
          fill="#009FE3"
        />
      </Svg>

      <Animated.View
        style={[styles.logoWrapper, { opacity, transform: [{ scale }] }]}
      >
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.65,
    height: width * 0.65 * 0.28,
  },
});
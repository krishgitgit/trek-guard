import React, { useEffect } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useFonts } from 'expo-font';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCREEN_DIAGONAL = Math.sqrt(SCREEN_WIDTH * SCREEN_WIDTH + SCREEN_HEIGHT * SCREEN_HEIGHT);

export const INTRO_COLORS = {
  forestGreen: '#0B3D2E',
  offWhite: '#F8F7F2',
  charcoal: '#141716',
};

// Global trigger listener for replay from anywhere in the app
type Listener = () => void;
const replayListeners = new Set<Listener>();

export function triggerIntroReplay() {
  replayListeners.forEach((fn) => fn());
}

export function useIntroReplay(callback: Listener) {
  useEffect(() => {
    replayListeners.add(callback);
    return () => {
      replayListeners.delete(callback);
    };
  }, [callback]);
}

/**
 * Geometric TrekGuard Mountain Monogram
 * Built with pure React Native Views for 100% native reliability across all platforms and builds
 */
function MountainMonogram({ size = 48, color = INTRO_COLORS.offWhite }: { size?: number; color?: string }) {
  const height = (size * 34) / 44;
  return (
    <View style={[styles.monogramContainer, { width: size, height }]}>
      {/* Primary Mountain Peak (Sharp Isosceles) */}
      <View
        style={[
          styles.trianglePeak,
          {
            left: 0,
            borderLeftWidth: size * 0.38,
            borderRightWidth: size * 0.38,
            borderBottomWidth: height,
            borderBottomColor: color,
          },
        ]}
      />

      {/* Secondary Ridge / Twin Peak (Offset to right) */}
      <View
        style={[
          styles.trianglePeak,
          {
            right: 0,
            borderLeftWidth: size * 0.24,
            borderRightWidth: size * 0.24,
            borderBottomWidth: height * 0.68,
            borderBottomColor: color,
          },
        ]}
      />

      {/* Crisp geometric shadow crease in deep forest green */}
      <View
        style={[
          styles.ridgeCrease,
          {
            left: size * 0.37,
            height: height * 0.88,
          },
        ]}
      />
    </View>
  );
}

interface IntroProps {
  onFinish?: () => void;
  autoPlay?: boolean;
}

export function Intro({ onFinish, autoPlay = true }: IntroProps) {
  const [fontsLoaded] = useFonts({
    'Montserrat-Black': require('@/assets/fonts/Montserrat-Black.ttf'),
  });

  // Stage 1 (0.0 - 1.5s): Monogram Fade-in & Scale 90% -> 100%
  const monogramOpacity = useSharedValue(0);
  const monogramScale = useSharedValue(0.9);

  // Stage 2 (1.4 - 3.0s): Wordmark Slide-in from left (-30px) & Fade-in
  const wordmarkOpacity = useSharedValue(0);
  const wordmarkTranslateX = useSharedValue(-30);

  // Stage 3 (4.0 - 5.5s): Dot Splash Transition
  const lockupElementsOpacity = useSharedValue(1);
  const splashScale = useSharedValue(1);
  const splashOpacity = useSharedValue(0);

  // Stage 4 (5.2 - 6.2s): Fade-out Overlay revealing Blank Homepage
  const overlayOpacity = useSharedValue(1);

  useEffect(() => {
    if (!autoPlay) return;

    const smoothEaseOut = Easing.bezier(0.16, 1, 0.3, 1);
    const standardEaseOut = Easing.out(Easing.cubic);
    const splashCurve = Easing.bezier(0.22, 1, 0.36, 1);

    // 1. MONOGRAM FADE-IN — 0.0–1.5s
    monogramOpacity.value = withTiming(1, {
      duration: 1500,
      easing: smoothEaseOut,
    });
    monogramScale.value = withTiming(1, {
      duration: 1500,
      easing: smoothEaseOut,
    });

    // 2. WORDMARK SLIDE-IN — 1.4–3.0s (Starts at 1.4s, takes 1.6s)
    wordmarkOpacity.value = withDelay(
      1400,
      withTiming(1, {
        duration: 1600,
        easing: smoothEaseOut,
      })
    );
    wordmarkTranslateX.value = withDelay(
      1400,
      withTiming(0, {
        duration: 1600,
        easing: smoothEaseOut,
      })
    );

    // 3. LOGO HOLD & DOT SPLASH TRANSITION — 4.0–6.2s
    // Rest of lockup gently fades out while the dot begins expanding
    lockupElementsOpacity.value = withDelay(
      4000,
      withTiming(0, {
        duration: 600,
        easing: standardEaseOut,
      })
    );

    // The white dot splash expands smoothly to take over the screen
    splashOpacity.value = withDelay(
      4000,
      withTiming(1, {
        duration: 150,
        easing: Easing.linear,
      })
    );

    // Scale calculation: expands the 8px white circle to comfortably cover screen diagonal
    const expansionScale = Math.ceil((SCREEN_DIAGONAL * 2.5) / 8);

    splashScale.value = withDelay(
      4050,
      withTiming(expansionScale, {
        duration: 2200,
        easing: Easing.bezier(0.18, 0.9, 0.32, 1),
      })
    );

    // 4. APP REVEAL — 5.9–7.1s
    overlayOpacity.value = withDelay(
      5900,
      withTiming(
        0,
        {
          duration: 1200,
          easing: standardEaseOut,
        },
        (finished) => {
          if (finished && onFinish) {
            runOnJS(onFinish)();
          }
        }
      )
    );
  }, [autoPlay]);

  // Animated Styles
  const animatedMonogramStyle = useAnimatedStyle(() => ({
    opacity: monogramOpacity.value,
    transform: [{ scale: monogramScale.value }],
  }));

  const animatedWordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ translateX: wordmarkTranslateX.value }],
  }));

  const animatedLockupContentStyle = useAnimatedStyle(() => ({
    opacity: lockupElementsOpacity.value,
  }));

  const animatedSplashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
    transform: [{ scale: splashScale.value }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: overlayOpacity.value <= 0.02 ? 'none' : 'auto',
  }));

  return (
    <Animated.View style={[styles.fullscreenOverlay, animatedOverlayStyle]}>
      {/* Centered Anchor at ~43% screen height */}
      <View style={styles.centerContainer}>
        <View style={styles.lockupRow}>
          {/* Monogram + Dot Box */}
          <Animated.View style={[styles.monogramBox, animatedMonogramStyle]}>
            {/* The Mountain Silhouette */}
            <Animated.View style={animatedLockupContentStyle}>
              <MountainMonogram size={50} color={INTRO_COLORS.offWhite} />
            </Animated.View>

            {/* The Monogram White Dot (upper-right) */}
            <Animated.View style={[styles.monogramDot, animatedLockupContentStyle]} />

            {/* The Expanding White Splash Circle (Anchored exactly at the Dot center) */}
            <Animated.View style={[styles.expandingSplashDot, animatedSplashStyle]} />
          </Animated.View>

          {/* Wordmark "TREKGUARD" */}
          <Animated.View
            style={[
              styles.wordmarkBox,
              animatedWordmarkStyle,
              animatedLockupContentStyle,
            ]}
          >
            <Text
              style={[
                styles.wordmarkText,
                fontsLoaded && { fontFamily: 'Montserrat-Black' },
              ]}
            >
              TREKGUARD
            </Text>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: INTRO_COLORS.forestGreen,
    zIndex: 999999,
    elevation: 999999,
  },
  centerContainer: {
    position: 'absolute',
    top: '43%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramBox: {
    position: 'relative',
    width: 50,
    height: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  monogramContainer: {
    position: 'relative',
  },
  trianglePeak: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderStyle: 'solid',
  },
  ridgeCrease: {
    position: 'absolute',
    bottom: 0,
    width: 1.5,
    backgroundColor: INTRO_COLORS.forestGreen,
    transform: [{ rotate: '-6deg' }],
  },
  monogramDot: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: INTRO_COLORS.offWhite,
  },
  expandingSplashDot: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: INTRO_COLORS.offWhite,
    zIndex: 100,
  },
  wordmarkBox: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  wordmarkText: {
    color: INTRO_COLORS.offWhite,
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 3.5,
    textTransform: 'uppercase',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif-black',
      default: 'sans-serif',
    }),
  },
});

export default Intro;

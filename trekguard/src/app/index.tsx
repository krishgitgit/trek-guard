import React from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { INTRO_COLORS, triggerIntroReplay } from '@/components/intro';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Blank Homepage */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Pressable
            style={({ pressed }) => [
              styles.replayButton,
              pressed && styles.replayButtonPressed,
            ]}
            onPress={() => triggerIntroReplay()}
          >
            <Text style={styles.replayButtonText}>Replay Intro</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F2',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2DFD2',
    backgroundColor: '#EDE9DC',
  },
  replayButtonPressed: {
    opacity: 0.7,
  },
  replayButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: INTRO_COLORS.forestGreen,
    letterSpacing: 0.5,
  },
});

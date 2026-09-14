import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Intro from '@/components/intro';

export default function IntroScreen() {
  const router = useRouter();
  const [key, setKey] = useState(0);

  const handleFinish = () => {
    // Navigate back to home if navigated as a route, or keep visible for replay
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Intro key={key} onFinish={handleFinish} autoPlay={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B3D2E',
  },
});

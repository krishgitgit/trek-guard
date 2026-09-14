import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, View } from 'react-native';

import AppTabs from '@/components/app-tabs';
import Intro, { useIntroReplay } from '@/components/intro';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [showIntro, setShowIntro] = useState(true);
  const [introKey, setIntroKey] = useState(0);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  useIntroReplay(() => {
    setShowIntro(true);
    setIntroKey((prev) => prev + 1);
  });

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <AppTabs />
        {showIntro && (
          <Intro
            key={introKey}
            onFinish={() => {
              setShowIntro(false);
            }}
          />
        )}
      </View>
    </ThemeProvider>
  );
}

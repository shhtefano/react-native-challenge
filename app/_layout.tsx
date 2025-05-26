import '../global.css';

import { Stack } from 'expo-router';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { SplashScreen } from 'expo';
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    PlayRegular: require('../assets/fonts/Play-Regular.ttf')
  });


  if (!fontsLoaded) {
    return null;
  }


  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
      <Stack screenOptions={{
        headerTitleStyle: { fontFamily: 'PlayRegular' },
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

      </ClerkLoaded>
    </ClerkProvider>
  );
}

import '../global.css';

import { Stack } from 'expo-router';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Image } from 'react-native';
import { Link } from 'expo-router';
import {HeaderButton} from '../components/HeaderButton';
// export const unstable_settings = {
//   initialRouteName: '(tabs)',
// };

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
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerShadowVisible: false,     // disattiva ombra predefinita
        headerTitleAlign: 'center', // Titolo centrato

        headerRight: () => (
          <Link href="/profile" asChild>
            <HeaderButton />
          </Link>
        ),
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

      </ClerkLoaded>
    </ClerkProvider>
  );
}

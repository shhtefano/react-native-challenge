import '../global.css';

import { Stack } from 'expo-router';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Image } from 'react-native';
import { Link } from 'expo-router';
import { HeaderButton } from '../components/Header/HeaderButton';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';
// export const unstable_settings = {
//   initialRouteName: '(tabs)',
// };

export default function RootLayout() {

  const router = useRouter();
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
            <TouchableOpacity
              onPress={() => router.push('/(home)/profile')}
              style={{ marginRight: 10 }}
            >
              {/* <HeaderButton /> */}

            </TouchableOpacity>
          )
          ,
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>

      </ClerkLoaded>
    </ClerkProvider>
  );
}

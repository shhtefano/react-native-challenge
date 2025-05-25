import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ScreenContent } from '~/components/ScreenContent';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Text } from 'react-native'
import { SignOutButton } from '~/components/SignOutButton'
import { Link } from 'expo-router'
import { GoogleSignInButton } from '~/components/GoogleSignInButton';


export default function Nickname() {
    const { user } = useUser()

  return (
    <>
      <Stack.Screen options={{ title: 'Nickname' }} />
      <View style={styles.container}>
        {/* <ScreenContent path="app/(tabs)/profile.tsx" title="Profile" /> */}
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}!</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        
                <Text>Hello guest!</Text>
        <GoogleSignInButton />
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
      
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});

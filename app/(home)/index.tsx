import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import { GoogleSignInButton } from '~/components/GoogleSignInButton'
import { SignOutButton } from '~/components/SignOutButton'
import { Stack } from 'expo-router';

export default function Page() {
  const { user } = useUser()

  return (
    <View>
      <Stack.Screen options={{ title: 'Jetop App!' }} />

      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>


      <SignedOut>

        <GoogleSignInButton />

      </SignedOut>
    </View>
  )
}
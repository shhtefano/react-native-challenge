import { Stack } from 'expo-router';
import { StyleSheet, View, Text, Image } from 'react-native';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { GoogleSignInButton } from '~/components/GoogleSignInButton';
import { SignOutButton } from '~/components/SignOutButton';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '~/components/Button';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { user } = useUser();
  const router = useRouter();
  return (
    <LinearGradient
      colors={['#121212', '#38399A', '#9379C2', '#121212']}
      start={{ x: 0.8, y: 0.1 }}
      end={{ x: 0.8, y: 0.9 }}
      style={styles.container}
    >

      <Stack.Screen
        options={{
          title: 'Profile',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#121212',
          },
          // headerShadowVisible: false,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => null,
        
        }}

      />

      <View style={styles.container}>
        <SignedIn>
          <View style={styles.card}>
            <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
            <Text style={styles.name}>{user?.fullName}</Text>
            <Text style={styles.email}>{user?.emailAddresses[0].emailAddress}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>

              <Button title="Eventi" onPress={() => { router.replace('/(tabs)/events') }} style={{ backgroundColor: '#121212', borderRadius: 10 }} />
              <Button title="I miei ticket" onPress={() => { router.replace('/tickets') }} style={{ backgroundColor: '#121212', borderRadius: 10 }} />
            </View>
            <SignOutButton />
          </View>
        </SignedIn>

        <SignedOut>
          <GoogleSignInButton />
        </SignedOut>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 40,
    marginBottom: 80, // Spazio tra la card e il bottone di sign out
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderColor: '#fff',
    borderWidth: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
    color: '#fff',
  },
  email: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 40,

  },
  info: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
});

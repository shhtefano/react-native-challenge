import { Stack } from 'expo-router';
import { StyleSheet, View, Text, Image } from 'react-native';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { GoogleSignInButton } from '~/components/GoogleSignInButton';
import { SignOutButton } from '~/components/SignOutButton';

export default function Profile() {
  const { user } = useUser();
  
  return (
    <>
      <Stack.Screen options={{
        title: 'Profile',
        headerBackTitle: 'Back',
        headerStyle: {
          backgroundColor: '#7463B4',
        },
        headerTintColor: '#fff', // Testo e icone bianchi
        headerTitleStyle: {
          fontWeight: 'bold', // opzionale per rendere il titolo in grassetto
        },
      }} />
      <View style={styles.container}>
        <SignedIn>
          <View style={styles.card}>
            <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
            <Text style={styles.name}>{user?.fullName}</Text>
            <Text style={styles.email}>{user?.emailAddresses[0].emailAddress}</Text>
            <SignOutButton />
          </View>
        </SignedIn>

        <SignedOut>
          <GoogleSignInButton />
        </SignedOut>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A29ED1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    marginBottom: 120, // Spazio tra la card e il bottone di sign out
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
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
});

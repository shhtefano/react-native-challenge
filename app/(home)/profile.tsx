import { Stack } from 'expo-router';
import { StyleSheet, View, Text, Image } from 'react-native';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { GoogleSignInButton } from '~/components/Authentication/GoogleSignInButton';
import { SignOutButton } from '~/components/Authentication/SignOutButton';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '~/components/General/Button';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
          title: 'Profilo',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => null,
          headerLeft:() => (
             <Ionicons
    name="arrow-back"
    size={24}
    color="#fff"
    style={{ marginLeft: 10 }}
    onPress={() => router.back()}
  />
          ),
        }}

      />

      <View style={styles.container}>
        <SignedIn>
          <View style={styles.card}>
            <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
            <Text style={styles.name}>{user?.fullName}</Text>
            <Text style={styles.email}>{user?.emailAddresses[0].emailAddress}</Text>
            <View style={{
              width: '100%',
              maxWidth: 300,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginBottom: 40
            }}>
              <Button
                title="Eventi"
                onPress={() => { router.replace('/(tabs)/events') }}
                style={{
                  backgroundColor: 'rgba(18, 18, 18, 0.75)',
                  borderRadius: 16,
                  width: '60%',
                  marginBottom: 10,
                }}
              />
              <Button
                title="I miei ticket"
                onPress={() => { router.replace('/tickets') }}
                style={{
                  backgroundColor: 'rgba(174, 117, 178, 0.75)',
                  borderRadius: 16,
                  width: '60%',
                }}
              />
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
    backgroundColor: 'rgba(18, 18, 18, 0.6)', // <-- cambiato
    borderRadius: 12,
    padding: 40,
    minWidth: 300,
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  }
  ,
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

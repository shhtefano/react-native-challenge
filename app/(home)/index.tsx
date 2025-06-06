import React from 'react'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { router, Stack } from 'expo-router'
import { Text, View, StyleSheet } from 'react-native'
import { GoogleSignInButton } from '~/components/Authentication/GoogleSignInButton'
import { SignOutButton } from '~/components/Authentication/SignOutButton'
import { LinearGradient } from 'expo-linear-gradient'
import { Image } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { Button } from '~/components/General/Button'

export default function Homepage() {
  const { user } = useUser()

  return (
    <LinearGradient
      colors={['#000000', '#38399A', '#9379C2', '#000000']}
      start={{ x: 0.8, y: 0.1 }}
      end={{ x: 0.8, y: 0.9 }}
      style={styles.container}
    >
      <StatusBar style="light" />

      <Stack.Screen options={{
        title: 'Home', headerTintColor: '#fff', headerBackTitle: '', headerStyle: { backgroundColor: 'black' }, headerTitleStyle: { fontFamily: 'PlayRegular', fontSize: 20 },
      }} />

      <Image
        source={require('../../assets/jetop_logo.png')}
        style={styles.logo}
        alt="Jetop Logo"
        width={200}
      />


      <SignedIn>
        <Stack.Screen options={{
          title: 'Home',
          headerTintColor: '#fff',
          headerBackTitle: '',
          headerStyle: { backgroundColor: 'black' },
          headerTitleStyle: { fontFamily: 'PlayRegular', fontSize: 20 },
          headerRight: () => (
            // qui puoi mettere ad esempio una foto profilo se vuoi
            <Image
              source={{ uri: user?.imageUrl }}
              style={{ width: 32, height: 32, borderRadius: 16, marginRight: 10 }}
            />
          ),
        }} />
        <Text style={[styles.text, { color: 'white' }]}>
          <Text>Salve, {user?.fullName}!</Text>

        </Text>
        <Button title="Entra" onPress={() => { router.replace('/(tabs)/events') }} style={{
          alignItems: 'center',
          backgroundColor: 'black',
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: 12,
          borderWidth: 1,
          marginTop: 5,
        }} />

        <SignOutButton />
      </SignedIn>

      <SignedOut>
        <Stack.Screen options={{
          title: 'Home',
          headerTintColor: '#fff',
          headerBackTitle: '',
          headerStyle: { backgroundColor: 'black' },
          headerTitleStyle: { fontFamily: 'PlayRegular', fontSize: 20 },
          headerRight: () => null,
        }} />

        <Button
          title="Entra come ospite"
          onPress={() => { router.replace('/(tabs)/events') }}
          style={{
            alignItems: 'center',
            backgroundColor: '#121212',
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 10,
            marginBottom: 20,
          }}
        />
        <GoogleSignInButton />

      </SignedOut>

    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
})

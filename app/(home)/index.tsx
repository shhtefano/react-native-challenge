import React from 'react'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Stack } from 'expo-router'
import { Text, View, StyleSheet } from 'react-native'
import { GoogleSignInButton } from '~/components/GoogleSignInButton'
import { SignOutButton } from '~/components/SignOutButton'
import { LinearGradient } from 'expo-linear-gradient'
import { Image } from 'react-native'

export default function Homepage() {
  const { user } = useUser()

  return (
    <LinearGradient
      colors={[ '#38399A', '#9379C2']}
      start={{ x: 1, y: 0}}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Stack.Screen options={{ title: 'Jetop App' }} />
      
      <Image 
        source={require('../../assets/jetop_logo.png')} 
        style={styles.logo}
        alt="Jetop Logo"
        width={200}
      />
      

      <SignedIn>
        <Text style={[styles.text, { color: 'white' }]}>
          <Text>Welcome back, {user?.fullName}!</Text>

        </Text>
        <SignOutButton />
      </SignedIn>

      <SignedOut>
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

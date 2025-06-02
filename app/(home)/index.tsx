import React from 'react'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { router, Stack } from 'expo-router'
import { Text, View, StyleSheet } from 'react-native'
import { GoogleSignInButton } from '~/components/GoogleSignInButton'
import { SignOutButton } from '~/components/SignOutButton'
import { LinearGradient } from 'expo-linear-gradient'
import { Image } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { Button } from '~/components/Button'

export default function Homepage() {
  const { user } = useUser()

  return (
    <LinearGradient
      colors={['#000000','#38399A','#9379C2','#000000' ]}
      start={{ x: 0.8, y: 0.1 }}
      end={{ x: 0.8, y: 0.9 }}
      style={styles.container}
    >
      <StatusBar style="light" />

      <Stack.Screen options={{
        title: '', headerTintColor: '#fff', headerBackTitle: 'Home', headerStyle: { backgroundColor: 'black' }, headerTitleStyle: { fontFamily: 'PlayRegular', fontSize: 20 },
      }} />

      <Image
        source={require('../../assets/jetop_logo.png')}
        style={styles.logo}
        alt="Jetop Logo"
        width={200}
      />


      <SignedIn>
        <Text style={[styles.text, { color: 'white' }]}>
          <Text>Salve, {user?.fullName}!</Text>

        </Text>
        <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 20}}>

        <Button title="I miei ticket" onPress={() => {router.push('/tickets')}} style={{ marginBottom: 20, backgroundColor: '#121212', borderRadius: 10 }} />
        <Button title="Eventi" onPress={() => {router.push('/(tabs)/events')}} style={{ marginBottom: 20, backgroundColor: '#121212', borderRadius: 10 }} />
         </View> 
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

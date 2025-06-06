import React from 'react'
import { Text, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { useOAuth } from '@clerk/clerk-expo'
import * as AuthSession from 'expo-auth-session'
import { useWarmUpBrowser } from './useWarmUpBrowser'
import { useRouter } from 'expo-router'

WebBrowser.maybeCompleteAuthSession()

export function GoogleSignInButton() {
  
  // eseugita soltanto per ios e android
  useWarmUpBrowser()
  
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const router = useRouter()

  const handlePress = async () => {
    try {
      const res = await startOAuthFlow()

      if (res?.createdSessionId && res.setActive) {
        await res.setActive({ session: res.createdSessionId })

        router.replace('/profile')
      } else {
        console.warn('OAuth flow incomplete', res)
      }
    } catch (err) {
      console.error('OAuth error:', err)
    }
  }

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Image
        source={require('../../assets/Google_logo.png')}
        alt="Google Icon"
        style={styles.icon}
      />
      <Text style={styles.text}>Sign in with Google</Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal:10,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    borderColor: '#ddd',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
})
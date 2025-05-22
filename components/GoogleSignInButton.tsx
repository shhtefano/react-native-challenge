import React from 'react'
import { Button } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { useOAuth } from '@clerk/clerk-expo'
import * as AuthSession from 'expo-auth-session'
import { useWarmUpBrowser } from './useWarmUpBrowser'
import { useRouter } from 'expo-router'

WebBrowser.maybeCompleteAuthSession()

export function GoogleSignInButton() {
  useWarmUpBrowser()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const router = useRouter()

  const handlePress = async () => {
    try {
      const res = await startOAuthFlow()

      if (res?.createdSessionId && res.setActive) {
        await res.setActive({ session: res.createdSessionId })

        router.replace('/(tabs)/profile')
      } else {
        console.warn('OAuth flow incomplete', res)
      }
    } catch (err) {
      console.error('OAuth error:', err)
    }
  }

  return <Button title="Sign in with Google" onPress={handlePress} />
}


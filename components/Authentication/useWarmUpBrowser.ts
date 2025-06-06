import * as WebBrowser from 'expo-web-browser'
import { useEffect } from 'react'
import { Platform } from 'react-native'

export function useWarmUpBrowser() {
  useEffect(() => {

    // se acceduto da web, non fare nulla
    if (Platform.OS !== 'web') {
      void WebBrowser.warmUpAsync()
      return () => {
        void WebBrowser.coolDownAsync()
      }
    }
  }, [])
}

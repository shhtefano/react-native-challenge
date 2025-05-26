import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

export const SignOutButton = () => {
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    try {
      await signOut()
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <TouchableOpacity style={styles.button} onPress={handleSignOut}>
      <Text style={styles.text}>Sign out</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white', // rosso Google per coerenza
  },
})

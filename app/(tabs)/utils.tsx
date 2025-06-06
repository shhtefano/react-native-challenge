import { Stack } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { useState, useEffect } from 'react';
import { GoogleSignInButton } from '~/components/Authentication/GoogleSignInButton';
import DiceGameAccordion from '~/components/Utils/DiceGameAccordion';
import NicknameGeneratorAccordion from '~/components/Utils/NicknameGenerator';
import GroupRandomizerAccordion from '~/components/Utils/GroupRandomizer';

const loadingMessages = [
  "Sto pensando ai migliori nomi...",
  "Quasi pronto...",
  "Aggiungo un po' di magia...",
  "Elaborazione in corso...",
  "Caricamento della creatività...",
];

export default function Utils() {

  const [loading, setLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    } else {
      setMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <>
      <Stack.Screen options={{ title: 'Utils', headerTintColor:'white', headerStyle:{backgroundColor:'black'}, } } />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} style={styles.scrollContainer}>
          <SignedIn>
            <NicknameGeneratorAccordion />
            <GroupRandomizerAccordion />
            <DiceGameAccordion />

          </SignedIn>

          <SignedOut>
            <View style={styles.loggedOutContainer}>
              <Text style={styles.loggedOutText}>
                🔒 Per generare i tuoi nickname personalizzati, effettua il login.
              </Text>
              <GoogleSignInButton />
            </View>
          </SignedOut>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );

}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#121212',
    flexGrow: 1,
    gap: 24,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  card: {
    backgroundColor: '#1e1e2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#2d2d44',
    textAlign: 'center',
    // marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 16,
  },
  button: {
    marginBottom: 24,
  },
  loadingBox: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
  },
  resultsContainer: {
    gap: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  nicknameCard: {
    backgroundColor: '#2b2b2b',
    padding: 12,
    borderRadius: 8,
    borderColor: '#444',
    borderWidth: 1,
  },
  nickname: {
    fontSize: 18,
    fontWeight: '500',
    color: '#00FFCC',
  },
  loggedOutContainer: {
    marginTop: 48,
    padding: 16,
    gap: 16,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  loggedOutText: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
});


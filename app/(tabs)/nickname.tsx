import { Stack } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { useState, useEffect } from 'react';
import { generateNicknames } from '../../lib/ollama';
import LottieView from 'lottie-react-native';
import { GoogleSignInButton } from '~/components/GoogleSignInButton';

const loadingMessages = [
  "Sto pensando ai migliori nomi...",
  "Quasi pronto...",
  "Aggiungo un po' di magia...",
  "Elaborazione in corso...",
  "Caricamento della creatività...",
];

export default function Nickname() {
  const { user } = useUser();
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<string[]>([]);
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

  const handleGenerate = async () => {
    setLoading(true);
    setResults([]);
    const names = await generateNicknames(prompt);
    setResults(names);
    setLoading(false);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Nickname' }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} style={styles.scrollContainer}>
          <SignedIn>
            <Text style={styles.title}>🎮 Generatore di Nickname</Text>

            <Text style={styles.label}>Come vuoi che siano i tuoi nickname?</Text>
            <TextInput
              placeholder="Es. divertenti, fantasy, futuristici..."
              value={prompt}
              onChangeText={setPrompt}
              style={styles.input}
              placeholderTextColor="#888"
              editable={!loading}
            />

            <View style={styles.button}>
              <Button
                title={loading ? "Generando..." : "Genera Nickname"}
                color="#00C896"
                onPress={handleGenerate}
                disabled={loading || !prompt.trim()}
              />
            </View>

            {loading && (
              <View style={styles.loadingBox}>
                <LottieView
                  source={require('../../assets/animation/animation.json')}
                  autoPlay
                  loop
                  style={{ width: 150, height: 150 }}
                />
                <Text style={styles.loadingText}>{loadingMessages[messageIndex]}</Text>
              </View>
            )}

            {results.length > 0 && (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultTitle}>✨ Ecco i tuoi nickname:</Text>
                {results.map((name, index) => (
                  <View key={index} style={styles.nicknameCard}>
                    <Text style={styles.nickname}>{name}</Text>
                  </View>
                ))}
              </View>
            )}
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
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
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
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 8,
    borderColor: '#333',
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

import { Stack } from 'expo-router';
import { StyleSheet, View, Text, TextInput, Button, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SignedIn, useUser } from '@clerk/clerk-expo';
import { useState, useEffect } from 'react';
import { generateNicknames } from '../../lib/ollama';
import LottieView from 'lottie-react-native';

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

  // Cambia il messaggio ogni 2s durante il caricamento
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
        <ScrollView contentContainerStyle={styles.container}>
          <SignedIn>
            <Text style={styles.welcome}>Ciao, {user?.firstName} 👋</Text>
          </SignedIn>

          <Text style={styles.label}>Come vuoi che siano i tuoi nickname?</Text>
          <TextInput
            placeholder="Es. divertenti, fantasy, futuristici..."
            value={prompt}
            onChangeText={setPrompt}
            style={styles.input}
          />

          <View style={styles.button}>
            <Button
              title={loading ? "Generando..." : "Genera Nickname"}
              color="#000"
              onPress={handleGenerate}
              disabled={loading || !prompt.trim()}
            />
          </View>

          {/* 🔄 Animazione e messaggi durante il loading */}
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

          <View style={styles.resultsContainer}>
            {results.map((name, index) => (
              <View key={index} style={styles.nicknameCard}>
                <Text style={styles.nickname}>✨ {name}</Text>
              </View>
            ))}
          </View>
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
  welcome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
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
  nicknameCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  nickname: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
});

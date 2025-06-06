import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, TouchableOpacity
} from 'react-native';
import LottieView from 'lottie-react-native';
import { generateNicknames } from '~/lib/ollama';

const loadingMessages = [
  "Sto pensando ai migliori nomi...",
  "Quasi pronto...",
  "Aggiungo un po' di magia...",
  "Elaborazione in corso...",
  "Caricamento della creatività...",
];

export default function NicknameGenerator() {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [open, setOpen] = useState(true);

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
    try {
      const names = await Promise.race([
        generateNicknames(prompt),
        new Promise<string[]>((_, reject) =>
          setTimeout(() => reject(new Error('Forse il server sta dormendo, riprova più tardi...')), 20000)
        ),
      ]);
      setResults(names);
    } catch (err) {
      setResults([err instanceof Error ? err.message : 'Errore sconosciuto']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Text style={styles.cardHeader}>
          {open ? '▲' : '▼'} Generatore di nickname 🎮
        </Text>
      </TouchableOpacity>
      {open && (
        <>
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
              color="#8e63c6"
              onPress={handleGenerate}
              disabled={loading || !prompt.trim()}
            />
          </View>
          {loading && (
            <View style={styles.loadingBox}>
              <LottieView
                source={require('~/assets/animation/animation.json')}
                autoPlay loop style={{ width: 150, height: 150 }}
              />
              <Text style={styles.loadingText}>{loadingMessages[messageIndex]}</Text>
            </View>
          )}
          {results.length > 0 && (
            <View style={{ gap: 12 }}>
              <Text style={styles.resultTitle}>✨ Ecco i tuoi nickname:</Text>
              {results.map((name, i) => (
                <View key={i} style={styles.nicknameCard}>
                  <Text style={styles.nickname}>{name}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#2d2d44',
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
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
  button: { marginBottom: 24 },
  loadingBox: { alignItems: 'center', marginBottom: 32 },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
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
});

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
  TouchableOpacity,
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

  const [showNicknameSection, setShowNicknameSection] = useState(true);
  const [showGroupSection, setShowGroupSection] = useState(false);

  const [namesInput, setNamesInput] = useState('');
  const [groupCount, setGroupCount] = useState('');
  const [groupResults, setGroupResults] = useState<string[][]>([]);

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
      if (err instanceof Error) {
        setResults([err.message]);
      } else {
        setResults(['Errore sconosciuto']);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGroupShuffle = () => {
    const names = namesInput.split(',').map((name) => name.trim()).filter(Boolean);
    const count = parseInt(groupCount);
    if (isNaN(count) || count <= 0 || names.length === 0) {
      return;
    }
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const groups: string[][] = Array.from({ length: count }, () => []);
    shuffled.forEach((name, idx) => {
      groups[idx % count].push(name);
    });
    setGroupResults(groups);
  };

  return (
  <>
    <Stack.Screen options={{ title: 'Utils' }} />
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollContainer}>
        <SignedIn>
          {/* Accordion Nickname */}
          <View style={styles.card}>
            <TouchableOpacity onPress={() => setShowNicknameSection(!showNicknameSection)}>
              <Text style={styles.cardHeader}>
                {showNicknameSection ? '▲' : '▼'} Generatore di Nickname 🎮
              </Text>
            </TouchableOpacity>
            {showNicknameSection && (
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
              </>
            )}
          </View>

          {/* Accordion Gruppi */}
          <View style={styles.card}>
            <TouchableOpacity onPress={() => setShowGroupSection(!showGroupSection)}>
              <Text style={styles.cardHeader}>
                {showGroupSection ? '▲' : '▼'} Randomizzazione Gruppi 👥
              </Text>
            </TouchableOpacity>
            {showGroupSection && (
              <>
                <Text style={styles.label}>Inserisci i nomi separati da virgola:</Text>
                <TextInput
                  placeholder="Es: Luca, Marco, Giulia..."
                  value={namesInput}
                  onChangeText={setNamesInput}
                  style={styles.input}
                  placeholderTextColor="#888"
                />
                <Text style={styles.label}>Numero di gruppi:</Text>
                <TextInput
                  placeholder="Es: 3"
                  value={groupCount}
                  onChangeText={setGroupCount}
                  keyboardType="number-pad"
                  style={styles.input}
                  placeholderTextColor="#888"
                />
                <View style={styles.button}>
                  <Button title="Genera Gruppi" color="#8e63c6" onPress={handleGroupShuffle} />
                </View>
                {groupResults.length > 0 && (
                  <View style={{ gap: 20 }}>
                    <Text style={styles.resultTitle}>🔀 Gruppi:</Text>
                    {groupResults.map((group, i) => (
                      <View key={i} style={styles.nicknameCard}>
                        <Text style={styles.nickname}>Gruppo {i + 1}:</Text>
                        {group.map((name, j) => (
                          <Text key={j} style={{ color: '#fff' }}>• {name}</Text>
                        ))}
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
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


import { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, TouchableOpacity
} from 'react-native';

export default function GroupRandomizerAccordion() {
  const [namesInput, setNamesInput] = useState('');
  const [groupCount, setGroupCount] = useState('');
  const [groupResults, setGroupResults] = useState<string[][]>([]);
  const [open, setOpen] = useState(false);

  const handleGroupShuffle = () => {
    const names = namesInput.split(',').map(name => name.trim()).filter(Boolean);
    const count = parseInt(groupCount);
    if (isNaN(count) || count <= 0 || names.length === 0) return;

    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const groups: string[][] = Array.from({ length: count }, () => []);
    shuffled.forEach((name, idx) => {
      groups[idx % count].push(name);
    });
    setGroupResults(groups);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Text style={styles.cardHeader}>
          {open ? '▲' : '▼'} Randomizzazione gruppi 👥
        </Text>
      </TouchableOpacity>
      {open && (
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

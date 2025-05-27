import { Stack } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useDiceStore } from '../../store/dice';
import { rollDice } from '../../utils/rolldice';
import { MotiView, AnimatePresence } from 'moti';
import { TouchableOpacity } from 'react-native';

export default function Dicegame() {
  const { diceCount, setDiceCount } = useDiceStore();
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);

  const handleRoll = () => {
    if (diceCount < 1 || diceCount > 10) {
      Alert.alert('Attenzione', 'Puoi lanciare da 1 a 10 dadi.');
      return;
    }

    setRolling(true);
    Keyboard.dismiss(); // ✅ chiude la tastiera

    setTimeout(() => {
      const values = rollDice(diceCount);
      setResults(values);
      setRolling(false);
    }, 800);
  };

  const total = results.reduce((a, b) => a + b, 0);
  const average = results.length ? (total / results.length).toFixed(2) : '0';

  return (
    <>
      <Stack.Screen options={{ title: 'Dice Game' }} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>🎲 Multi Dice Game 🎲</Text>

          <Text style={styles.label}>Numero di dadi (1–10):</Text>
          <TextInput
            keyboardType="numeric"
            value={diceCount.toString()}
            onChangeText={(text) => {
              const parsed = parseInt(text, 10);
              if (!isNaN(parsed)) setDiceCount(parsed);
            }}
            style={styles.input}
            maxLength={2}
          />


<TouchableOpacity onPress={handleRoll} activeOpacity={0.8} style={styles.rollButton}>
  <Text style={styles.rollButtonText}>Lancia!</Text>
</TouchableOpacity>

          <View style={styles.resultsContainer}>
            <Text style={styles.subtitle}>Risultati:</Text>

            {!rolling && <>
            
            <View style={styles.diceRow}>
              <AnimatePresence>
                {results.map((val, i) => (
                  <MotiView
                    key={i}
                    from={{ scale: 0, opacity: 0, rotate: '0deg' }}
                    animate={{ scale: 1, opacity: 1, rotate: '360deg' }}
                    transition={{ type: 'timing', duration: 400, delay: i * 100 }}
                    style={styles.die}
                  >
                    <Text style={styles.dieText}>🎲 {val}</Text>
                  </MotiView>
                ))}
              </AnimatePresence>

              
            </View>
            
            {results.length > 0 && (
              <View style={styles.stats}>
                <Text style={styles.statText}>🔢 Somma: {total}</Text>
                <Text style={styles.statText}>📊 Media: {average}</Text>
              </View>
            )}
            </>
            }

           

            {rolling && <Text style={styles.rollingText}>🌀 Lancio in corso...</Text>}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#A29ED1',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    color: 'white',
  },
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    width: 120,
    textAlign: 'center',
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 30,
    alignItems: 'center',
    width: '100%',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#fff',
  },
  diceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  die: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    margin: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  dieText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rollingText: {
    marginTop: 16,
    fontSize: 16,
    fontStyle: 'italic',
    color: '#eee',
  },
  stats: {
    marginTop: 20,
  },
  statText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  rollButton: {
    backgroundColor: 'black',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    marginTop: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  
  rollButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
});

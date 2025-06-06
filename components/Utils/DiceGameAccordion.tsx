import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert, Keyboard, TouchableOpacity,
} from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { useDiceStore } from '../../store/dice';
import { rollDice } from '../../utils/rolldice';

export default function DiceGameAccordion() {
  const { diceCount, setDiceCount } = useDiceStore();
  const [diceInput, setDiceInput] = useState(diceCount.toString());
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleRoll = () => {
    if (diceCount < 1 || diceCount > 10) {
      Alert.alert('Attenzione', 'Puoi lanciare da 1 a 10 dadi.');
      return;
    }

    setRolling(true);
    Keyboard.dismiss();

    setTimeout(() => {
      const values = rollDice(diceCount);
      setResults(values);
      setRolling(false);
    }, 800);
  };

  const total = results.reduce((a, b) => a + b, 0);
  const average = results.length ? (total / results.length).toFixed(2) : '0';
  const isButtonDisabled =
    !diceInput || isNaN(parseInt(diceInput)) || parseInt(diceInput) < 1 || parseInt(diceInput) > 10;

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.cardHeader}>
          {isOpen ? '▲' : '▼'} Multi dice game 🎲
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.content}>
          <Text style={styles.label}>Numero di dadi (max 10):</Text>
          <TextInput
            keyboardType="numeric"
            value={diceInput}
            onChangeText={(text) => {
              setDiceInput(text);
              const parsed = parseInt(text, 10);
              if (!isNaN(parsed)) {
                setDiceCount(parsed);
              }
            }}
            style={styles.input}
            maxLength={2}
          />

          <TouchableOpacity
            onPress={handleRoll}
            activeOpacity={0.8}
            style={[styles.rollButton, isButtonDisabled && { opacity: 0.5 }]}
            disabled={isButtonDisabled}
          >
            <Text style={styles.rollButtonText}>Lancia!</Text>
          </TouchableOpacity>

          <View style={styles.resultsContainer}>
            {!rolling && results.length > 0 && (
              <>
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
                <Text style={styles.statText}>🔢 Somma: {total}</Text>
                <Text style={styles.statText}>📊 Media: {average}</Text>
              </>
            )}
            {rolling && <Text style={styles.rollingText}>🌀 Lancio in corso...</Text>}
          </View>
        </View>
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
    padding: 12,
    backgroundColor: '#2d2d44',
    borderRadius: 12,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
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
    width: 100,
    textAlign: 'center',
    fontSize: 16,
  },
  rollButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 999,
    marginBottom: 16,
  },
  rollButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginVertical: 10,
  },
  die: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    margin: 5,
  },
  dieText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statText: {
    fontSize: 16,
    color: 'white',
    marginTop: 8,
  },
  rollingText: {
    marginTop: 16,
    fontSize: 16,
    fontStyle: 'italic',
    color: '#eee',
  },
});

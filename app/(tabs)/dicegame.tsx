import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ScreenContent } from '~/components/ScreenContent';
import { useState } from "react";
import { Text, Button, TextInput } from "react-native";
import { useDiceStore } from "../../store/dice";
import { rollDice } from "../../utils/rolldice";

export default function Dicegame() {
  const { diceCount, setDiceCount } = useDiceStore();
  const [results, setResults] = useState<number[]>([]);
  
  const handleRoll = () => {
    const values = rollDice(diceCount);
    setResults(values);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Dice game' }} />
      {/* <View style={styles.container}>
        <ScreenContent path="app/(tabs)/dicegame.tsx" title="Dice game" />

      </View> */}

      <View className="p-4">
      <Text className="text-xl mb-2">Numero di dadi:</Text>
      <TextInput
        keyboardType="default"
        value={diceCount.toString()}
        onChangeText={(text) => setDiceCount(Number(text))}
        className="border px-2 py-1 mb-4 rounded"
      />

      <Button title="Lancia i dadi!" onPress={handleRoll} />

      <View className="mt-6">
        <Text className="text-lg font-semibold">Risultati:</Text>
        {results.map((val, i) => (
          <Text key={i}>
            🎲 Dado {i + 1}: {val}
          </Text>
        ))}
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});

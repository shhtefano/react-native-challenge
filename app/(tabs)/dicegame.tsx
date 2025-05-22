import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ScreenContent } from '~/components/ScreenContent';
import { Link } from "expo-router";

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Dice game' }} />
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/dicegame.tsx" title="Dice game" />

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

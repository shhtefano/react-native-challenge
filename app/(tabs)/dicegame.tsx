import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ScreenContent } from '~/components/ScreenContent';

export default function Dicegame() {
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

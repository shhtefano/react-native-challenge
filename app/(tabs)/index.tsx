import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ScreenContent } from '~/components/ScreenContent';
import { useEffect, useState } from "react";
import { Text, ScrollView } from "react-native";
import { createEvent, getEvents } from "../../lib/events";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    let events = getEvents();
    events.then((data) => {
      setEvents(data);
      console.log("Fetched events:", data);
      
    }).catch((error) => {
      console.error("Error fetching events:", error);
    });


  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <View style={styles.container}>
        {/* <ScreenContent path="app/(tabs)/index.tsx" title="Events" /> */}
        <Text className="text-2xl font-bold mb-4">Events</Text>
        <ScrollView className="p-4">
          
          {events.map((e) => (
            <Text key={e.id} className="mb-4 text-lg">
              {e.title} - {e.date}
            </Text>
          ))}
        </ScrollView>


      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#A29ED1',
  },
});

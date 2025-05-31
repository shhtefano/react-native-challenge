import { Stack } from 'expo-router';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { getEvents, bookEvent, getActiveBookingsCount } from '../../lib/events';
import EventCarouselAndList from '../../components/Events/EventCarouselAndList';
import { useRouter } from 'expo-router';

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
const router = useRouter();

  useEffect(() => {
    getEvents().then(setEvents).catch(console.error);

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      }
    })();
  }, []);

  const handleBooking = async (event: any) => {
    if (event.booked_count < event.max_guests) {
      await bookEvent(event.id);
      getEvents().then(setEvents);
    } else {
      alert('Posti esauriti');
    }
  };


  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <View style={styles.container}>
  {/* <Text style={styles.title}>Eventi</Text> */}
  <ScrollView>
    <EventCarouselAndList
  events={events}
  userLocation={userLocation}
  onBook={handleBooking}
  onAddPress={() => router.push('/create-event')}

/>

  </ScrollView>
</View>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#2c38b4',
    borderRadius: 16,
    padding: 0,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    color: '#dcdcdc',
    marginTop: 4,
  },
  location: {
    color: '#dcdcdc',
    marginTop: 4,
  },
  distance: {
    color: '#a0a0a0',
    marginTop: 4,
  },
  booked: {
    color: '#f0f0f0',
    marginTop: 8,
    fontWeight: '500',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#7f75ce',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

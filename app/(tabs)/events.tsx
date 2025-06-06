import { Stack } from 'expo-router';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { getEvents, bookEvent, getBookingsByMail, cancelBooking } from '../../lib/events';
import EventCarouselAndList from '../../components/Events/EventCarouselAndList';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useFocusEffect } from '@react-navigation/native';
export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [bookedEvents, setBookedEvents] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const router = useRouter();
  const { user } = useUser();

  useFocusEffect(
    useCallback(() => {
      getEvents().then(setEvents).catch(console.error);

      if (user?.emailAddresses[0]?.emailAddress) {
        getBookingsByMail(user.emailAddresses[0].emailAddress)
          .then(setBookedEvents)
          .catch(console.error);
      }

      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location.coords);
        }
      })();
    }, [user])
  );

  const handleBooking = async (event: any) => {
    if (event.booked_count < event.max_guests) {
      await bookEvent(event.id, user?.emailAddresses[0].emailAddress!!);
      getEvents().then(setEvents);
      getBookingsByMail(user?.emailAddresses[0].emailAddress!!).then(setBookedEvents);
    } else {
      alert('Posti esauriti');
    }
  };

  const handleCancel = async (event: any) => {
    try {
      await cancelBooking(event.id, user?.emailAddresses[0].emailAddress!!);
      getEvents().then(setEvents);
      getBookingsByMail(user?.emailAddresses[0].emailAddress!!).then(setBookedEvents);
    } catch (err) {
      alert("Errore nella disdetta.");
    }
  };


  return (
    <>
      <Stack.Screen options={{
        title: 'Eventi', headerTintColor: '#fff', headerBackVisible: false,
        gestureEnabled: false, headerStyle: { backgroundColor: 'black' },

      }} />
      <View style={styles.container}>
        <ScrollView>





          <EventCarouselAndList
            events={events}
            bookedEvents={bookedEvents}
            userLocation={userLocation}
            onBook={handleBooking}
            onCancel={handleCancel}
            onAddPress={() => router.push('/create-event')}
            isLoggedIn={!!user?.emailAddresses?.[0]?.emailAddress}
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

  reservationsButton: {
    backgroundColor: '#121212',
    padding: 10,
    borderColor: '#e4c7f3',
    borderWidth: 1,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 36,
    fontSize: 10,
    width: '50%',
    alignSelf: 'center',
  }
});

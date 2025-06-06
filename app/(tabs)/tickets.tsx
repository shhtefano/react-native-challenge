import { Stack } from 'expo-router';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useState, useCallback } from 'react';
import { getBookingsByMail } from '~/lib/events';
import { useUser } from '@clerk/clerk-expo';
import TicketCard from '~/components/Events/TicketCard';
import { useFocusEffect } from '@react-navigation/native';

export default function TicketsPage() {
  const [bookedEvents, setBookedEvents] = useState<any[]>([]);
  const { user } = useUser();

  const isPastEvent = (event: any) => new Date(event.date) < new Date();

  const fetchBookings = useCallback(() => {
    if (user?.emailAddresses[0]?.emailAddress) {
      getBookingsByMail(user.emailAddresses[0].emailAddress).then(setBookedEvents);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [fetchBookings])
  );

  const future = bookedEvents.filter((e) => !isPastEvent(e));
  const past = bookedEvents.filter((e) => isPastEvent(e));

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Prenotazioni',
          headerTintColor: '#fff',
          headerBackTitle: 'Indietro',
          headerStyle: { backgroundColor: 'black' },
          headerTitleStyle: { fontFamily: 'PlayRegular', fontSize: 20 },
        }}
      />
      <View style={{ flex: 1, backgroundColor: '#121212' }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
          <Text style={styles.heading}>Eventi a cui sei accreditato</Text>
          {future.length > 0 ? (
            future.map((e) => (
              <TicketCard
                key={`${e.id}`}
                event={e}
                isPast={false}
                onCancelled={fetchBookings}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Nessuna prenotazione attiva.</Text>
          )}

          <Text style={styles.heading}>Eventi a cui hai già partecipato</Text>
          {past.length > 0 ? (
            past.map((e) => (
              <TicketCard
                key={`${e.id}-past`}
                event={e}
                isPast={true}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Nessun evento passato trovato.</Text>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    padding: 16,
    marginBottom: 20,
  },
  heading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 26,
    marginBottom: 16,
  },
  emptyText: {
    color: '#ccc',
    fontStyle: 'italic',
    marginBottom: 16,
  },
});

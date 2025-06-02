import { Stack } from 'expo-router';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { getBookingsByMail } from '~/lib/events';
import { useUser } from '@clerk/clerk-expo';
import TicketCard from '~/components/Events/TicketCard';

export default function TicketsPage() {
  const [bookedEvents, setBookedEvents] = useState<any[]>([]);
  const { user } = useUser();

  const isPastEvent = (event: any) => new Date(event.date) < new Date();

  const fetchBookings = useCallback(() => {
    if (user?.emailAddresses[0]?.emailAddress) {
      getBookingsByMail(user.emailAddresses[0].emailAddress).then(setBookedEvents);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const future = bookedEvents.filter((e) => !isPastEvent(e));
  const past = bookedEvents.filter(isPastEvent);

  return (
    <>
      <Stack.Screen options={{ title: 'I miei biglietti' }} />
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Eventi futuri</Text>
        {future.length > 0 ? (
          future.map((e) => (
            <TicketCard
              key={`future-${e.id}`}
              event={e}
              isPast={false}
              onCancelled={fetchBookings}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Nessuna prenotazione attiva.</Text>
        )}

        <Text style={styles.heading}>Eventi passati</Text>
        {past.length > 0 ? (
          past.map((e) => (
            <TicketCard
              key={`past-${e.id}`}
              event={e}
              isPast={true}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Nessun evento passato.</Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    padding: 16,
  },
  heading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: '#ccc',
    fontStyle: 'italic',
    marginBottom: 16,
  },
});

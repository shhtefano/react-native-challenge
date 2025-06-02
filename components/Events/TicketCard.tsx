import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { cancelBooking } from '~/lib/events';

type TicketCardProps = {
  event: {
    id: string;
    title: string;
    location: string;
    date: string;
    latitude: number;
    longitude: number;
    max_guests: number;
    booked_count: number;
  };
  isPast: boolean;
  onCancelled?: () => void; // facoltativo: callback per aggiornare la lista
};

export default function TicketCard({ event, isPast, onCancelled }: TicketCardProps) {
  const { user } = useUser();

  const handleCancel = async () => {
    if (!user?.emailAddresses[0]?.emailAddress) {
      Alert.alert('Errore', 'Utente non autenticato');
      return;
    }

    try {
      await cancelBooking(event.id, user.emailAddresses[0].emailAddress);
      Alert.alert('Disdetta avvenuta', 'Hai disdetto con successo.');
      onCancelled?.(); // se definita, aggiorna la lista
    } catch (err) {
      Alert.alert('Errore', 'Si è verificato un errore nella disdetta.');
    }
  };

  return (
    <View style={[styles.card, isPast && styles.pastCard]}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.location}>{event.location}</Text>
      <Text style={styles.date}>
        {new Date(event.date).toLocaleString()}
        {isPast && <Text style={styles.pastLabel}> (Evento passato)</Text>}
      </Text>

      {!isPast && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Disdici prenotazione</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2c38b4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  pastCard: {
    backgroundColor: '#444',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    marginTop: 4,
    color: '#dcdcdc',
  },
  location: {
    color: '#dcdcdc',
    marginTop: 4,
  },
  pastLabel: {
    marginTop: 8,
    color: '#ff8080',
    fontStyle: 'italic',
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: '#cf5e5e',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

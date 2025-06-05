import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { cancelBooking } from '~/lib/events';
import QRCode from 'react-native-qrcode-svg';
import * as Location from 'expo-location';

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
  onCancelled?: () => void;
};

export default function TicketCard({ event, isPast, onCancelled }: TicketCardProps) {
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const dist = getDistanceFromLatLonInKm(
          location.coords.latitude,
          location.coords.longitude,
          event.latitude,
          event.longitude
        );
        setDistance(dist);
      }
    })();
  }, []);

  const handleCancel = async () => {
    if (!user?.emailAddresses[0]?.emailAddress) {
      Alert.alert('Errore', 'Utente non autenticato');
      return;
    }

    try {
      await cancelBooking(event.id, user.emailAddresses[0].emailAddress);
      Alert.alert('Disdetta avvenuta', 'Hai disdetto con successo.');
      onCancelled?.();
    } catch (err) {
      Alert.alert('Errore', 'Si è verificato un errore nella disdetta.');
    }
  };

  const getDistanceFromLatLonInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  return (
    <View style={[styles.card, isPast && styles.pastCard]}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>
        Data: {new Date(event.date).toLocaleDateString('it-IT', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}{isPast && <Text style={styles.pastLabel}> (Evento passato)</Text>}
      </Text>
      <Text style={styles.location}>Location: {event.location}</Text>

      <Text style={styles.details}>
        Prenotati: {event.booked_count} / {event.max_guests}
      </Text>
      {distance !== null && (
        <Text style={styles.details}>Distanza: {distance} km</Text>
      )}

      {!isPast && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 12 }}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Disdici prenotazione</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qrButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.showQr}>Mostra QR</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal QR */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Text style={[styles.qrTitle, { marginTop: 12 }]}>
              {event.title}
            </Text>
            <View style={{ borderRadius: 12, padding: 12, backgroundColor: '#fff' }}>

              <QRCode
                value={user?.emailAddresses[0]?.emailAddress + '_' + event.id}
                size={220}

              />
            </View>


          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    marginTop: 4,
    color: '#dcdcdc',
    fontSize: 18,

  },
  location: {
    color: '#dcdcdc',
    marginTop: 4,
    fontSize: 18,

  },
  pastCard: {
    backgroundColor: '#444',
  },
  pastLabel: {
    color: '#ff8080',
    fontStyle: 'italic',
  },
  cancelButton: {
    backgroundColor: '#cf5e5e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  qrButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  showQr: {
    color: '#fff',
    fontWeight: 'bold',
  },
  details: {
    marginTop: 4,
    color: '#fff',
    fontSize: 16,
  },
  qrTitle: {
    marginTop: 4,
    color: '#fff',
    fontSize: 20,
    marginBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2c38b4',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: 300,
    paddingBottom: 50,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

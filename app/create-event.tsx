import { Stack, useRouter } from 'expo-router';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';
import { useState } from 'react';
import { supabase } from '~/lib/supabase';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateEvent() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [maxGuests, setMaxGuests] = useState('');
    const [date, setDate] = useState('');
const [showDatePicker, setShowDatePicker] = useState(false);
const [dateObj, setDateObj] = useState<Date | null>(null);
    const params = useLocalSearchParams();

    useEffect(() => {
        if (params.latitude && params.longitude) {
            setLatitude(params.latitude as string);
            setLongitude(params.longitude as string);
        }
    }, [params]);

    const handleCreate = async () => {
        if (!title || !location || !latitude || !longitude || !maxGuests || !date) {
            Alert.alert('Errore', 'Compila tutti i campi.');
            return;
        }

        const {
            data: { session },
        } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
            Alert.alert('Errore', 'Utente non autenticato.');
            return;
        }

        const { error } = await supabase.from('events').insert([
            {
                title,
                location,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                max_guests: parseInt(maxGuests),
                date: new Date(date).toISOString(),
                owner_id: userId,
                booked_count: 0
            }
        ]);

        if (error) {
            console.error(error);
            Alert.alert('Errore', 'Creazione evento fallita.');
        } else {
            Alert.alert('Successo', 'Evento creato!');
            router.back();
        }
    };

    return (
        <>
            <Stack.Screen options={{ title: 'Crea Evento' }} />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Nuovo Evento</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Titolo"
                    placeholderTextColor="#aaa"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Luogo"
                    placeholderTextColor="#aaa"
                    value={location}
                    onChangeText={setLocation}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Latitudine"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    value={latitude}
                    onChangeText={setLatitude}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Longitudine"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    value={longitude}
                    onChangeText={setLongitude}
                />

                <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => router.push('./select-location')}
                >
                    <Text style={styles.mapButtonText}>📍 Seleziona da mappa</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Max ospiti"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    value={maxGuests}
                    onChangeText={setMaxGuests}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Data e ora (es. 2025-06-01T14:00)"
                    placeholderTextColor="#aaa"
                    value={date}
                    onChangeText={setDate}
                />
                

<TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.mapButton}>
  <Text style={styles.mapButtonText}>
    {dateObj ? dateObj.toLocaleString() : '📅 Scegli data e ora'}
  </Text>
</TouchableOpacity>

{showDatePicker && (
  <DateTimePicker
    mode="datetime"
    value={dateObj || new Date()}
    onChange={(event, selectedDate) => {
      setShowDatePicker(false);
      if (selectedDate) {
        setDateObj(selectedDate);
        setDate(selectedDate.toISOString());
      }
    }}
  />
)}

                <TouchableOpacity style={styles.button} onPress={handleCreate}>
                    <Text style={styles.buttonText}>Crea Evento</Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        backgroundColor: '#121212',
    },
    mapButton: {
        backgroundColor: '#2c38b4',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    mapButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#1e1e1e',
        color: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#7f75ce',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

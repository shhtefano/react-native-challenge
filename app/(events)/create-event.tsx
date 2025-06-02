import { Stack, useRouter } from 'expo-router';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '~/lib/supabase';
import SelectLocation from '../../components/Events/SelectLocation';
import { useUser } from '@clerk/clerk-expo';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
export default function CreateEvent() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [maxGuests, setMaxGuests] = useState('');
    const [date, setDate] = useState('');
    const [dateObj, setDateObj] = useState<Date | null>(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const { user } = useUser();


    const handleCreate = async () => {
        if (!title || !location || !latitude || !longitude || !maxGuests || !selectedDate) {
            Alert.alert('Errore', 'Compila tutti i campi.');
            return;
        }
        const { error } = await supabase.from('events').insert([
            {
                title,
                location,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                max_guests: parseInt(maxGuests),
                date: selectedDate?.toISOString(),
                owner: user?.emailAddresses[0].emailAddress!!,
                booked_count: 0,
            },
        ]);

        if (error) {
            console.error(error);
            Alert.alert('Errore', 'Creazione evento fallita.');
        } else {
            Alert.alert('Successo', 'Evento creato!');
            router.replace('/(tabs)/events');
        }


    };
    const handleConfirmDate = (date: Date) => {
        setSelectedDate(date);
        setDatePickerVisibility(false);
    };

    return (
        <>
            <Stack.Screen options={{ title: '' }} />
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <ScrollView style={styles.scrollContainer}
                    contentContainerStyle={styles.container}>
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
                        placeholder="Max ospiti"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                        value={maxGuests}
                        onChangeText={setMaxGuests}
                    />


                    <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.mapButton}>
                        <Text style={styles.mapButtonText}>
                            {selectedDate ? '📅 ' + selectedDate.toLocaleString() : '📅 Scegli data e ora'}
                        </Text>
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="datetime"
                        onConfirm={handleConfirmDate}
                        onCancel={() => setDatePickerVisibility(false)}
                        themeVariant="light" // <- forza tema scuro
                    />


                    {Platform.OS !== 'web' && (
                        <SelectLocation
                            onConfirm={(coords) => {
                                setLatitude(coords.latitude.toString());
                                setLongitude(coords.longitude.toString());
                            }}
                        />
                    )}
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Latitudine"
                            placeholderTextColor="#aaa"
                            keyboardType="numeric"
                            value={latitude}
                            onChangeText={setLatitude}
                        />
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Longitudine"
                            placeholderTextColor="#aaa"
                            keyboardType="numeric"
                            value={longitude}
                            onChangeText={setLongitude}
                        />
                    </View>
                    {/* <TextInput
                        style={styles.input}
                        placeholder="Data e ora (ISO)"
                        placeholderTextColor="#aaa"
                        value={date}
                        onChangeText={setDate}
                        editable={false}
                    /> */}

                    <TouchableOpacity style={styles.button} onPress={handleCreate}>
                        <Text style={styles.buttonText}>Crea Evento</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}



const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        backgroundColor: '#121212',
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#121212', // o '#121221' se preferisci
    },
    mapButton: {
        backgroundColor: '#000',
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
        backgroundColor: '#2c38b4',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 40,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12, // opzionale per spazio tra gli input
    },

    halfInput: {
        flex: 1,
    },

});
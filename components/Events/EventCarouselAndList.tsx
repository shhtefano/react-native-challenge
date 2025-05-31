import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Event = {
    id: string;
    title: string;
    location: string;
    date: string;
    latitude: number;
    longitude: number;
    max_guests: number;
    booked_count: number;
};

type Props = {
    events: Event[];
    userLocation: { latitude: number; longitude: number } | null;
    onBook: (event: Event) => void;
    onAddPress: () => void;
};

export default function EventCarouselAndList({
    events,
    userLocation,
    onBook,
    onAddPress
}: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEvents = events.filter((e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
        return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
    };

    const renderEventCard = (e: Event, index: number, fullWidth = false) => (
        <View
            key={e.id}
            style={[
                styles.card,
                fullWidth ? styles.cardFull : styles.cardCarousel
            ]}
        >
            <Text style={styles.eventTitle}>{e.title}</Text>
            <Text style={styles.date}>{new Date(e.date).toLocaleString()}</Text>
            <Text style={styles.location}>{e.location}</Text>
            {userLocation && (
                <Text style={styles.distance}>
                    Distanza:{' '}
                    {calcDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        e.latitude,
                        e.longitude
                    )}{' '}
                    km
                </Text>
            )}
            <Text style={styles.booked}>
                {e.booked_count} / {e.max_guests} posti prenotati
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => onBook(e)}
                disabled={e.booked_count >= e.max_guests}
            >
                <Text style={styles.buttonText}>
                    {e.booked_count >= e.max_guests ? 'Completo' : 'Prenota'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View>
            {/* Header con bottone + */}
            <View style={styles.headerRow}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cerca evento per nome..."
                    placeholderTextColor="#aaa"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
                    <Ionicons name="add-circle-outline" size={32} color="#fff" />
                </TouchableOpacity>
            </View>


            <Text style={styles.subsectionTitle}>In evidenza</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                {events.slice(0, 5).map((e, idx) => renderEventCard(e, idx, false))}
            </ScrollView>

            <Text style={styles.subsectionTitle}>Tutti gli eventi</Text>
            {filteredEvents.map((e, idx) => renderEventCard(e, idx, true))}
        </View>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },

    searchInput: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        color: '#fff',
        padding: 10,
        borderRadius: 10,
    },

    addButton: {
        padding: 4,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    subsectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#2c38b4',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    cardCarousel: {
        marginRight: 12,
        width: 280,
    },
    cardFull: {
        width: '100%',
    },
    eventTitle: {
        fontSize: 18,
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

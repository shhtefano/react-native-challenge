import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { Region } from 'react-native-maps';
import { Platform } from 'react-native';


export default function SelectLocation() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [selected, setSelected] = useState<{ latitude: number; longitude: number } | null>(null);
    const [region, setRegion] = useState<Region | null>(null);


    if (Platform.OS === 'web') {
  return (
    <View style={styles.container}>
      <Text style={{ color: '#fff', padding: 20 }}>
        La mappa non è disponibile nella versione web.
      </Text>
    </View>
  );
}

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permesso negato');
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        })();
    }, []);

    const handleConfirm = () => {
        if (!selected) return;
        router.push({
            pathname: '/create-event',
            params: {
                latitude: selected.latitude.toString(),
                longitude: selected.longitude.toString(),
            }
        });
    };

    const handleMapPress = (event: MapPressEvent) => {
        setSelected(event.nativeEvent.coordinate);
    };

    return (
        <View style={styles.container}>
            {region && (
                <MapView
                    style={StyleSheet.absoluteFill}
                    initialRegion={region}
                    onPress={handleMapPress}
                >
                    {selected && <Marker coordinate={selected} />}
                </MapView>
            )}
            <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Conferma posizione</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    button: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: '#7f75ce',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

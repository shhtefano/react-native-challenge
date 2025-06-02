import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { Region } from 'react-native-maps';

type Props = {
  onConfirm: (coords: { latitude: number; longitude: number }) => void;
};

export default function SelectLocation({ onConfirm }: Props) {
  const [selected, setSelected] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permesso negato alla posizione');
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

  const handleMapPress = (event: MapPressEvent) => {
    setSelected(event.nativeEvent.coordinate);
  };

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff', padding: 20 }}>
          La mappa non è disponibile nella versione web.
        </Text>
      </View>
    );
  }

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
  container: { flex: 1, height: 300, borderRadius: 10, overflow: 'hidden', marginBottom: 16 },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#7f75ce',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

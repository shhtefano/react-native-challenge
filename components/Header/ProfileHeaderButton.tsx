import { useUser } from '@clerk/clerk-expo';
import { Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export function ProfileHeaderButton() {
  const { user } = useUser();

  return (
    <TouchableOpacity
      onPress={() => router.push('/(home)/profile')}
      style={{ marginRight: 10 }}
      accessibilityLabel={user ? "Vai al profilo" : "Accedi con Google"}
    >
      {user?.imageUrl ? (
        <Image
          source={{ uri: user.imageUrl }}
          style={{ width: 32, height: 32, borderRadius: 16 }}
        />
      ) : (
        <Ionicons name="person-circle-outline" size={32} color="#fff" />
      )}
    </TouchableOpacity>
  );
}

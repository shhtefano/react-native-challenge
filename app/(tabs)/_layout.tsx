import { Link, Tabs } from 'expo-router';
import { HeaderButton } from '../../components/Header/HeaderButton';
import { TabBarIcon } from '../../components/Header/TabBarIcon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFonts } from 'expo-font';
import { Image, Touchable, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';
import { ProfileHeaderButton } from '../../components/Header/ProfileHeaderButton';
export default function TabLayout() {
  const [fontsLoaded] = useFonts({ PlayRegular: require('../../assets/fonts/Play-Regular.ttf') });
  if (!fontsLoaded) return null;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#121212', borderBottomColor: '#121212' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontFamily: 'PlayRegular', fontSize: 20 },
        headerTitleAlign: 'center',
        tabBarStyle: { backgroundColor: '#000', borderTopColor: '#121212' },
        tabBarActiveTintColor: '#A29ED1',
        tabBarInactiveTintColor: 'white',
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.push('/')} style={{ marginLeft: 10 }}>
            <Image
              source={require('../../assets/jetop_logo.png')}
              style={{ width: 60, height: 60, marginLeft: 4, marginBottom: 2 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ),
        headerRight: () => <ProfileHeaderButton />, // <--- SOLUZIONE UNIFICATA!
      }}
    >
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <MaterialIcons name="event" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Prenotazioni',
          tabBarIcon: ({ color }) => <TabBarIcon name="ticket" color={color} />,
        }}
      />
      <Tabs.Screen
        name="utils"
        options={{
          title: 'Utils',
          tabBarIcon: ({ color }) => <TabBarIcon name="quote-left" color={color} />,
        }}
      />
    </Tabs>
  );
}

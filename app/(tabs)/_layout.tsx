import { Link, Tabs } from 'expo-router';
import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font';

export default function TabLayout() {

  const [fontsLoaded] = useFonts({
    PlayRegular: require('../../assets/fonts/Play-Regular.ttf')
  });


  if (!fontsLoaded) {
    return null;
  }


  return (
    <Tabs
      screenOptions={{
        headerTitleStyle: { fontFamily: 'PlayRegular' },
        headerStyle: {
          backgroundColor: '#7463B4',
          borderBottomColor: '#7463B4',
        },
        headerTintColor: '#fff', // testo/icona bianca
        tabBarStyle: {
          backgroundColor: '#000', // tab bar nera
        },
        tabBarActiveTintColor: '#A29ED1', // tab selezionata bianca
        tabBarInactiveTintColor: 'white', // tab non selezionata grigia
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <TabBarIcon name="ticket" color={color} />,
          headerRight: () => (
            <Link href="/profile" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="dicegame"
        options={{
          title: 'Dicegame',
          tabBarIcon: ({ color }) =>  <MaterialCommunityIcons name="dice-5-outline" size={25} color={color}/>,
          headerRight: () => (
            <Link href="/profile" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="nickname"
        options={{
          title: 'Nickname Generator',
          tabBarIcon: ({ color }) => <TabBarIcon name="quote-left" color={color} />,
          headerRight: () => (
            <Link href="/profile" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}

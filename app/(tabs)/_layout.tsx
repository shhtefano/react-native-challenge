import { Link, Tabs } from 'expo-router';
import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font';
import { Image } from 'react-native';

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
    headerStyle: {
      backgroundColor: '#121212',
      borderBottomColor: '#121212',
    },
    headerTintColor: '#fff',
    headerTitleStyle: { 
      fontFamily: 'PlayRegular',
      fontSize: 20,
    },
    headerTitleAlign: 'center', // Titolo centrato
    tabBarStyle: {
      backgroundColor: '#000',
    },
    tabBarActiveTintColor: '#A29ED1',
    tabBarInactiveTintColor: 'white',

    headerLeft: () => (
      <Image
        source={require('../../assets/jetop_logo.png')}
        style={{ width: 60, height: 60, marginLeft: 4, marginBottom: 2 }}
        resizeMode="contain"
      />
    ),
    headerRight: () => (
      <Link href="/profile" asChild>
        <HeaderButton />
      </Link>
    ),
  }}
>
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

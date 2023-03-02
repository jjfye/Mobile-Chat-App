import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Chats from './screens/chats';
import Profile from './screens/profile'
import Contact from './screens/contact'
import BlockedContacts from './screens/blockedContacts'
import Login from './components/login'



const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  function handleLogin() {
    setIsLoggedIn(true);
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen name="Chats" component={Chats} />
          <Tab.Screen name="Contacts" component={Contact} />
          <Tab.Screen name="Profile" component={Profile} />
          <Tab.Screen name="Blocked" component={BlockedContacts} />
        </Tab.Navigator>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}

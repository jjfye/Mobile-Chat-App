import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Chats from './screens/chats';
import Profile from './screens/profile'
import Contact from './screens/contact'
import BlockedContacts from './screens/blockedContacts'
import Login from './components/login'
import SignUp from './components/signup';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [token, setToken] = React.useState(null);

  function handleLogin(token) {
    setIsLoggedIn(true);
    setToken(token);
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen name="Chats" component={Chats} options={{ headerShown: false }} />
          <Tab.Screen name="Contacts" options={{ headerShown: false }}>
            {() => <Contact token={token} />}
          </Tab.Screen>
          <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
          {/* <Tab.Screen name="Blocked" component={BlockedContacts} options={{ headerShown: false }} /> */}
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login">
            {(props) => <Login {...props} onLogin={handleLogin} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
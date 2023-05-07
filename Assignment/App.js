  import * as React from 'react';
  import { NavigationContainer } from '@react-navigation/native';
  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  import { Ionicons } from '@expo/vector-icons';
  import Chats from './screens/chats';
  import Profile from './screens/profile'
  import Users from './screens/users'
  import Contact from './screens/contact'
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
    
    function MainTabs() {
      return (
        <Tab.Navigator>
          <Tab.Screen name="Chats" options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubbles-outline" size={size} color={color} />
            ),
          }}>
            {() => <Chats token={token} />}
          </Tab.Screen>
          <Tab.Screen name="Contacts" options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        >
            {() => <Contact token={token} />}
          </Tab.Screen>
          <Tab.Screen name="Users" options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        >
            {(props) => <Users {...props} token={token} />}
          </Tab.Screen>
          <Tab.Screen name="Profile" options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" size={size} color={color} />
            ),
          }}
        >
            {(props) => <Profile {...props} token={token} />}
          </Tab.Screen>
        </Tab.Navigator>
      );
    }

    return (
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          ) : (
            <>
              <Stack.Screen name="Login">
                {(props) => <Login {...props} onLogin={handleLogin} />}
              </Stack.Screen>
              <Stack.Screen name="SignUp" component={SignUp} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>

    );
  }
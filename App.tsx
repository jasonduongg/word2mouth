import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ScrollerScreen from './components/Screens/Scroller/Scroller.tsx';
import RecordScreen from './components/Screens/Recorder/Recorder.tsx';
import SearchScreen from './components/Screens/Search/Search.tsx';
import ProfileScreen from './components/Screens/Profile/Profile.tsx';
import SignInScreen from './components/Screens/SignIn/SignIn.tsx'; // Assuming SignInScreen handles authentication

import NavigationBar from './components/NavigationBar/NavigationBar.tsx';

const Stack = createNativeStackNavigator();

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (isAuthenticated) => {
    setLoggedIn(isAuthenticated);
  };

  return (
    <NavigationContainer>
      <View style={styles.appContainer}>
        <View style={styles.container}>
          {loggedIn ? (
            <View style={styles.container}>
              <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" options={{ headerShown: false, animation: "none" }} component={ScrollerScreen} />
                <Stack.Screen name="Search" options={{ headerShown: false, animation: "none" }} component={SearchScreen} />
                <Stack.Screen name="Record" options={{ headerShown: false, animation: "none" }} component={RecordScreen} />
                <Stack.Screen name="Profile" options={{ headerShown: false, animation: "none" }}>
                  {props => <ProfileScreen {...props} onLogin={handleLogin} />}
                </Stack.Screen>
              </Stack.Navigator>
              <NavigationBar />
            </View>
          ) : (
            <SignInScreen onLogin={handleLogin} />
          )}
        </View>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  container: {
    height: '100%',
  },
});

export default App;

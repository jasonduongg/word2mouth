import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

import ScrollerScreen from './components/Screens/Scroller/Scroller.tsx';
import RecordScreen from './components/Screens/Recorder/Recorder.tsx';
import SearchScreen from './components/Screens/Search/Search.tsx';
import ProfileScreen from './components/Screens/Profile/Profile.tsx';

import NavigationBar from './components/NavigationBar/NavigationBar.tsx';

enableScreens();

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <View style={styles.appContainer}>
        <View style={styles.container}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" options={{ headerShown: false, animation: "none" }} component={ScrollerScreen} />
            <Stack.Screen name="Search" options={{ headerShown: false, animation: "none" }} component={SearchScreen} />
            <Stack.Screen name="Record" options={{ headerShown: false, animation: "none" }} component={RecordScreen} />
            <Stack.Screen name="Profile" options={{ headerShown: false, animation: "none" }} component={ProfileScreen} />
          </Stack.Navigator>
        </View>
        <NavigationBar />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  container: {
    height: '92%',
  },
});

export default App;

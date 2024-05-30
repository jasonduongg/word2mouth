import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScrollerScreen from './components/Screens/Scroller/Scroller.tsx';
import RecordScreen from './components/Screens/Recorder/Recorder.tsx';
import SearchScreen from './components/Screens/Search/Search.tsx';
import ProfileScreen from './components/Screens/Profile/Profile.tsx';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={ScrollerScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Record" component={RecordScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

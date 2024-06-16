// App.js

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ScrollerScreen from './components/Screens/Scroller/Scroller.tsx';
import RecordScreen from './components/Screens/Recorder/Recorder.tsx';
import SearchScreen from './components/Screens/Search/Search.tsx';
import ProfileScreen from './components/Screens/Profile/Profile.tsx';
import SignInScreen from './components/Screens/SignIn/SignIn.tsx'; // Assuming SignInScreen handles authentication
import EnterPhoneNumberScreen from './components/PhoneLoginFlow/EnterPhoneNumber.tsx'; // Phone number verification screen
import EnterVerificationCodeScreen from './components/PhoneLoginFlow/EnterVerificationCode.tsx'; // Verification code screen

import NavigationBar from './components/NavigationBar/NavigationBar.tsx';
import { firestore } from './components/config.jsx'; // Adjust the path as needed
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Stack = createNativeStackNavigator();

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  const handleLogin = async (isAuthenticated, uid = null) => {
    setLoggedIn(isAuthenticated);
    setUserId(uid);
    if (uid) {
      const data = await handleUserData(uid);
      setUserData(data);
    }
  };

  const handleUserData = async (uid) => {
    const userDocRef = doc(firestore, 'usersData', uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      const newUserdata = {
        createdAt: new Date(),
        username: "iamsaerom",
        followers: 0,
        following: 10
        // Add other default user data here
      };
      await setDoc(userDocRef, newUserdata);
      return newUserdata;
    }
    return userSnapshot.data();
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
                  {props => <ProfileScreen {...props} userId={userId} userData={userData} onLogin={handleLogin} />}
                </Stack.Screen>
              </Stack.Navigator>
              <NavigationBar />
            </View>
          ) : (
            <Stack.Navigator initialRouteName="SignIn">
              <Stack.Screen name="SignIn" options={{ headerShown: false }}>
                {props => <SignInScreen {...props} onLogin={handleLogin} />}
              </Stack.Screen>
              <Stack.Screen name="EnterPhoneNumber" component={EnterPhoneNumberScreen} options={{ headerShown: false }} />
              <Stack.Screen name="EnterVerificationCode" options={{ headerShown: false }}>
                {props => <EnterVerificationCodeScreen {...props} onLogin={handleLogin} />}
              </Stack.Screen>
            </Stack.Navigator>
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
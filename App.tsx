import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ScrollerScreen from './components/Screens/Scroller/Scroller';
import RecordScreen from './components/Screens/Recorder/Recorder';
import SearchScreen from './components/Screens/Search/Search';
import ProfileScreen from './components/Screens/Profile/Profile';
import OtherProfile from './components/OtherProfile/OtherProfile';
import MapScreen from './components/Screens/Map/Map'
import SignInScreen from './components/Screens/SignIn/SignIn'; // Assuming SignInScreen handles authentication
import EnterPhoneNumberScreen from './components/PhoneLoginFlow/EnterPhoneNumber'; // Phone number verification screen
import EnterVerificationCodeScreen from './components/PhoneLoginFlow/EnterVerificationCode'; // Verification code screen
import SetupProfileScreen from './components/PhoneLoginFlow/SetupProfile'; // Profile setup screen

import NavigationBar from './components/NavigationBar/NavigationBar';
import { firestore } from './components/config'; // Adjust the path as needed
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Stack = createNativeStackNavigator();

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [profileSetupRequired, setProfileSetupRequired] = useState(false);

  const handleLogin = async (isAuthenticated, uid = null) => {
    setLoggedIn(isAuthenticated);
    setUserId(uid);
    if (uid) {
      const data = await handleUserData(uid);
      setUserData(data);
      if (!data.profileSetupComplete) {
        setProfileSetupRequired(true);
      }
    }
  };

  const handleUserData = async (uid) => {
    const userDocRef = doc(firestore, 'usersData', uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      setProfileSetupRequired(true);
      return { profileSetupComplete: false }; // Return a flag indicating setup is needed
    }
    return userSnapshot.data();
  };

  const handleProfileSetupComplete = (newUserData) => {
    setUserData(newUserData);
    setProfileSetupRequired(false);
  };

  return (
    <NavigationContainer>
      <View style={styles.appContainer}>
        <View style={styles.container}>
          {loggedIn ? (
            <View style={styles.container}>
              {profileSetupRequired ? (
                <Stack.Navigator initialRouteName="SetupProfile">
                  <Stack.Screen name="SetupProfile" options={{ headerShown: false }}>
                    {props => <SetupProfileScreen {...props} userId={userId} onProfileSetupComplete={handleProfileSetupComplete} />}
                  </Stack.Screen>
                </Stack.Navigator>
              ) : (
                <Stack.Navigator initialRouteName="Home">
                  <Stack.Screen name="Home" options={{ headerShown: false, animation: "none" }} component={ScrollerScreen} />
                  <Stack.Screen name="Search" options={{ headerShown: false, animation: "none" }} component={SearchScreen} />

                  {/* MapScreen */}
                  <Stack.Screen name="Map" options={{ headerShown: false, animation: "none" }} component={MapScreen} />


                  <Stack.Screen name="OtherProfile" options={{ headerShown: false, animation: "none" }} component={OtherProfile} />
                  <Stack.Screen name="Record" options={{ headerShown: false, animation: "none" }}>
                    {props => <RecordScreen {...props} userId={userId} />}
                  </Stack.Screen>
                  <Stack.Screen name="Profile" options={{ headerShown: false, animation: "none" }}>
                    {props => <ProfileScreen {...props} userId={userId} userData={userData} onLogin={handleLogin} />}
                  </Stack.Screen>
                </Stack.Navigator>
              )}
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

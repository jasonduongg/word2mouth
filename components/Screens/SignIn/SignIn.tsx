// SignInScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import EnterPhoneNumberScreen from '../../PhoneLoginFlow/EnterPhoneNumber.tsx'; // Import the new screen component

const SignInScreen = ({ onLogin }) => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [code, setCode] = useState('');
  const [userId, setUserId] = useState(null);

  GoogleSignin.configure({
    webClientId: '234312128612-uu30i0b2hr1gnlq9v5of4ksvh3e51vfj.apps.googleusercontent.com', // Replace with your web client ID
  });

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      await auth().signInWithCredential(googleCredential);
      setUserId(userInfo.user.id);
      onLogin(true); // Notify parent component of successful login
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.log('Google sign-in error:', error);
      }
    }
  };

  const navigateToPhoneNumberInput = () => {
    navigation.navigate('EnterPhoneNumber', {
      onSendVerificationCode: sendVerificationCode
    });
  };

  const sendVerificationCode = async (phoneNumber) => {
    try {
      const confirmationResult = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmation(confirmationResult);
      setPhoneNumber(phoneNumber);
      Alert.alert('Verification code sent to ' + phoneNumber);
    } catch (error) {
      console.log('Error sending verification code:', error);
      Alert.alert('Error sending verification code. Please try again.');
    }
  };

  const confirmCode = async () => {
    try {
      await confirmation.confirm(code);
      setUserId(auth().currentUser.uid);
      onLogin(true); // Notify parent component of successful login
    } catch (error) {
      console.log('Invalid code:', error);
      Alert.alert('Invalid code. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login to W2M</Text>
      {!confirmation ? (
        <View>
          <TouchableOpacity onPress={navigateToPhoneNumberInput}>
            <View style={styles.button}>
              <Text>Login with Phone Number</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={googleLogin}>
            <View style={styles.button}>
              <Text>Login with Google</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter verification code"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
          />
          <Button
            title="Verify Code"
            onPress={confirmCode}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default SignInScreen;

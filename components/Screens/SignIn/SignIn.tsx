import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

const SignInScreen = ({ onLogin }) => {
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

  const signInWithPhoneNumber = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmation(confirmation);
      Alert.alert('Verification code sent to your phone.');
    } catch (error) {
      console.error('Error sending code:', error);
      Alert.alert('Error', 'Failed to send verification code.');
    }
  };

  const confirmCode = async () => {
    try {
      await confirmation.confirm(code);
      Alert.alert('Success', 'You have been successfully authenticated.');
      const user = auth().currentUser;
      if (user) {
        setUserId(user.uid);
        onLogin(true); // Notify parent component of successful login
      }
    } catch (error) {
      console.error('Invalid code.', error);
      Alert.alert('Error', 'Invalid verification code.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sign In Page</Text>
      {!confirmation ? (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <Button
            title="Send Verification Code"
            onPress={signInWithPhoneNumber}
          />
          <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={googleLogin}
          />
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

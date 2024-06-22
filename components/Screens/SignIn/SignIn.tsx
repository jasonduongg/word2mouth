import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

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
      const userCredential = await auth().signInWithCredential(googleCredential);
      console.log(userCredential.user.uid)
      setUserId(userCredential.user.uid);
      onLogin(true, userCredential.user.uid); // Notify parent component of successful login
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
      navigation.navigate('EnterVerificationCode', {
        confirmation: confirmationResult
      });
    } catch (error) {
      console.log('Error sending verification code:', error);
      Alert.alert('Error sending verification code. Please try again.');
    }
  };

  const confirmCode = async () => {
    try {
      const userCredential = await confirmation.confirm(code);
      setUserId(userCredential.user.uid);
      onLogin(true, userCredential.user.uid); // Notify parent component of successful login
    } catch (error) {
      console.log('Invalid code:', error);
      Alert.alert('Invalid code. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../../../assets/videos/login.mp4')} // Ensure the path is correct
        style = {styles.video}
        repeat={true}
        resizeMode="cover"
        muted={true}
      />
      <View style={styles.overlay}>
        {!confirmation ? (
          <View style={styles.uiContainer}>
            <Text style={styles.text}>Login to W2M</Text>
            <TouchableOpacity onPress={(() => {})}>
              <View style={styles.button}>
                <Text>Email (Coming Soon)</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToPhoneNumberInput}>
              <View style={styles.button}>
                <Text>Phone Number</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={googleLogin}>
              <View style={styles.button}>
                <Text>Google</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    height: height,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  uiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'semibold',
    color: '#fff',
    marginBottom: 5,
  },
  button: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    width: width * 0.5,
    height: 35,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent button background
    justifyContent: 'center',
    alignItems: 'center',
  },
  ptext: {
    color: "white"
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});

export default SignInScreen;

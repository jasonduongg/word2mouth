// EnterPhoneNumberScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const EnterPhoneNumberScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const signInWithPhoneNumber = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      navigation.navigate('EnterVerificationCode', { confirmation });
    } catch (error) {
      console.error('Error sending code:', error);
      Alert.alert('Error', 'Failed to send verification code.');
    }
  };

  return (
    <View style={styles.container}>
        <Text style={styles.text}>Enter Your Phone Number</Text>
        <Button
            title="Back"
            onPress={() => navigation.goBack()}
        />
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

export default EnterPhoneNumberScreen;

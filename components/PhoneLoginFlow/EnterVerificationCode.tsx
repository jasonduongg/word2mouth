// EnterVerificationCodeScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const EnterVerificationCodeScreen = ({ onLogin }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [code, setCode] = useState('');

  const confirmCode = async () => {
    try {
      const { confirmation } = route.params;
      await confirmation.confirm(code);
      onLogin(true); // Notify parent component of successful login
    } catch (error) {
      console.log('Invalid code:', error);
      Alert.alert('Invalid code. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Enter the verification code</Text>
      <TextInput
        style={styles.input}
        placeholder="Verification code"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />
      <Button title="Verify Code" onPress={confirmCode} />
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

export default EnterVerificationCodeScreen;

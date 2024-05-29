import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, View, Text, Alert } from 'react-native';
import { getDatabase, ref, set } from 'firebase/database';
import { db } from './components/config'; // Ensure this import points correctly to your Firebase config

const App = () => {
  const [lobbyName, setLobbyName] = useState("fuck text");

  const setValueInDB = () => {
    if (!lobbyName.trim()) {
      Alert.alert('Validation Error', 'Lobby name is required!');
      return;
    }
    // Define the reference path to the value you want to set
    const databaseRef = ref(db, `/lobbies/${lobbyName}`);
    // Set the value in the database
    set(databaseRef, { name: lobbyName })
      .then(() => Alert.alert('Success', 'Lobby created successfully!'))
      .catch(error => Alert.alert('Error', error.message));
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Enter the name of the lobby:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 200, marginBottom: 10 }}
        onChangeText={setLobbyName}
        value={lobbyName}
      />
      <Button
        title="Create Lobby"
        onPress={setValueInDB}
      />
    </SafeAreaView>
  );
};

export default App

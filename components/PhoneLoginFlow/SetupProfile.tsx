// components/Screens/SetupProfile/SetupProfile.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { firestore } from '../config'; // Adjust the path as needed
import { doc, setDoc } from 'firebase/firestore';

const SetupProfileScreen = ({ userId, onProfileSetupComplete }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  const handleSetupComplete = async () => {
    const userDocRef = doc(firestore, 'usersData', userId);
    const newUserdata = {
      profilePicture: "",
      createdAt: new Date(),
      username,
      name,
      followers: 0,
      followersList: [],
      following: 0,
      followingList: [],
      posts: [],
      profileSetupComplete: true,
    };
    await setDoc(userDocRef, newUserdata);
    onProfileSetupComplete(newUserdata);
  };

  return (
    <View style={styles.container}>
      <Text>Setup your profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Complete Setup" onPress={handleSetupComplete} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    marginVertical: 10,
  },
});

export default SetupProfileScreen;

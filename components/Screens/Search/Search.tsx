import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../../config'; // Adjust the path as needed
import { collection, getDocs } from 'firebase/firestore';

const SearchScreen = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = [];
        const querySnapshot = await getDocs(collection(firestore, 'usersData'));
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersData);
        setFilteredUsers(usersData); // Initialize filtered users with all users
      } catch (error) {
        console.error('Error fetching users:', error);
        Alert.alert('Error', 'Failed to fetch users. Please try again later.');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleUserPress = (user) => {
    navigation.navigate('OtherProfile', { userId: user.id });
  };

  return (
    <View style={styles.container}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search by username"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <ScrollView style={styles.scrollView}>
            {filteredUsers.map((user) => (
              <View key={user.id} style={styles.userButtonContainer}>
                <Button
                  title={user.username}
                  onPress={() => handleUserPress(user)}
                />
              </View>
            ))}
          </ScrollView>
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
  searchBar: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  scrollView: {
    width: '100%',
  },
  userButtonContainer: {
    marginBottom: 10,
    width: '80%',
    alignSelf: 'center',
  },
});

export default SearchScreen;

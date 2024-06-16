// NavigationBar.js
import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MultiuseButton = ({follower, following}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <View style={styles.text}>
          <Text > {following} </Text>
          <Text > Following </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Search')}>
        <View style={styles.text}>
          <Text > {follower} </Text>
          <Text > Follower </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Record')}>
        <View style={styles.text}>
          <Text > 0 </Text>
          <Text > Likes </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: 'auto',
    alignItems: 'center',
    flexDirection: 'row',
    
  },  
  text: {
    alignItems: 'center',
    flexDirection: 'column',
    marginHorizontal: 10,
  },
});

export default MultiuseButton

// NavigationBar.js
import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MultiuseButton = ({ text }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <Text style={styles.text}> {text} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: 35,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 5
  },
  text: {
    paddingHorizontal: 15
  }
 
});

export default MultiuseButton;

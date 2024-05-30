import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import Scroller from './components/Scroller/Scroller.tsx'

const App = () => {

  return (
    <View style={styles.appContainer}>
      <View style={styles.container}>
        <Scroller />
      </View>

      <View style={styles.navbar}>
        <Image source={require('./icons/home.png')} style={styles.icon} />
        <Image source={require('./icons/search.png')} style={styles.icon} />
        <Image source={require('./icons/record.png')} style={styles.icon} />
        <Image source={require('./icons/profile.png')} style={styles.icon} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  container: {
    height: '92%',
  },
  navbar: {
    height: '8%',
    backgroundColor: '#0e1111',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    width: 24,
    height: 24,
  },
  navbarText: {
    color: 'white',
    marginRight: 2,
    marginLeft: 2,
  },
});

export default App;

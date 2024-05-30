import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Scroller from './components/Scroller/Scroller.tsx'

const App = () => {

  return (
    <View style={styles.appContainer}>
      <View style={styles.container}>
        <Scroller />
      </View>
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>Navbar</Text>
        <Text style={styles.navbarText}>Navbar</Text>

        <Text style={styles.navbarText}>Navbar</Text>

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
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },  
  navbarText: {
    color: 'white',
    marginRight: 5,
    marginLeft: 5,
  }  
});

export default App;

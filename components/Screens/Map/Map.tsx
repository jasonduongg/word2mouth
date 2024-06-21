import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import Mapbox from '@rnmapbox/maps';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB0FhdkAyU8GP0w2NdLiz9w5u0xzGVCAyw';
Mapbox.setAccessToken('pk.eyJ1IjoidzJtIiwiYSI6ImNseHAzaGUxMjA2YjUybG16bHQ2cnNpc3MifQ.s0GRMBIp78u43RZAY3LSWA');

const RestaurantFinder = () => {
  const [region, setRegion] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const getLocation = async () => {
      const latitude = 37.335480;
      const longitude = -121.893028;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      fetchRestaurants(latitude, longitude);
    };

    getLocation();
  }, []);

  const fetchRestaurants = async (latitude, longitude) => {
    try {
        console.log(latitude)
        console.log(longitude)
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${GOOGLE_MAPS_API_KEY}`,
      );
      console.log(response)
      setRestaurants(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
    container: {
    height: 300,
    width: 300,
    },
    map: {
    flex: 1
}
});

export default RestaurantFinder;

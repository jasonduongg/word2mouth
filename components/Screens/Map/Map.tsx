import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import MapboxGL from '@rnmapbox/maps';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB0FhdkAyU8GP0w2NdLiz9w5u0xzGVCAyw';
MapboxGL.setAccessToken('pk.eyJ1IjoidzJtIiwiYSI6ImNseHAzaGUxMjA2YjUybG16bHQ2cnNpc3MifQ.s0GRMBIp78u43RZAY3LSWA');

const { width, height } = Dimensions.get('window');

const RestaurantFinder = () => {
  const [region, setRegion] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(14);

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
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${GOOGLE_MAPS_API_KEY}`,
      );
      setRestaurants(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const renderAnnotations = () => {
    return restaurants.map((restaurant, index) => (
      <MapboxGL.PointAnnotation
        key={index}
        id={`pointAnnotation${index}`}
        coordinate={[restaurant.geometry.location.lng, restaurant.geometry.location.lat]}
      >
        <View style={styles.annotationContainer}>
          <Image
            source={require('../../../assets/images/map-marker.png')} // Make sure to replace this with the correct path to your image
            style={styles.annotationImage}
          />
        </View>
        <MapboxGL.Callout title={restaurant.name} />
      </MapboxGL.PointAnnotation>
    ));
  };

  const handleZoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 1, 20)); // Maximum zoom level for Mapbox is 20
  };

  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 1, 0)); // Minimum zoom level for Mapbox is 0
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        {region && (
          <MapboxGL.MapView style={styles.map} styleURL={MapboxGL.StyleURL.Dark}>
            <MapboxGL.Camera
              zoomLevel={zoomLevel}
              centerCoordinate={[region.longitude, region.latitude]}
            />
            <MapboxGL.UserLocation />
            {renderAnnotations()}
          </MapboxGL.MapView>
        )}
      </View>
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
          <Text style={styles.zoomText}>-</Text>
        </TouchableOpacity>
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
    height: height * 0.92,
    width: width,
  },
  map: {
    flex: 1,
  },
  zoomControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  zoomButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  zoomText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  annotationContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  annotationImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default RestaurantFinder;

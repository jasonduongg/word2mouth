import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import MapboxGL from '@rnmapbox/maps';
import { render } from 'react-dom';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB0FhdkAyU8GP0w2NdLiz9w5u0xzGVCAyw';
MapboxGL.setAccessToken('pk.eyJ1IjoidzJtIiwiYSI6ImNseHAzaGUxMjA2YjUybG16bHQ2cnNpc3MifQ.s0GRMBIp78u43RZAY3LSWA');

const { width, height } = Dimensions.get('window');

const RestaurantFinder = () => {
  const [region, setRegion] = useState({
    latitude: 37.8702,
    longitude: -122.2595,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [restaurants, setRestaurants] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(15);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const mapMapRef = useRef(null);
  const mapCameraRef = useRef(null);

  useEffect(() => {
    fetchRestaurants(region.latitude, region.longitude);
  }, []);

  const fetchRestaurants = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${GOOGLE_MAPS_API_KEY}`,
      );
      setRestaurants(response.data.results);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const renderAnnotations = () => {
    return restaurants.map((restaurant) => {
      const { lat, lng } = restaurant.geometry.location;
      const formattedName = restaurant.name;
      return (
        <MapboxGL.PointAnnotation
          key={restaurant.place_id} // Use a unique identifier for each restaurant
          id={`pointAnnotation${restaurant.place_id}`}
          coordinate={[lng, lat]}
        >
          <View style={[
            selectedRestaurant && selectedRestaurant.place_id === restaurant.place_id ? styles.selectedAnnotation : null,
            styles.annotationContainer,
          ]}>
            <View style={styles.annotationBox}>
              <Text style={styles.annotationText}>{formattedName}</Text>
            </View>
          </View>
        </MapboxGL.PointAnnotation>
      );
    });
  };

  const handleRefresh = async () => {
    if (mapCameraRef.current) {
      const center = await mapMapRef.current.getCenter();
      fetchRestaurants(center[1], center[0]); // center is [longitude, latitude]
    }
  };

  const handleZoomIn = async () => {
    if (mapCameraRef.current) {
      console.log(mapCameraRef)
      const center = await mapMapRef.current.getCenter();
      setZoomLevel((prevZoomLevel) => {
        const newZoomLevel = Math.min(prevZoomLevel + 1, 20);
        mapCameraRef.current.zoomTo(newZoomLevel, 100)
        return newZoomLevel;
      });
    }
  };

  const handleZoomOut = async () => {
    if (mapCameraRef.current) {
      console.log(mapCameraRef)
      const center = await mapMapRef.current.getCenter();
      setZoomLevel((prevZoomLevel) => {
        const newZoomLevel = Math.min(prevZoomLevel - 1, 20);
        mapCameraRef.current.zoomTo(newZoomLevel, 100)
        return newZoomLevel;
      });
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          ref={mapMapRef} 
          style={styles.map} 
          styleURL={MapboxGL.StyleURL.Dark}>
          <MapboxGL.Camera
            ref={mapCameraRef} 
            defaultSettings={{
              zoomLevel: zoomLevel,
              centerCoordinate: [region.longitude, region.latitude]
            }}
            centerCoordinate={[region.longitude, region.latitude]}
          />
          <MapboxGL.UserLocation />
          {renderAnnotations()}
        </MapboxGL.MapView>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
          <Text style={styles.zoomText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshText}>Refresh</Text>
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
  controls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    alignItems: 'center',
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
  refreshButton: {
    width: 80,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  refreshText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedAnnotation: {
    backgroundColor: "red"
  },
  annotationContainer: {
    width: "auto",
    height: "auto",
    justifyContent: 'center',
    alignItems: 'center',
  },
  annotationBox: {
    padding: 5,
    borderRadius: 5,
  },
  annotationText: {
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
    color: "yellow",
  },
});

export default RestaurantFinder;
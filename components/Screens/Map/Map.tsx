import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import MapboxGL from '@rnmapbox/maps';
import { render } from 'react-dom';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB0FhdkAyU8GP0w2NdLiz9w5u0xzGVCAyw';
MapboxGL.setAccessToken('pk.eyJ1IjoidzJtIiwiYSI6ImNseHAzaGUxMjA2YjUybG16bHQ2cnNpc3MifQ.s0GRMBIp78u43RZAY3LSWA');

const { width, height } = Dimensions.get('window');

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const RestaurantFinder = () => {
  const [region, setRegion] = useState({
    latitude: 37.8702,
    longitude: -122.2595,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [restaurants, setRestaurants] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(15);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // New state for page tracking
  const mapMapRef = useRef(null);
  const mapCameraRef = useRef(null);
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLong, setCurrentLong] = useState(null);

  useEffect(() => {
    fetchRestaurants(region.latitude, region.longitude);
  }, []);

  useEffect(() => {
    renderAnnotations();
  }, [restaurants]);

  const fetchRestaurants = async (latitude, longitude, pageToken = null) => {
    try {
      let allResults = [];
      let currentPageToken = pageToken;
      let counter = 0;
      
      // Helper function to sleep for a given time
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
      while (counter < 3 && allResults.length < 60) {
        if (currentPageToken) {
          console.log("loading using pagetoken");
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=1500&type=restaurant&key=${GOOGLE_MAPS_API_KEY}&pagetoken=${currentPageToken}`
          );
          console.log(`Fetching with page token: ${currentPageToken}`);
          console.log(response.data);
  
          allResults = [...allResults, ...response.data.results];
          currentPageToken = response.data.next_page_token || null;
        } else {
          console.log("loading initial request");
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${GOOGLE_MAPS_API_KEY}`
          );
          console.log(`Fetching initial request for location: ${latitude},${longitude}`);
          console.log(response.data);
  
          allResults = [...allResults, ...response.data.results];
          currentPageToken = response.data.next_page_token || null;
        }
  
        // Increment page counter and sleep to avoid hitting rate limits
        counter++;
        await sleep(2000); // Adjust sleep duration as needed
      }
  
      // Ensure the results do not exceed 60
      allResults = allResults.slice(0, 60);
  
      // Update the state or handle the results as needed
      setRestaurants(allResults);
      setNextPageToken(currentPageToken);
      setCurrentPage(counter); // Update current page count if necessary
  
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };
  

  const renderAnnotations = () => {
    console.log("-----")
    console.log((restaurants))
    return restaurants.map((restaurant) => {
      const { lat, lng } = restaurant.geometry.location;
      const formattedName = restaurant.name;
      console.log(formattedName)
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
      fetchRestaurants(center[1], center[0]);
    }
  };

  const handleZoomIn = async () => {
    if (mapCameraRef.current) {
      const center = await mapMapRef.current.getCenter();
      setZoomLevel((prevZoomLevel) => {
        const newZoomLevel = Math.min(prevZoomLevel + 1, 20);
        mapCameraRef.current.zoomTo(newZoomLevel, 100);
        return newZoomLevel;
      });
    }
  };

  const handleZoomOut = async () => {
    if (mapCameraRef.current) {
      const center = await mapMapRef.current.getCenter();
      setZoomLevel((prevZoomLevel) => {
        const newZoomLevel = Math.max(prevZoomLevel - 1, 1);
        mapCameraRef.current.zoomTo(newZoomLevel, 100);
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
  nextPageButton: {
    width: 100,
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
  selectedAnnotation: {
    backgroundColor: "red",
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
    fontSize: 8,
    fontWeight: 'bold',
    overflow: 'hidden',
    color: "yellow",
  },
});

export default RestaurantFinder;

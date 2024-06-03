import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config'; // Import your Firebase storage instance

const ProfileScreen = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoList = [];
        const storageRef = ref(storage, 'media'); // Change this to the path where your videos are stored
        const listResult = await listAll(storageRef);

        await Promise.all(listResult.items.map(async (itemRef) => {
          const downloadURL = await getDownloadURL(itemRef);
          videoList.push({ id: itemRef.name, url: downloadURL });
        }));

        setVideos(videoList);
      } catch (error) {
        console.error('Error fetching videos:', error);
        Alert.alert('Error', 'Failed to fetch videos. Please try again later.');
      }
    };

    fetchVideos();
  }, []);

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleVideoPress(item)}>
      <View style={styles.videoContainer}>
        <Image source={{ uri: 'Your placeholder image URL' }} style={styles.thumbnail} />
        <Text style={styles.videoTitle}>{item.id}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleVideoPress = (video) => {
    // Handle video press, for example, navigate to a video player screen
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.videoList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  videoList: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  videoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 8,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ProfileScreen;

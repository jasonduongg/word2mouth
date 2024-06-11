import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Image, ScrollView} from 'react-native';
import Video from 'react-native-video';

import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config'; // Import your Firebase storage instance
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileData from '../../ProfileData/ProfileData';
import MultiuseButton from '../../MultiuseButton/MultiuseButton';

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

        console.log(videoList)
        setVideos(videoList);
      } catch (error) {
        console.error('Error fetching videos:', error);
        Alert.alert('Error', 'Failed to fetch videos. Please try again later.');
      }
    };

    fetchVideos();
  }, []);

  const renderVideoItems = () => {
    return videos.map((video, index) => (
      <TouchableOpacity key={video.id} onPress={() => handleVideoPress(video)}>
        <View style={styles.videoContainer}>
          <Video
              source={{ uri: video.url }}
              style={styles.media}
              paused={false}
              repeat={true}
              controls={false}
              resizeMode="cover"
              onError={(e) => console.log(e)}
          />
        </View>
      </TouchableOpacity>
    ));
  };

  const handleVideoPress = (video) => {
    // Handle video press, for example, navigate to a video player screen
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView style={styles.scroll}>
          <View style={styles.profileHeading}>
            <View style={styles.profilePicture}>
            </View>
            <Text style={styles.profileName}>@iamsaerom</Text>
            <View style={{ marginVertical: 10 }}>
              <ProfileData ></ProfileData>
            </View>
            <View style={styles.profileButtons}>
              <MultiuseButton text={"Follow"}></MultiuseButton>
              <MultiuseButton text={"Share Profile"}></MultiuseButton>
            </View>
          </View>

          <View style={styles.content}>
            {renderVideoItems()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeading: {
    alignItems: 'center',
  },
  profilePicture: {
    marginTop: 15,
    backgroundColor: 'green',
    width: 96,
    height: 96,
  },
  profileButtons: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '50%'
  },
  profileName: {
    marginTop: 5,
    fontSize: 18
  },
  container: {
    flex: 1,
    width: Dimensions.get('window').width * 1,
  },
  scroll: {
    height: '100%',
  },
  content: {
    marginTop: 25,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  videoContainer: {
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').width * 0.3,
    margin: 4,
    backgroundColor: 'red',

  },
  media: {
    flex: 1,
    backgroundColor: 'red',
  },
});

export default ProfileScreen;

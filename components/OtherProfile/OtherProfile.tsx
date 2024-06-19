import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../config';
import { doc, getDoc } from 'firebase/firestore';

// Components
import ProfileData from '../ProfileData/ProfileData';
import MultiuseButton from '../MultiuseButton/MultiuseButton';

const OtherProfile = ({ route }) => {
  const { userId } = route.params;
  const [videos, setVideos] = useState([]);
  const [userProfileData, setUserProfileData] = useState({});
  const [userVideos, setUserVideos] = useState([]);

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

  const fetchUserData = async () => {
    try {
      const userDocRef = doc(firestore, 'usersData', userId);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setUserProfileData(userData);
        setUserVideos(userData.posts || []); // Fetch user video list from user data
      } else {
        console.error('User data does not exist');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data. Please try again later.');
    }
  };

  const refreshData = async () => {
    await fetchUserData();
    await fetchVideos();
  };

  useEffect(() => {
    refreshData();
  }, []);

  const renderVideoItems = () => {
    return videos
      .filter(video => userVideos.includes(video.id)) // Only render videos in user's video list
      .map((video) => (
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
        <Button title="Refresh" onPress={refreshData} />
        <ScrollView style={styles.scroll}>
          <View style={styles.profileHeading}>
            <View style={styles.profilePicture}></View>
            <Text style={styles.profileName}>@{userProfileData.username}</Text>
            <View style={{ marginVertical: 10 }}>
              <ProfileData follower={userProfileData.followers} following={userProfileData.following} />
            </View>
            <View style={styles.profileButtons}>
              <MultiuseButton text={"Follow"} />
              <MultiuseButton text={"Connect"} />
              <MultiuseButton text={"v"} />
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
    width: '50%',
  },
  profileName: {
    marginTop: 5,
    fontSize: 18,
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

export default OtherProfile;

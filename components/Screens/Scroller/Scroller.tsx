import React, { useState, useRef, useEffect } from 'react';
import { View, PanResponder, Dimensions, StyleSheet, Animated, FlatList, Text, Image, Alert, Button } from 'react-native';
import Video from 'react-native-video';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../config'; // Import your Firebase Firestore instance
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const Scroller = () => {
  const [videos, setVideos] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const videoList = [];
      const metadataList = [];
      const storageRef = ref(storage, 'media'); // Change this to the path where your videos are stored
      const listResult = await listAll(storageRef);

      await Promise.all(listResult.items.map(async (itemRef) => {
        const downloadURL = await getDownloadURL(itemRef);
        videoList.push({ id: itemRef.name, url: downloadURL });
      }));

      const metadataSnapshot = await getDocs(collection(firestore, 'metadata_collection'));
      metadataSnapshot.forEach((doc) => {
        metadataList.push({ id: doc.id, ...doc.data() });
      });

      const combinedList = await Promise.all(videoList.map(async (video) => {
        const metadata = metadataList.find(meta => meta.id === video.id) || {};
        const userDocRef = doc(firestore, 'usersData', metadata.ownerId);
        const userSnapshot = await getDoc(userDocRef);
        const userData = userSnapshot.exists() ? userSnapshot.data() : {};
        console.log(userData)
        return { ...video, ...metadata, username: userData.username || 'Unknown' };
      }));

      setVideos(combinedList);
    } catch (error) {
      console.error('Error fetching videos:', error);
      Alert.alert('Error', 'Failed to fetch videos. Please try again later.');
    }
  };

  const changeVideoThreshold = 200;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dy) > changeVideoThreshold) {
          if (gestureState.dy < 0) {
            console.log("Swiped up");
            setVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
          } else {
            console.log("Swiped down");
            setVideoIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
          }
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false
        }).start();
      }
    })
  ).current;

  const renderItem = ({ item, index }) => (
    <View style={styles.videoWrapper}>
      <Video
        source={{ uri: item.url }}
        paused={index !== videoIndex}
        repeat={true}
        resizeMode="cover"
        style={styles.videoContainer}
        onError={(e) => console.log(e)}
      />
      <View style={styles.overlayTextContainer}>
        <Text style={styles.overlayText_creator}>{item.username}</Text>
        <Text style={styles.overlayText_menu}>{item.location || 'Error: Location'}</Text>
        <Text style={styles.overlayText_description}>{item.description || 'No description available'}</Text>
        <View style={styles.overlayStarContainer}>
          {[...Array(5)].map((_, i) => (
            <Image key={i} source={require('./icons/star.png')} style={styles.star} />
          ))}
        </View>
      </View>
      
      <View style={styles.overlayNavContainer}>
        <Image source={require('./icons/like.png')} style={styles.icon} />
        <Image source={require('./icons/chat.png')} style={styles.icon} />
        <Image source={require('./icons/share.png')} style={styles.icon} />
        <Image source={require('./icons/bookmark.png')} style={styles.icon} />
        <Image source={require('./icons/order.png')} style={styles.icon} />
      </View>
    </View>
  );

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const viewHeight = Dimensions.get('window').height * 0.9;
    const nextIndex = Math.floor(contentOffset.y / viewHeight + 0.5);
    setVideoIndex(nextIndex % videos.length);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onScroll={handleScroll}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        initialScrollIndex={videoIndex}
        getItemLayout={(data, index) => (
          { length: Dimensions.get('window').height * 0.9, offset: Dimensions.get('window').height * 0.9 * index, index }
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoWrapper: {
    width: '100%',
    height: Dimensions.get('window').height * 0.92, // must be the same size as parent 
    position: 'relative',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
  },
  overlayTextContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '70%',
    height: '21%',
    paddingTop: "3.5%",
    paddingLeft: "4.5%",
    alignItems: 'flex-start',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add a semi-transparent background
  },
  overlayStarContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    left: 0,
    bottom: 0,
    alignItems: 'flex-start',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add a semi-transparent background
  },
  icon: {
    width: 32,
    height: 32,
  },
  overlayNavContainer: {
    justifyContent: 'space-around',
    marginRight: '1%',
    marginBottom: '3.5%',
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '15%',
    height: '40%',
    paddingTop: 10,
    paddingLeft: 10,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add a semi-transparent background
  },
  star: {
    width: 20,
    height: 20,
    marginRight: 3.5,
  },
  overlayText_creator: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  overlayText_menu: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  overlayText_description: {
    color: 'white',
    fontSize: 13,
    marginBottom: 6,
  },
});

export default Scroller;

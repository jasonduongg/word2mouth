import React, { useState, useRef, useEffect } from 'react';
import { View, PanResponder, Dimensions, StyleSheet, Animated, FlatList } from 'react-native';
import Video from 'react-native-video';

const Scroller = () => {
  const videos = [
    require('../videos/test_video1.mp4'),
    require('../videos/test_video2.mp4'),
    require('../videos/test_video3.mp4'),
    require('../videos/test_video4.mp4'),
    require('../videos/test_video5.mp4')
  ];

  const [videoIndex, setVideoIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    console.log(`Current video index: ${videoIndex}`);
  }, [videoIndex]);

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
        source={item}
        paused={index !== videoIndex}
        repeat={true}
        resizeMode="cover"
        style={styles.videoContainer}
        onError={(e) => console.log(e)}
      />
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
    height: Dimensions.get('window').height * 0.92, // must be the same size as parent 
  },
  videoContainer: {
    width: '100%',
    height: '100%',
  }
});

export default Scroller;

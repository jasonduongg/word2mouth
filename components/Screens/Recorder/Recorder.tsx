import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Dimensions} from 'react-native';
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getStorage, ref, uploadBytes } from 'firebase/storage'; // Import Firebase Storage features
import { storage } from '../../config'; // Import your Firebase storage instance


const ProfileScreen = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  useEffect(() => {
    // console.log("selectedMedia changed:", selectedMedia);
  }, [selectedMedia]);

  function showMessage() {
    Alert.alert("Upload media", "Choose an option", [
      {
        text: 'Camera',
        onPress: () => openCamera(),
      },
      {
        text: 'Gallery',
        onPress: () => openLibrary()
      },
    ]);
  }

  const openLibrary = () => {
    const options = {
      mediaType: 'mixed', // Allow selection from both images and videos
      storageOptions: {
        skipBackup: true,
        path: 'imagesAndVideos', // You can customize the path if needed
      },
    };

    launchImageLibrary(options, (response) => {
      if (!response.didCancel) {
        setSelectedMedia(response);
      }
    });
  };
  
  const openCamera = () => {
    // Ongoing implementation for opening the camera
  }

  const uploadData = async () => {
    
    if (selectedMedia && selectedMedia.assets[0] && selectedMedia.assets[0].fileSize > 0) {
      const mediaFile = selectedMedia.assets[0];
      const response = await fetch(mediaFile.uri);
      const blob = await response.blob();
      const filename = `${Date.now()}_${mediaFile.fileName}`;
  
      // Change per UUID
      const storageRef = ref(storage, `media/${filename}`);
    
      uploadBytes(storageRef, blob)
        .then((snapshot) => {
          console.log('Upload successful');
      })
        .catch((error) => {
          console.error('Error uploading:', error);
      });

      console.log("storageRef path:", storageRef.fullPath);
      Alert.alert('Upload Success', 'Media uploaded successfully.');
    }
  };

  

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TouchableOpacity onPress={() => showMessage()}>
          <Text style={styles.text}>Choose Media</Text>
        </TouchableOpacity>
        {selectedMedia && (
          <View>
            {selectedMedia.assets[0].type && selectedMedia.assets[0].type.startsWith('image') ? (
              <View>

                <View style={styles.mediaContainer}>
                  <Image resizeMode="cover" source={{ uri: selectedMedia.assets[0].uri }} style={styles.media} />
                </View>

                <TouchableOpacity onPress={() => uploadData()}>
                    <Text style={styles.text}>Upload</Text>
                  </TouchableOpacity>
              </View>
            ) : selectedMedia.assets[0].type && selectedMedia.assets[0].type.startsWith('video') ? (
              <View>
                <View style={styles.mediaContainer}>
                  <Video
                    resizeMode="cover"
                    source={{ uri: selectedMedia.assets[0].uri }}
                    style={styles.media}
                    paused={false}
                    repeat={true}
                    controls={false}
                    onError={(e) => console.log(e)}
                  />
                </View>
                <TouchableOpacity onPress={() => uploadData()}>
                  <Text style={styles.text}>Upload</Text>
                </TouchableOpacity>
              </View>

            ) : (
              <Text>No media selected</Text>
            )}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  mediaContainer: {
    marginTop: 20,
    width: Dimensions.get('window').width * 0.60,
    height: Dimensions.get('window').height * 0.60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
});

export default ProfileScreen;

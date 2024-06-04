import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Dimensions, TextInput } from 'react-native';

import Video from 'react-native-video';
import { Video as VideoCompress } from 'react-native-compressor';

import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'; // Import Firebase Storage features
import { storage, firestore } from '../../config'; // Import your Firebase storage instance
import { collection, addDoc, doc, setDoc} from 'firebase/firestore';

const FinalizeScreen = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [metadata, setMetadata] = useState({ description: '', likes: 0, comments: [] });

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

  const back = () => {
    setSelectedMedia(null)
  }

  const uploadData = async () => {
    if (selectedMedia && selectedMedia.assets[0] && selectedMedia.assets[0].fileSize > 0) {
      
      const filename = `${Date.now()}_${selectedMedia.assets[0].fileName}`;
      const fileUri = selectedMedia.assets[0].uri;
      const videoRef = ref(storage, `media/${filename}`);
      const blob = await new Promise((resolve, reject) => {
      
      const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.ontimeout = function (e) {    
          console.log(e);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", fileUri, true);
        xhr.timeout = 1000 * 60;
        xhr.send(null);
      });
  
      var uploadTask = uploadBytesResumable(videoRef, blob, metadata);
      uploadTask.then((snapshot) => {
        // Handle successful uploads
        setMetadataInFirestore('metadata_collection', metadata, filename);
        blob.close();
      }).catch((error) => {
        console.log(error);
        // Handle unsuccessful uploads
        blob.close();
      });

    }
  };
  

  const setMetadataInFirestore = async (collectionRef, metadata, filename) => {
    console.log(collectionRef, metadata)
    try {
      // Add metadata document to the Firestore collection
      await setDoc(doc(collection(firestore, collectionRef), filename), metadata);
      console.log('Metadata saved in Firestore');
    } catch (error) {
      console.error('Error saving metadata:', error);
      throw error; // Throw the error to handle it in the calling function if needed
    }
  };


  const renderItem = ({ item, index }) => {
    return (
      <View>
        <View style={styles.mediaContainer}>
          <Video
            resizeMode="cover"
            source={{ uri: item }}
            style={styles.media}
            paused={false}
            repeat={true}
            controls={false}
            onError={(e) => console.log(e)}
          />
        </View>
      </View>
    );
  };
  
  
  
  

  return (
    <View style={styles.container}>
        {!selectedMedia && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => showMessage()}>
            <Text style={styles.text}>Choose Media</Text>
          </TouchableOpacity>
        </View>
       
        )}
        {selectedMedia && (
          <View>
            {selectedMedia.assets[0].type && selectedMedia.assets[0].type.startsWith('image') ? (
              <View>
                <View style={styles.mediaContainer}>
                  <Image resizeMode="cover" source={{ uri: selectedMedia.assets[0].uri }} style={styles.media} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={metadata.description}
                  onChangeText={(text) => setMetadata({ ...metadata, description: text })}
                />
                <TouchableOpacity onPress={() => uploadData()}>
                  <Text style={styles.text}>Upload</Text>
                </TouchableOpacity>
              </View>
            ) : selectedMedia.assets[0].type && selectedMedia.assets[0].type.startsWith('video') ? (
              <View>
                {renderItem({ item: selectedMedia.assets[0].uri, index: 0 })}
                <View style = {styles.backOverlay}> 
                <SafeAreaView>
                  <TouchableOpacity onPress={() => back()}>
                    <View style={styles.backButton}>
                      <Image source={require('./icons/back.png')} style={styles.icon} />
                    </View>
                  </TouchableOpacity>
                </SafeAreaView>
                </View>
                <View style = {styles.proceed}>
                  <TouchableOpacity onPress={() => uploadData()}>
                    <View style={styles.proceedButtons}>
                      <Text style={{ fontSize: 16, color: 'black', textAlign: 'center' }}>Story</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => uploadData()}>
                    <View style={styles.proceedButtons}>
                      <Text style={{ fontSize: 16, color: 'black', textAlign: 'center' }}>Post</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

            ) : (
              <Text>No media selected</Text>
            )}
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'red',
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 1,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  mediaContainer: {
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 0.92,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  input: {
    height: Dimensions.get('window').height * 0.1,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  restaurant: {

  },
  backOverlay: {
    position: 'absolute',
  },
  backButton: {
    width: Dimensions.get('window').width * 0.1,
    margin: 10
  },
  icon: {
    width: 30,
    height: 30,
  },
  proceed: {
    justifyContent: 'center',
    flexDirection: 'row', 
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    marginBottom: 15,
  },
  proceedButtons: {
    width: Dimensions.get('window').width * 0.45,
    backgroundColor: "white",
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 10,
  
  },
});

export default FinalizeScreen;

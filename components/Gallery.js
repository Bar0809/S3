import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Toolbar from './Toolbar';
import { auth, db, storage } from './firebase';
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

const Gallery = () => {
  const navigation = useNavigation();
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [image, setImage] = useState(null);
  const [uid, setUid] = useState({});
  const [gallery, setGallery] = useState([]);
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);

  useEffect(() => {
    setIsPhotoUploaded(true);
  }, []);

  useEffect(() => {
    const getGalleryImages = async () => {
      if (isPhotoUploaded) {
        const listRef = ref(storage);
        const images = await listAll(listRef);
        const urls = await Promise.all(
          images.items.map((imageRef) => getDownloadURL(imageRef))
        );
        setGallery(urls);
      }
    };
    getGalleryImages();
  }, [isPhotoUploaded]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Oops", "Permissions must be granted to upload a photo");
      return;
    }
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result["assets"][0]["uri"]);
      setIsImageSelected(true);
    }
    try {
      await setUid(auth["currentUser"]["uid"]);
    } catch (e) {
      Alert.alert("Oops", e.message);
    }
  };

  const uploadPhoto = async (data) => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    let name = uid + "." + today.toISOString();
    try {
      const response = await fetch(image);
      const blob = await response.blob();
  
      const storageRef = ref(storage, name);
      await uploadBytes(storageRef, blob).then((snapshot) => {
        Alert.alert("התמונה עלתה בהצלחה");
      });
      const url = await getDownloadURL(storageRef);
      setGallery(gallery => [...gallery, url]); // Add the URL of the new photo to the gallery
      setIsPhotoUploaded(true); // Set isPhotoUploaded to true
    } catch (e) {
      Alert.alert("Oops", e.message);
    }
  };

  return (
    <ScrollView showVerticalScrollIndicator={false}>
    <View style={styles.allPage}>
      <Toolbar />
      <View style={styles.title}>
        <Text style={styles.pageTitle}>גלריה</Text>
      </View>
      <View style={styles.buttonsContainer}>
      <TouchableOpacity style={[styles.button, styles.uploadButton]} onPress={() => uploadPhoto()}>
      <Text>העלה לגלריה</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => pickImage()}>
      <Text>בחר תמונה</Text>
    </TouchableOpacity>
    
    </View>
      <View style={styles.gallery}>
        {gallery.map((image, index) => (
          <Image key={index} source={{uri: image}} style={styles.image} />
        ))}
      </View>
      <TouchableOpacity style={[styles.back, { marginTop: 'auto' }]} onPress={() => navigation.navigate('HomePage')}>
        <MaterialIcons name="navigate-next" size={24} color="black" />
        <Text>הקודם</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  )
}

export default Gallery

const styles = StyleSheet.create({
  allPage: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  pageTitle: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
  },
  back: {
    padding: '5%',
    alignItems: 'center',
    zIndex: 1,
    opacity: 0.7,
  },
  butt: {
    backgroundColor: '#90EE90',
    borderRadius: 50,
    textAlign: 'center',
    alignItems: 'center',
    padding: 20,
    width: '50%',
    top: 20,
    marginBottom: 10,
    marginVertical: 10
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#90EE90',
    borderRadius: 50,
    textAlign: 'center',
    alignItems: 'center',
    padding: 20,
    width: '40%',
    marginRight: 10,
    marginLeft: 10,
  },
  uploadButton: {
    backgroundColor: '#00BFFF',
    marginRight: 0,
    marginLeft: 0,
  },
  gallery: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 5,
  },
  image: {
    width: 150,
    height: 150,
    margin: 5,
  },
});
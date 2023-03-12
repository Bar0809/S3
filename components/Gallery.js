import { View, Text , StyleSheet, TouchableOpacity, Alert} from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import Toolbar from './Toolbar';
import { auth, db, storage } from './firebase';
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
  uploadBytes,
} from "firebase/storage";
const Gallery = () => {
  const navigation = useNavigation();
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [image, setImage] = useState(null);
  const [uid, setUid] = useState({});
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

    // console.warn(result["assets"]);

    if (!result.canceled) {
      setImage(result["assets"][0]["uri"]);
      setIsImageSelected(true);
    }
    try {
      await setUid(auth["currentUser"]["uid"]);
      // console.warn(uid);
    } catch (e) {
      Alert.alert("Oops", e.message);
    }

    // console.warn(result["assets"]);
  };

  const uploadPhoto = async (data) => {
    // console.warn(filePath);
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    let name = uid + "." + today.toISOString();
    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const storageRef = ref(storage, name);
      // await uploadBytesResumable(storageRef, blob);
      await uploadBytes(storageRef, blob).then((snapshot) => {
        Alert.alert("Uploaded!");
        // navigation.navigate("Home");
      });
      return await getDownloadURL(storageRef);
    } catch (e) {
      Alert.alert("Oops", e.message);
    }
  };

  return (
    <View style={styles.allPage}>
      <Toolbar />
      <View style={styles.title}>
        <Text style={styles.pageTitle}>גלריה</Text>
      </View>
      <TouchableOpacity style={styles.butt}  onPress={() => pickImage()}>
        <Text >בחר תמונה</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.butt}  onPress={() => uploadPhoto()}>
        <Text >העלה לגלריה</Text>
        </TouchableOpacity>
      <TouchableOpacity style={[styles.back, { marginTop: 'auto' }]} onPress={() => navigation.navigate('HomePage')}>
        <MaterialIcons name="navigate-next" size={24} color="black" />
        <Text>הקודם</Text>
      </TouchableOpacity>
    </View>
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
  },
});
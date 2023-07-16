import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { auth, db, storage } from "./firebase";

import * as ImagePicker from "expo-image-picker";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  updateMetadata,
  listAll,
  getMetadata,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  query,
  where,
  getDocs,
  document,
} from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { Card } from "react-native-elements";
import Navbar from "./Navbar";
import ModalDropdown from "react-native-modal-dropdown";

const { width } = Dimensions.get("window");

const Gallery = () => {
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [image, setImage] = useState(null);
  const [uid, setUid] = useState({});
  const [gallery, setGallery] = useState([]);
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [description, setDescription] = useState("");
  const [className, setClassName] = useState("");
  const [items, setItems] = useState([]);
  const [names, setNames] = useState([]);
  const [filterNames, setFilterNames] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "Classes"),
          where("t_id", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        const newItems = querySnapshot.docs.map((doc) => ({
          label: doc.data().class_name,
          value: doc.id,
        }));

        setItems(newItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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

        const metadata = await Promise.all(
          images.items.map((imageRef) => getMetadata(imageRef))
        );

        const namesWithMetadata = images.items.map((imageRef, index) => {
          return {
            url: urls[index],
            metadata: metadata[index].customMetadata,
          };
        });

        setNames(namesWithMetadata.map((item) => item.metadata));

        const filterName = namesWithMetadata.filter(
          (item) => item.metadata["t_id"] === auth.currentUser.uid
        );
        setFilterNames(filterName);

        if (selectedClassId === "") {
          const filteredUrls = namesWithMetadata.filter((item) =>
            item.url.includes(auth.currentUser.uid)
          );
          setGallery(filteredUrls);
        }

        if (selectedClassId !== "") {
          const filteredUrls = namesWithMetadata.filter((item) =>
            item.url.includes(selectedClassId)
          );
          setGallery(filteredUrls);
          
        }
      }

     
    };

    getGalleryImages();
  }, [isPhotoUploaded, selectedClassId]);

  function handleDeleteImage(imageUrl) {
    Alert.alert(
      '',
      'האם את/ה בטוח/ה שאת/ה רוצה למחוק את התמונה?',
      [
        {
          text: 'לא',
          style: 'cancel',
          onPress: () => {
            // No action required
          }
        },
        {
          text: 'כן',
          style: 'destructive',
          onPress: () => {
            const imageRef = ref(storage, imageUrl);
  
            deleteObject(imageRef)
              .then(() => {
                // console.log(`Image ${imageUrl} deleted successfully.`);
  
                const deletedIndex = gallery.findIndex((item) => item.url === imageUrl);
                const updatedGallery = [...gallery];
                updatedGallery.splice(deletedIndex, 1);
                setGallery(updatedGallery);
              })
              .catch((error) => {
                console.error(`Error deleting image ${imageUrl}:`, error);
              });
          }
        }
      ]
    );
  }

  const pickImageFromGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Oops", "Permissions must be granted to upload a photo");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
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
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Oops", "Permissions must be granted to upload a photo");
      return;
    }
    setShowModal(true);
  };
  const handleChooseItem = () => {
    pickImageFromGallery();
  };

  const uploadPhoto = async (data) => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    let name = uid + "." + today.toISOString() + "." + selectedItem;

    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const storageRef = ref(storage, name);
      await uploadBytes(storageRef, blob).then((snapshot) => {
        Alert.alert("התמונה עלתה בהצלחה");
      });

      const itemRef = ref(storage, name);
      const metadata = {
        customMetadata: {
          t_id: auth.currentUser.uid,
          class_id: selectedItem,
          class_name: className,
          item_description: description,
          item_name: name,
        },
      };

      await updateMetadata(itemRef, metadata);

      const url = await getDownloadURL(storageRef);

      const galleryItemMetadata = {
        metadata: metadata.customMetadata,
        url: url,
      };

      setGallery((gallery) => [...gallery, galleryItemMetadata]);

      setIsPhotoUploaded(true);
      setShowModal(false);
    } catch (e) {
      Alert.alert("Oops", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../assets/miniLogo-removebg-preview.png")} />
      </View>

      <View style={styles.title}>
        <Text style={styles.pageTitle}>גלריה</Text>
      </View>

      <ModalDropdown
        options={items.map((item) => item.label)}
        defaultValue="מיון לפי כיתה"
        style={styles.dropdownContainerFilter}
        textStyle={styles.dropdownText}
        dropdownStyle={styles.dropdownStyle}
        dropdownTextStyle={styles.dropdownOptionText}
        onSelect={(index, value) => {
          setSelectedItem(items[index].value);
          setClassName(items[index].label);
          setSelectedClassId(items[index].value);
        }}
      >
        <Text style={styles.dropdownText}>
          <AntDesign name="filter" size={24} color="black" />
          {selectedItem ? className : "מיון לפי כיתה"}
        </Text>
      </ModalDropdown>

      <View style={styles.gallery}>
        <Swiper
          style={styles.sliderContainer}
          showsButtons={false}
          loop={true}
          dotStyle={styles.sliderDot}
          activeDotStyle={styles.sliderActiveDot}
          prevButton={<Text style={styles.buttonText}>{"<-"}</Text>}
          nextButton={<Text style={styles.buttonText}>{"->"}</Text>}
        >
          {gallery.length === 0 ? (
            <Text style={styles.emptyList}>אין תמונות כרגע</Text>
          ) : (
            gallery.map((item, index) => (
              <View key={index} style={styles.imageContainer}>
                <Card containerStyle={styles.cardContainer}>
                  <Card.Image
                    source={{ uri: item.url }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay}>
                    {item.metadata.class_name && (
                      <Text style={styles.overlayText}>
                        שם הכיתה: {item.metadata.class_name}
                      </Text>
                    )}
                    {item.metadata.item_description !== "" && (
                      <Text style={styles.overlayText}>
                        תיאור התמונה: {item.metadata.item_description}
                      </Text>
                    )}
                    <TouchableOpacity style={styles.deletebutton}
                      onPress={() => handleDeleteImage(item.metadata.item_name)}
                    >
                      <AntDesign name="delete" size={22} color="white" style={[styles.overlayText, {fontSize:32}]} />
                    </TouchableOpacity>
                  </View>
                </Card>
              </View>
            ))
          )}
        </Swiper>
      </View>

      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}> העלאת תמונה </Text>
          <ModalDropdown
            options={items.map((item) => item.label)}
            defaultValue={"בחר/י כיתה"}
            textStyle={styles.dropdownText}
            dropdownTextStyle={styles.dropdownOptionText}
            onSelect={(index, value) => {
              setSelectedItem(items[index].value);
              setClassName(items[index].label);
            }}
            style={styles.dropdownContainer}
          />
          <Text>{"\n"}</Text>
          <Text
            style={{
              textDecorationLine: "underline",
              color: "#AD8E70",
              fontSize: 22,
            }}
          >
            תיאור התמונה - אופציונלי{" "}
          </Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="תיאור התמונה"
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity style={styles.button} onPress={handleChooseItem}>
            <Text style={styles.buttonText}>בחר/י תמונה</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            disabled={!isImageSelected}
            style={[
              styles.buttonStyle,
              isImageSelected ? null : styles.buttonDisabled,
            ]}
            onPress={() => uploadPhoto()}
          >
            <AntDesign name="upload" size={24} color="#A4907C" />
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity style={styles.button} onPress={() => pickImage()}>
        <Text style={styles.textButton}>הוסף/י תמונה</Text>
      </TouchableOpacity>

      <Navbar />
    </View>
  );
};

export default Gallery;

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonStyle: {
    alignItems: "center",
    backgroundColor: "#cfc5ae",
    padding: 5,
    marginVertical: 10,
    width: 250,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: "#cfc5ae",
    color: "black",
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#90EE90",
    borderRadius: 50,
    textAlign: "center",
    alignItems: "center",
    padding: 20,
    width: "40%",
    marginRight: 10,
    marginLeft: 10,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyList: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#AD8E70",
    textAlign: "right",
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#AD8E70",
    textDecorationLine: "underline",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    height: 40,
    width: 200,
  },
  dropdownText: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "black",
    paddingVertical: 10,
    width: 100,
    textAlign: "center",
  },
  descriptionInput: {
    height: 40,
    width: 200,
    marginTop: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  button: {
    width: width * 0.4,
    height: 55,
    justifyContent: "center",
    backgroundColor: "#F1DEC9",
    borderWidth: 2,
    borderColor: "#F1DEC9",
    alignItems: "center",
    // marginHorizontal: 5,
    marginVertical: -10,
    borderRadius: 15,
    alignSelf: "center",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.25)",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonText: {
    fontSize: 24,
    color: "#AD8E70",
  },
  sliderContainer: {
    height: 400,
    marginBottom: 10,
  },
  sliderDot: {
    display: "none",
  },
  sliderActiveDot: {
    display: "none",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: 350,
  },
  card: {
    borderRadius: 8,
    overflow: "hidden",
  },
  cardContainer: {
    borderRadius: 8,
    overflow: "hidden",
    height: 400,
    backgroundColor: "#F2E3DB",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  overlayText: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 2,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F2E3DB",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  pageTitle: {
    color: "#AD8E70",
    fontSize: 36,
    fontWeight: "bold",
    padding: 10,
 
  },
  textButton: {
    fontSize: 24,
    color: "#AD8E70",
  },
  buttonContainer: {
    alignItems: "flex-start",
    padding: 10,
  },
  filterButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dropdownContainerFilter: {
    borderRadius: 4,
    justifyContent: "center",
    height: 40,
    width: 200,
  },

  dropdownContainer: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
  dropdownStyle: {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "black",
    paddingVertical: 10,
    textAlign: "center",
  },
//   deletebutton:{
//     flexDirection:'row',
// textAlign: "center",
// }
});

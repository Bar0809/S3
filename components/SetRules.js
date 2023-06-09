import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert, Dimensions, Image
} from "react-native";
import { FontAwesome5 } from '@expo/vector-icons'; 

import { Entypo } from "@expo/vector-icons";
import { collection, query, where, getDocs , doc, updateDoc} from "firebase/firestore";
import { db, auth } from "./firebase";
import Navbar from './Navbar';

const { width } = Dimensions.get("window");


const SetRules = () => {
  const [appearancesPercentage, setAppearancesPercentage] = useState([]);
  const [appearancesIsEditMode, setAppearancesIsEditMode] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [dietPercentage, setDietPercentage] = useState([]);
  const [dietIsEditMode, setDietIsEditMode] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [friendStatusPercentage, setFriendStatusPercentage] = useState([]);
  const [friendStatusIsEditMode, setFriendStatusIsEditMode] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [moodPercentage, setMoodPercentage] = useState([]);
  const [moodIsEditMode, setMoodIsEditMode] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [presencePercentage, setPresencePercentage] = useState([]);
  const [presenceIsEditMode, setPresenceIsEditMode] = useState([
    [false, false, false, false, false, false],
  ]);
  const [eventsPercentage, setEventsPercentage] = useState([]);
  const [eventsIsEditMode, setEventsIsEditMode] = useState([false, false]);
  const [green, setGreen] = useState(false);
  const [orange, setOrange] = useState(false);
  const [red, setRed] = useState(false);
  
  
  useEffect(() => {
    const getValues = async () => {

      const q = query(
        collection(db, "TrafficLights"),
        where("t_id", "==", auth.currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];
  
      if (doc.exists()) {
        const docData = doc.data();
  
        const appearancesData = [
          docData.G_appearances_p,
          docData.G_appearances_n,
          docData.O_appearances_p,
          docData.O_appearances_n
        ];
        setAppearancesPercentage(appearancesData);
  
        const dietData = [
          docData.G_diet_p,
          docData.G_diet_n,
          docData.O_diet_p,
          docData.O_diet_n
        ];
        setDietPercentage(dietData);
  
        const presenceData = [
          docData.G_presence,
          docData.G_presence_late,
          docData.G_presence_absent,
          docData.O_presence,
          docData.O_presence_late,
          docData.O_presence_absent
        ];
        setPresencePercentage(presenceData);
  
        const eventsData = [docData.G_events, docData.O_events];
        setEventsPercentage(eventsData);
  
        const friendStatusData = [
          docData.G_friendStatus_p,
          docData.G_friendStatus_m,
          docData.G_friendStatus_n,
          docData.O_friendStatus_p,
          docData.O_friendStatus_m,
          docData.O_friendStatus_n
        ];
        setFriendStatusPercentage(friendStatusData);
        
        const moodData = [
          docData.G_mood_p,
          docData.G_mood_m,
          docData.G_mood_n,
          docData.O_mood_p,
          docData.O_mood_m,
          docData.O_mood_n
        ];
        setMoodPercentage(moodData);
      }
    };
  
    getValues();
  }, []);

  const handleUpdateData = async (category, light, type) => {
   
    if (category === "Appearances" && light === "green") {
      if (
        parseFloat(appearancesPercentage[0]) +
          parseFloat(appearancesPercentage[1]) >
        100
      ) {
        Alert.alert("שגיאה, הכנסת ערכים אשר ביחד גדולים מ100%");
        return;
      }

      const q = query(collection(db, "TrafficLights"), where("t_id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (type == "positive") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          G_appearances_p: appearancesPercentage[0],
        });
        setAppearancesIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = false;
          return newArray;
        });

      } else {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          G_appearances_n: appearancesPercentage[1],
        });
        setAppearancesIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = false;
          return newArray;
        });
      }
    } 
    else if (category === "Appearances" && light === "orange") {
      if (
        parseFloat(appearancesPercentage[2]) +
          parseFloat(appearancesPercentage[3]) >
        100
      ) {
        Alert.alert("שגיאה, הכנסת ערכים אשר ביחד גדולים מ100%");
        return;
      }

      const q = query(collection(db, "TrafficLights"), where("t_id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (type == "positive") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          O_appearances_p: appearancesPercentage[2],
        });
        setAppearancesIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[2] = false;
          return newArray;
        });
      } else {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          O_appearances_n: appearancesPercentage[3],
        });
        setAppearancesIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[3] = false;
          return newArray;
        });
      }
    } 
    else if (category === "Diet" && light === "green") {
      if (parseFloat(dietPercentage[0]) + parseFloat(dietPercentage[1]) > 100) {
        Alert.alert("שגיאה, הכנסת ערכים אשר ביחד גדולים מ100%");
        return;
      }

      const q = query(collection(db, "TrafficLights"), where("t_id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (type == "positive") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          G_diet_p: dietPercentage[0],
        });
        setDietIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = false;
          return newArray;
        });
      } else {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          G_diet_n: dietPercentage[1],
        });
        setDietIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = false;
          return newArray;
        });
      }
    } 
    else if (category === "Diet" && light === "orange") {
      if (parseFloat(dietPercentage[2]) + parseFloat(dietPercentage[3]) > 100) {
        Alert.alert("שגיאה, הכנסת ערכים אשר ביחד גדולים מ100%");
        return;
      }

      const q = query(collection(db, "TrafficLights"), where("t_id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (type == "positive") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          O_diet_p: dietPercentage[2],
        });
        setDietIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[2] = false;
          return newArray;
        });
      } else {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          O_diet_n: dietPercentage[3],
        });
        setDietIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[3] = false;
          return newArray;
        });
      }
    }
     else if (category === "Events" && light === "green") {      
      const q = query(collection(db, "TrafficLights"), where("t_id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
     
        const _ref = querySnapshot.docs[0].ref;

        await updateDoc(_ref, {
          G_events: eventsPercentage[0],
        });

        setEventsIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = false;
          return newArray;
        });
    }
     else if (category === "Events" && light === "orange") {
      const q = query(collection(db, "TrafficLights"), where("t_id", "==", auth.currentUser.uid));
const querySnapshot = await getDocs(q);

        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          O_events: eventsPercentage[1],
        });

        setEventsIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = false;
          return newArray;
        });
      
    } 
    else if (category === "Presence" && light === "green") {
      if (
        parseFloat(presencePercentage[0]) +
          parseFloat(presencePercentage[1]) +
          parseFloat(presencePercentage[2]) >
        100
      ) {
      
        Alert.alert("שגיאה, הכנסת ערכים אשר ביחד גדולים מ100%");
        return;
      }

      const q = query(collection(db, "TrafficLights"), where("t_id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (type == "presence") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          G_presence: presencePercentage[0],
        });
        setPresenceIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = false;
          return newArray;
        });
      } else if (type == "late") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          G_presence_late: presencePercentage[1],
        });
        setPresenceIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = false;
          return newArray;
        });
      } else {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          G_presence_absent:  presencePercentage[2],
        });
        setPresenceIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[2] = false;
          return newArray;
        });
      }
    }
     else if (category === "Presence" && light === "orange") {
      if (
        parseFloat(presencePercentage[3]) +
          parseFloat(appearancesPercentage[4]) +
          parseFloat(appearancesPercentage[5]) >
        100
      ) {
        Alert.alert("שגיאה, הכנסת ערכים אשר ביחד גדולים מ100%");
        return;
      }

      const q = query(collection(db, "TrafficLights"), where("t_id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (type == "presence") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          O_presence: presencePercentage[3],
        });
        setPresenceIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[3] = false;
          return newArray;
        });
      } else if (type == "late") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          O_presence_late: presencePercentage[4],
        });
        setPresenceIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[4] = false;
          return newArray;
        });
      }
       else {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          O_presence_absent: presencePercentage[5],
        });
        setPresenceIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[5] = false;
          return newArray;
        });
      }
    }
     else if (category === "Mood" && light === "green") {
      if (
        parseFloat(moodPercentage[0]) +
          parseFloat(moodPercentage[1]) +
          parseFloat(moodPercentage[2]) >
        100
      ) {
        Alert.alert("שגיאה, הכנסת ערכים אשר ביחד גדולים מ100%");
        return;
      }

     const q = query(collection(db, "TrafficLights"), where("t_id", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

      if (type == "positive") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          G_mood_p: moodPercentage[0],
        });
        setMoodIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = false;
          return newArray;
        });
      } else if (type == "meduim") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          G_mood_m: moodPercentage[1],
        });
        setMoodIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = false;
          return newArray;
        });
      } else if (type == "negative") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          G_mood_n: moodPercentage[2],
        });
        setMoodIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[2] = false;
          return newArray;
        });
      }
    } 
    else if (category === "Mood" && light === "orange") {
      if (
        parseFloat(moodPercentage[3]) +
          parseFloat(moodPercentage[4]) +
          parseFloat(moodPercentage[5]) >
        100
      ) {
        Alert.alert("שגיאה, הכנסת ערכים אשר ביחד גדולים מ100%");
        return;
      }
      const q = query(collection(db, "TrafficLights"), where("t_id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (type == "positive") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          O_mood_p: moodPercentage[3],
        });
        setMoodIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[3] = false;
          return newArray;
        });
      } else if (type == "meduim") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          O_mood_m: moodPercentage[4],
        });
        setMoodIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[4] = false;
          return newArray;
        });
      } else {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          O_mood_n: moodPercentage[5],
        });
        setMoodIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[5] = false;
          return newArray;
        });
      }
    } 
    else if (category === "FriendStatus" && light === "green") {
      if (
        parseFloat(friendStatusPercentage[0]) +
          parseFloat(friendStatusPercentage[1]) +
          parseFloat(friendStatusPercentage[2]) >
        100
      ) {
        Alert.alert("שגיאה, הכנסת ערכים אשר ביחד גדולים מ100%");
        return;
      }

    const q = query(collection(db, "TrafficLights"), where("t_id", "==", auth.currentUser.uid));
const querySnapshot = await getDocs(q);

      if (type == "positive") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          G_friendStatus_p: friendStatusPercentage[0],
        });
        setFriendStatusIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = false;
          return newArray;
        });
      } else if (type == "meduim") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          G_friendStatus_m: friendStatusPercentage[1],
        });
        setFriendStatusIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = false;
          return newArray;
        });
      } else {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          G_friendStatus_n: friendStatusPercentage[2],
        });
        setFriendStatusIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[2] = false;
          return newArray;
        });
      }
    } 
    else if (category === "FriendStatus" && light === "orange") {
      if (
        parseFloat(friendStatusPercentage[3]) +
          parseFloat(friendStatusPercentage[4]) +
          parseFloat(friendStatusPercentage[5]) >
        100
      ) {
        Alert.alert("שגיאה, הכנסת ערכים אשר ביחד גדולים מ100%");
        return;
      }

      const q = query(collection(db, "TrafficLights"), where("t_id", "==", auth.currentUser.uid));
const querySnapshot = await getDocs(q);
      if (type == "positive") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          O_friendStatus_p: friendStatusPercentage[3],
        });
        setFriendStatusIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[3] = false;
          return newArray;
        });
      } else if (type == "meduim") {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          O_friendStatus_m: friendStatusPercentage[4],
        });
        setFriendStatusIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[4] = false;
          return newArray;
        });
      } else {
        const _ref = querySnapshot.docs[0].ref;
        await updateDoc(_ref, {
          O_friendStatus_n: friendStatusPercentage[5],
        });
        setFriendStatusIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[5] = false;
          return newArray;
        });
      }
    }
  };

  const handlePercentageChange = (inputText, category, light, type) => {
    if (inputText === '') {
      Alert.alert("לא הוכנס ערך");
      return;
    }
    
    const cleanedText = inputText.replace(/[^0-9.%]/g, "");
    const percentage = parseInt(cleanedText, 10);
  
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      Alert.alert("הוכנס ערך לא תקין");
      return;
    }
  
    if (category === "Appearances" && light === "green") {
      if (type === "positive") {
        setAppearancesPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = cleanedText;
          return newArray;
        });
      } else {
        setAppearancesPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = cleanedText;
          return newArray;
        });
      }
    } 
    
    else if (category === "Appearances" && light === "orange") {
      if (type == "positive") {
        setAppearancesPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[2] = cleanedText;
          return newArray;
        });
      } else {
        setAppearancesPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[3] = cleanedText;
          return newArray;
        });
      }
    } else if (category === "Diet" && light === "green") {
      if (type == "positive") {
        setDietPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = cleanedText;
          return newArray;
        });
      } else {
        setDietPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = cleanedText;
          return newArray;
        });
      }
    } else if (category === "Diet" && light === "orange") {
      if (type == "positive") {
        setDietPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[2] = cleanedText;
          return newArray;
        });
      } else {
        setDietPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[3] = cleanedText;
          return newArray;
        });
      }
    } else if (category === "Events" && light === "green") {
      setEventsPercentage((prevArray) => {
        const newArray = [...prevArray];
        newArray[0] = cleanedText;
        return newArray;
      });
    } else if (category === "Events" && light === "orange") {
      setEventsPercentage((prevArray) => {
        const newArray = [...prevArray];
        newArray[1] = cleanedText;
        return newArray;
      });
    } else if (category === "FriendStatus" && light === "green") {
      if (type === "positive") {
        setFriendStatusPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = cleanedText;
          return newArray;
        });
      }
      if (type === "meduim") {
        setFriendStatusPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = cleanedText;
          return newArray;
        });
      } else {
        setAppearancesPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[2] = cleanedText;
          return newArray;
        });
      }
    } else if (category === "FriendStatus" && light === "orange") {
      if (type === "positive") {
        setFriendStatusPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[3] = cleanedText;
          return newArray;
        });
      }
      if (type === "meduim") {
        setFriendStatusPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[4] = cleanedText;
          return newArray;
        });
      } else {
        setFriendStatusPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[5] = cleanedText;
          return newArray;
        });
      }
    } else if (category === "Mood" && light === "green") {
      if (type === "positive") {
        setMoodPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = cleanedText;
          return newArray;
        });
      }
      if (type === "meduim") {
        setMoodPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = cleanedText;
          return newArray;
        });
      } else {
        setMoodPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[2] = cleanedText;
          return newArray;
        });
      }
    } else if (category === "Mood" && light === "orange") {
      if (type === "positive") {
        setMoodPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[3] = cleanedText;
          return newArray;
        });
      }
      if (type === "meduim") {
        setMoodPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[4] = cleanedText;
          return newArray;
        });
      } else {
        setMoodPercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[5] = cleanedText;
          return newArray;
        });
      }
    } else if (category === "Presence" && light === "green") {
      if (type === "presence") {
        setPresencePercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = cleanedText;
          return newArray;
        });
      }
      if (type === "late") {
        setPresencePercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = cleanedText;
          return newArray;
        });
      } else {
        setPresencePercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[2] = cleanedText;
          return newArray;
        });
      }
    } else if (category === "Presence" && light === "orange") {
      if (type === "presence") {
        setPresencePercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[3] = cleanedText;
          return newArray;
        });
      }
      if (type == "late") {
        setPresencePercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[4] = cleanedText;
          return newArray;
        });
      } else {
        setPresencePercentage((prevArray) => {
          const newArray = [...prevArray];
          newArray[5] = cleanedText;
          return newArray;
        });
      }
    }
  };

  const handleEditOrange = () =>{
    // Alert.alert("עלייך לשנות את הנתון באיזור הכתום ")
  }
  const handleEdit = (category, light, type) => {
    if (category === "Appearances" && light === "green") {
      if (type === "positive") {
        setAppearancesIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = true;
          return newArray;
        });
      } else {
        setAppearancesIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = true;
          return newArray;
        });
      }
    }
     else if (category === "Appearances" && light === "orange") {
      if (type === "positive") {
        setAppearancesIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[2] = true;
          return newArray;
        });
      } else {
        setAppearancesIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[3] = true;
          return newArray;
        });
      }
    }
     else if (category === "Diet" && light === "green") {
      if (type === "positive") {
        setDietIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = true;
          return newArray;
        });
      } else {
        setDietIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = true;
          return newArray;
        });
      }
    } 
    else if (category === "Diet" && light === "orange") {

      if (type === "positive") {
        setDietIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[2] = true;
          return newArray;
        });
      } else {
        setDietIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[3] = true;
          return newArray;
        });
      }
    } 
    else if (category === "Events" && light === "green") {
      setEventsIsEditMode((prevArray) => {
        const newArray = [...prevArray];
        newArray[0] = true;
        return newArray;
      });
    } 
    else if (category === "Events" && light === "orange") {
      setEventsIsEditMode((prevArray) => {
        const newArray = [...prevArray];
        newArray[1] = true;
        return newArray;
      });
    } 
    else if (category === "FriendStatus" && light === "green") {
      if (type === "positive") {
        setFriendStatusIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = true;
          return newArray;
        });
      }
      else if (type === "meduim") {
        setFriendStatusIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = true;
          return newArray;
        });
      }       else if (type === "negative") {

        setFriendStatusIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[2] = true;
          return newArray;
        });
      }
    } 
    else if (category === "FriendStatus" && light === "orange") {
      if (type === "positive") {
        setFriendStatusIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[3] = true;
          return newArray;
        });
      }
      else if (type === "meduim") {
        setFriendStatusIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[4] = true;
          return newArray;
        });
      }
      else if (type === "negative") {
        setFriendStatusIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[5] = true;
          return newArray;
        });
      }
    } 
    else if (category === "Mood" && light === "green") {
      if (type === "positive") {
        setMoodIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = true;
          return newArray;
        });
      }
      else if (type === "meduim") {
        setMoodIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = true;
          return newArray;
        });
      } 
      
      else if (type === "negative") {
          setMoodIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[2] = true;
          return newArray;
        });
      }
    } 
    else if (category === "Mood" && light === "orange") {
      if (type === "positive") {
        setMoodIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[3] = true;
          return newArray;
        });
      }
      else if (type === "meduim") {
        setMoodIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[4] = true;
          return newArray;
        });
      } else if (type === "negative") {
        setMoodIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[5] = true;
          return newArray;
        });
      }
    } 
    else if (category === "Presence" && light === "green") {
      if (type === "presence") {
        setPresenceIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[0] = true;
          return newArray;
        });
      }
      else if (type === "late") {
        setPresenceIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[1] = true;
          return newArray;
        });
      } 
      else if(type === "absent") {
        setPresenceIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[2] = true;
          return newArray;
        });
      }
    } 
    else if (category === "Presence" && light === "orange") {
      if (type === "presence") {
        setPresenceIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[3] = true;
          return newArray;
        });
      }
      if (type === "late") {
        setPresenceIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[4] = true;
          return newArray;
        });
      } 
      else if (type === "absent") {
        setPresenceIsEditMode((prevArray) => {
          const newArray = [...prevArray];
          newArray[5] = true;
          return newArray;
        });
      }
    }
  };

  const toggleGreen = () => {
    setGreen((prevValue) => !prevValue);
  };

  const toggleOrange = () => {
    setOrange((prevValue) => !prevValue);
  };
  const toggleRed = () => {
    setRed((prevValue) => !prevValue);
  };

  return (
<View style={styles.container}>
      <View>
        <Image source={require("../assets/miniLogo-removebg-preview.png")} />
      </View>

      <View style={styles.title}>

        <Text style={[styles.pageTitle, { textAlign: "center" }]}>
        הגדרת תנאי הרמזור: 
        </Text>
</View>

        <Text style={[styles.pageTitle, { textAlign: "center" , fontSize:30,textDecorationLine:'underline'}]}>
         אז מה זה בעצם הרמזור? </Text>
      
       <Text>
          כל כיתה תקבל צבע מתוך צבעי הרמזור - ירוק, כתום או אדום בהתאם לדיווחים
          שדווחו על ידך בשבועיים האחרונים.{"\n"}
          כל אחת מהקטגוריות לדיווח תקבל צבע של רמזור לפי המוגדר מטה, הצבע של הכיתה יקבע לפי ממוצע צבעי הקטגוריות!
        </Text>
                <Text style={[styles.pageTitle, { textAlign: "center" , fontSize:24,textDecorationLine:'underline'}]}>הגדרת הרמזור:</Text>

      <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
      

<TouchableOpacity onPress={toggleGreen}>
          <Text style={[{ textAlign: 'center', textDecorationLine: 'underline', fontSize:20 , color:'green' }]}>איזור הירוק: </Text>
        </TouchableOpacity>
        {green && (
          <View style={{alignItems:'center' , textAlign:'center'}}> 
            <View>
              <Text style={{fontWeight:'bold', fontSize:18}}>קטגוריית נראות: </Text>
              <Entypo name="emoji-happy" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
              {appearancesIsEditMode[0] ? (
                <View style={styles.editModeContainer}>

                  <TextInput
                    value={appearancesPercentage[0]}
                    onChangeText={(text) =>
                      handlePercentageChange(
                        text,
                        "Appearances",
                        "green",
                        "positive"
                      )
                    }
                    keyboardType="numeric"
                    placeholder="הכנס/י אחוז מינמלי לדיווחים חיוביים"
                    style={styles.textInput}
                  />

                  <TouchableOpacity
                    onPress={() =>
                      handleUpdateData("Appearances", "green", "positive")
                    }
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>עדכן</Text>
                  </TouchableOpacity>
                </View>

              ) : (
                <View style={styles.viewModeContainer}>
                  <Text style={styles.percentageText}>
                    {appearancesPercentage[0]}% - 100%
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      handleEdit("Appearances", "green", "positive")
                    }
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>ערוך</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Entypo name="emoji-sad" size={24} color="black"  style={{textAlign:'center', alignItems:'center' }}/>
              {appearancesIsEditMode[1] ? (
                <View style={styles.editModeContainer}>
                  <TextInput
                    value={appearancesPercentage[1]}
                    onChangeText={(text) =>
                      handlePercentageChange(
                        text,
                        "Appearances",
                        "green",
                        "nagetive"
                      )
                    }
                    keyboardType="numeric"
                    placeholder="הכנס/י אחוז מקסימלי לדיווחים שליליים"
                    style={styles.textInput}
                  />

                  <TouchableOpacity
                    onPress={() =>
                      handleUpdateData("Appearances", "green", "nagetive")
                    }
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>עדכן</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.viewModeContainer}>
                  <Text style={styles.percentageText}>
                    0% - {appearancesPercentage[1]}%
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      handleEdit("Appearances", "green", "nagetive")
                    }
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>ערוך</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View>
              <Text style={{fontWeight:'bold', fontSize:18}}>קטגוריית תזונה: </Text>
              <Entypo name="emoji-happy" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
              {dietIsEditMode[0] ? (
                <View style={styles.editModeContainer}>
                  <TextInput
                    value={dietPercentage[0]}
                    onChangeText={(text) =>
                      handlePercentageChange(text, "Diet", "green", "positive")
                    }
                    keyboardType="numeric"
                    placeholder="הכנס/י אחוז מינמלי לדיווחים חיוביים"
                    style={styles.textInput}
                  />

                  <TouchableOpacity
                    onPress={() => handleUpdateData("Diet", "green", "positive")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>עדכן</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.viewModeContainer}>
                  <Text style={styles.percentageText}>
                    {dietPercentage[0]}% - 100%
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleEdit("Diet", "green", "positive")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>ערוך</Text>
                  </TouchableOpacity>
                </View>
              )}


              <Entypo name="emoji-sad" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
              {dietIsEditMode[1] ? (
                <View style={styles.editModeContainer}>
                  <TextInput
                    value={dietPercentage[1]}
                    onChangeText={(text) =>
                      handlePercentageChange(text, "Diet", "green", "negative")
                    }
                    keyboardType="numeric"
                    placeholder="הכנס/י אחוז מקסימלי לדיווחים שליליים"
                    style={styles.textInput}
                  />

                  <TouchableOpacity
                    onPress={() => handleUpdateData("Diet", "green", "negative")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>עדכן</Text>
                  </TouchableOpacity>
                </View>
              ) : (
<View style={styles.viewModeContainer}>
                    <Text style={styles.percentageText}>
                    0% - {dietPercentage[1]}%
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleEdit("Diet", "green", "negative")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>ערוך</Text>
                  </TouchableOpacity>
                </View>
              )}

            </View>

            <View>
              <Text style={{fontWeight:'bold', fontSize:18}}>קטגוריית מצב נפשי: </Text>
              <Entypo name="emoji-happy" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
              {moodIsEditMode[0] ? (
                <View style={styles.editModeContainer}>
                  <TextInput
                    value={moodPercentage[0]}
                    onChangeText={(text) =>
                      handlePercentageChange(text, "Mood", "green", "positive")
                    }
                    keyboardType="numeric"
                    placeholder="הכנס/י אחוז מינמלי לדיווחים חיוביים"
                    style={styles.textInput}
                  />

                  <TouchableOpacity
                    onPress={() => handleUpdateData("Mood", "green", "positive")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>עדכן</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.viewModeContainer}>
                  <Text style={styles.percentageText}>
                    {moodPercentage[0]}% - 100%
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleEdit("Mood", "green", "positive")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>ערוך</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Entypo name="emoji-neutral" size={24} color="black" style={{textAlign:'center', alignItems:'center' }}/>
              {moodIsEditMode[1] ? (
                <View style={styles.editModeContainer}>
                  <TextInput
                    value={moodPercentage[1]}
                    onChangeText={(text) =>
                      handlePercentageChange(text, "Mood", "green", "meduim")
                    }
                    keyboardType="numeric"
                    placeholder="הכנס/י אחוז מקסימלי לדיווחים נטרליים"
                    style={styles.textInput}
                  />

                  <TouchableOpacity
                    onPress={() => handleUpdateData("Mood", "green", "meduim")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>עדכן</Text>
                  </TouchableOpacity>
                </View>
              ) : (
        <View style={styles.viewModeContainer}>
                    <Text style={styles.percentageText}>
                    0% - {moodPercentage[1]}%
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleEdit("Mood", "green", "meduim")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>ערוך</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Entypo name="emoji-sad" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
              {moodIsEditMode[2] ? (
                <View style={styles.editModeContainer}>
                  <TextInput
                    value={moodPercentage[2]}
                    onChangeText={(text) =>
                      handlePercentageChange(text, "Mood", "green", "negative")
                    }
                    keyboardType="numeric"
                    placeholder="הכנס/י אחוז מקסימלי לדיווחים שליליים"
                    style={styles.textInput}
                  />

                  <TouchableOpacity
                    onPress={() => handleUpdateData("Mood", "green", "negative")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>עדכן</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.viewModeContainer}>
                  <Text style={styles.percentageText}>
                    0% - {moodPercentage[2]}%
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleEdit("Mood", "green", "negative")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>ערוך</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View>
              <Text style={{fontWeight:'bold', fontSize:18}}>קטגוריית מצב חברתי: </Text>
              <Entypo name="emoji-happy" size={24} color="black" style={{textAlign:'center', alignItems:'center' }}/>
              {friendStatusIsEditMode[0] ? (
                <View style={styles.editModeContainer}>
                  <TextInput
                    value={friendStatusPercentage[0]}
                    onChangeText={(text) =>
                      handlePercentageChange(
                        text,
                        "FriendStatus",
                        "green",
                        "positive"
                      )
                    }
                    keyboardType="numeric"
                    placeholder="הכנס/י אחוז מינמלי לדיווחים חיוביים"
                    style={styles.textInput}
                  />

                  <TouchableOpacity
                    onPress={() =>
                      handleUpdateData("FriendStatus", "green", "positive")
                    }
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>עדכן</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.viewModeContainer}>
                  <Text style={styles.percentageText}>
                    {friendStatusPercentage[0]}% - 100%
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      handleEdit("FriendStatus", "green", "positive")
                    }
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>ערוך</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Entypo name="emoji-neutral" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
              {friendStatusIsEditMode[1] ? (
                <View style={styles.editModeContainer}>
                  <TextInput
                    value={friendStatusPercentage[1]}
                    onChangeText={(text) =>
                      handlePercentageChange(
                        text,
                        "FriendStatus",
                        "green",
                        "meduim"
                      )
                    }
                    keyboardType="numeric"
                    placeholder="הכנס/י אחוז מקסימלי לדיווחים נטרליים"
                    style={styles.textInput}
                  />

                  <TouchableOpacity
                    onPress={() =>
                      handleUpdateData("FriendStatus", "green", "meduim")
                    }
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>עדכן</Text>
                  </TouchableOpacity>
                </View>
              ) : (
<View style={styles.viewModeContainer}>
                    <Text style={styles.percentageText}>
                    0% - {friendStatusPercentage[1]}%
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      handleEdit("FriendStatus", "green", "meduim")
                    }
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>ערוך</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Entypo name="emoji-sad" size={24} color="black"  style={{textAlign:'center', alignItems:'center' }}/>
              {friendStatusIsEditMode[2] ? (
                <View style={styles.editModeContainer}>
                  <TextInput
                    value={friendStatusPercentage[2]}
                    onChangeText={(text) =>
                      handlePercentageChange(
                        text,
                        "FriendStatus",
                        "green",
                        "negative"
                      )
                    }
                    keyboardType="numeric"
                    placeholder="הכנס/י אחוז מקסימלי לדיווחים שליליים"
                    style={styles.textInput}
                  />

                  <TouchableOpacity
                    onPress={() =>
                      handleUpdateData("FriendStatus", "green", "negative")
                    }
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>עדכן</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.viewModeContainer}>
                  <Text style={styles.percentageText}>
                    0% - {friendStatusPercentage[2]}%
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      handleEdit("FriendStatus", "green", "negative")
                    }
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>ערוך</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View>
              <Text style={{fontWeight:'bold', fontSize:18}}> קטגוריית נוכחות:</Text>
              <Text style={{textAlign:'center', alignItems:'center' }}> נוכחות</Text>
              {presenceIsEditMode[0] ? (
                <View style={styles.editModeContainer}>
                  <TextInput
                    value={presencePercentage[0]}
                    onChangeText={(text) =>
                      handlePercentageChange(
                        text,
                        "Presence",
                        "green",
                        "presence"
                      )
                    }
                    keyboardType="numeric"
                    placeholder="הכנס את אחוז הנוכחות המינימלי"
                    style={styles.textInput}
                  />

                  <TouchableOpacity
                    onPress={() =>
                      handleUpdateData("Presence", "green", "presence")
                    }
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>ערוך</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.viewModeContainer}>
                  <Text style={styles.percentageText}>
                    100 - {presencePercentage[0]}%
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleEdit("Presence", "green", "presence")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>עדכן</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text style={{textAlign:'center', alignItems:'center' }}> איחורים</Text>
              {presenceIsEditMode[1] ? (
                <View style={styles.editModeContainer}>
                  <TextInput
                    value={presencePercentage[1]}
                    onChangeText={(text) =>
                      handlePercentageChange(text, "Presence", "green", "late")
                    }
                    keyboardType="numeric"
                    placeholder="הכנס את אחוז האיחורים המקסימלי"
                    style={styles.textInput}
                  />

                  <TouchableOpacity
                    onPress={() => handleUpdateData("Presence", "green", "late")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>ערוך</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.viewModeContainer}>
                  <Text style={styles.percentageText}>
                    0% - {presencePercentage[1]}%
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleEdit("Presence", "green", "late")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>עדכן</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              <Text style={{textAlign:'center', alignItems:'center' }}> חיסורים</Text>
              {presenceIsEditMode[2] ? (
                <View style={styles.editModeContainer}>
                  <TextInput
                    value={presencePercentage[2]}
                    onChangeText={(text) =>
                      handlePercentageChange(
                        text,
                        "Presence",
                        "green",
                        "absent"
                      )
                    }
                    keyboardType="numeric"
                    placeholder="הכנס את אחוז החיסורים המקסימלי"
                    style={styles.textInput}
                  />

                  <TouchableOpacity
                    onPress={() => handleUpdateData("Presence", "green", "absent")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>ערוך</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.viewModeContainer}>
                  <Text style={styles.percentageText}>
                    0% - {presencePercentage[2]}%
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleEdit("Presence", "green", "absent")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>עדכן</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View>
              <Text style={{fontWeight:'bold', fontSize:18}}> קטגוריית אירועים שליליים:</Text>
              {eventsIsEditMode[0] ? (
                <View style={styles.editModeContainer}>
                  <TextInput
                    value={eventsPercentage[0]}
                    onChangeText={(text) =>
                      handlePercentageChange(text, "Events", "green", "")
                    }
                    keyboardType="numeric"
                    placeholder="הכנס מספר אירועים שליליים"
                    style={styles.textInput}
                  />

                  <TouchableOpacity
                    onPress={() => handleUpdateData("Events", "green", "")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>ערוך</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.viewModeContainer}>
                  <Text style={styles.percentageText}>
                    {eventsPercentage[0]}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleEdit("Events", "green", "")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>עדכן</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}

<TouchableOpacity onPress={toggleOrange}>
      <Text style={[{ textAlign: 'center', textDecorationLine: 'underline', fontSize:20 , color:'orange' }]}>איזור הכתום: </Text>
    </TouchableOpacity>
{orange && (
        <View>
        <View>
<Text style={{fontWeight:'bold', fontSize:18}}>קטגוריית נראות: </Text>
<Entypo name="emoji-happy" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
{appearancesIsEditMode[2] ? (
  <View style={styles.editModeContainer}>
   <TextInput
  value={appearancesPercentage[2]}
  onChangeText={(text) => handlePercentageChange(text, "Appearances", 'orange' , 'positive')}
  keyboardType="numeric"
  placeholder="הכנס/י אחוז מינמלי לדיווחים חיוביים"
  style={styles.textInput}
/>

    <TouchableOpacity onPress={() => handleUpdateData("Appearances", 'orange' , 'positive')} style={styles.button}>
      <Text style={styles.buttonText}>עדכן</Text>
    </TouchableOpacity>

  </View>

  
) : (
  <View style={styles.viewModeContainer}>
    <Text style={styles.percentageText}>  {appearancesPercentage[0]}% -{appearancesPercentage[2]}% </Text>
    <TouchableOpacity onPress={() => handleEdit("Appearances" , 'orange' , 'positive')} style={styles.button}>
      <Text style={styles.buttonText}>ערוך</Text>
    </TouchableOpacity>

  </View>
)}
<Entypo name="emoji-sad" size={24} color="black"  style={{textAlign:'center', alignItems:'center' }}/>
{appearancesIsEditMode[3] ? (
  <View style={styles.editModeContainer}>  
    <TextInput
  value={appearancesPercentage[3]}
  onChangeText={(text) => handlePercentageChange(text, "Appearances", 'orange' , 'nagetive')}
  keyboardType="numeric"
  placeholder="הכנס/י אחוז מקסימלי לדיווחים שליליים"
  style={styles.textInput}
/>

    <TouchableOpacity onPress={() => handleUpdateData("Appearances",'orange' , 'nagetive')} style={styles.button}>
      <Text style={styles.buttonText}>עדכן</Text>
    </TouchableOpacity>

  </View>

  
) : (
  <View style={styles.viewModeContainer}>
     <Text style={styles.percentageText}>{appearancesPercentage[1]}% - {appearancesPercentage[3]}%</Text>
    <TouchableOpacity onPress={() => handleEdit("Appearances", 'orange' , 'nagetive')} style={styles.button}>
      <Text style={styles.buttonText}>ערוך</Text>
    </TouchableOpacity> 

  </View>
)}
</View>

<View>
<Text style={{fontWeight:'bold', fontSize:18}}>קטגוריית תזונה: </Text>
<Entypo name="emoji-happy" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
  {dietIsEditMode[2] ? (
  <View style={styles.editModeContainer}>
   <TextInput
  value={dietPercentage[2]}
  onChangeText={(text) => handlePercentageChange(text, "Diet", 'orange', 'positive')}
  keyboardType="numeric"
  placeholder="הכנס/י אחוז מינמלי לדיווחים חיוביים"
  style={styles.textInput}
/>

    <TouchableOpacity onPress={() => handleUpdateData("Diet", 'orange', 'positive')} style={styles.button}>
      <Text style={styles.buttonText}>עדכן</Text>
    </TouchableOpacity>
  </View>

  
) : (
  <View style={styles.viewModeContainer}>
    <Text style={styles.percentageText}> {dietPercentage[0]}% -{dietPercentage[2]}% </Text>
    <TouchableOpacity onPress={() => handleEdit("Diet", 'orange', 'positive')} style={styles.button}>
      <Text style={styles.buttonText}>ערוך</Text>
    </TouchableOpacity>

  </View>
)}
<Entypo name="emoji-sad" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
{dietIsEditMode[3] ? (
  <View style={styles.editModeContainer}>
    <TextInput
  value={dietPercentage[3]}
  onChangeText={(text) => handlePercentageChange(text, "Diet", 'orange', 'negative')}
  keyboardType="numeric"
  placeholder="הכנס/י אחוז מקסימלי לדיווחים שליליים"
  style={styles.textInput}
/>

    <TouchableOpacity onPress={() => handleUpdateData("Diet", 'orange', 'negative')} style={styles.button}>
      <Text style={styles.buttonText}>עדכן</Text>
    </TouchableOpacity>

  </View>

  
) : (  
<View style={styles.viewModeContainer}>
    <Text style={styles.percentageText}>{dietPercentage[1]}% - {dietPercentage[3]}%</Text>
    <TouchableOpacity onPress={() => handleEdit("Diet", 'orange', 'negative')} style={styles.button}>
      <Text style={styles.buttonText}>ערוך</Text>
    </TouchableOpacity>

 </View>
)}
</View>

<View>
<Text style={{fontWeight:'bold', fontSize:18}}>קטגוריית מצב נפשי: </Text>
<Entypo name="emoji-happy" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
  {moodIsEditMode[3] ? (
  <View style={styles.editModeContainer}>
   <TextInput
  value={moodPercentage[3]}
  onChangeText={(text) => handlePercentageChange(text, "Mood", 'orange', 'positive')}
  keyboardType="numeric"
  placeholder="הכנס/י אחוז מינמלי לדיווחים חיוביים"
  style={styles.textInput}
/>

    <TouchableOpacity onPress={() => handleUpdateData("Mood", 'orange', 'positive')} style={styles.button}>
      <Text style={styles.buttonText}>עדכן</Text>
    </TouchableOpacity>
  </View>

  
) : (
  <View style={styles.viewModeContainer}>
    <Text style={styles.percentageText}>{moodPercentage[0]}% - {moodPercentage[3]}%</Text>
    <TouchableOpacity onPress={() => handleEdit("Mood", 'orange', 'positive')} style={styles.button}>
      <Text style={styles.buttonText}>ערוך</Text>
    </TouchableOpacity>

  </View>
)}

<Entypo name="emoji-neutral" size={24} color="black" style={{textAlign:'center', alignItems:'center' }}/>
{moodIsEditMode[4] ? (
  <View style={styles.editModeContainer}>
    <TextInput
  value={moodPercentage[4]}
  onChangeText={(text) => handlePercentageChange(text, "Mood", 'orange', 'meduim')}
  keyboardType="numeric"
  placeholder="הכנס/י אחוז מקסימלי לדיווחים נטרליים"
  style={styles.textInput}
/>

    <TouchableOpacity onPress={() => handleUpdateData("Mood", 'orange', 'meduim')} style={styles.button}>
      <Text style={styles.buttonText}>עדכן</Text>
    </TouchableOpacity>
  </View>

) : (  
<View style={styles.viewModeContainer}>
    <Text style={styles.percentageText}> {moodPercentage[1]}% - {moodPercentage[4]}%</Text>
    <TouchableOpacity onPress={() => handleEdit("Mood", 'orange', 'meduim')} style={styles.button}>
      <Text style={styles.buttonText}>ערוך</Text>
    </TouchableOpacity>

 </View>
)}
<Entypo name="emoji-sad" size={24} color="black" style={{textAlign:'center', alignItems:'center' }}/>
{moodIsEditMode[5] ? (
  <View style={styles.editModeContainer}>
    <TextInput
  value={moodPercentage[5]}
  onChangeText={(text) => handlePercentageChange(text, "Mood", 'orange', 'negative')}
  keyboardType="numeric"
  placeholder="הכנס/י אחוז מקסימלי לדיווחים שליליים"
  style={styles.textInput}
/>

    <TouchableOpacity onPress={() => handleUpdateData("Mood", 'orange', 'negative')} style={styles.button}>
      <Text style={styles.buttonText}>עדכן</Text>
    </TouchableOpacity>

  </View>

  
) : (  
<View style={styles.viewModeContainer}>
    <Text style={styles.percentageText}>{moodPercentage[2]}%- {moodPercentage[5]}%</Text>
    <TouchableOpacity onPress={() => handleEdit("Mood", 'orange', 'negative')} style={styles.button}>
      <Text style={styles.buttonText}>ערוך</Text>
    </TouchableOpacity>

 </View>
)}
</View>

<View>
<Text style={{fontWeight:'bold', fontSize:18}}>קטגוריית מצב חברתי: </Text>
<Entypo name="emoji-happy" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
  {friendStatusIsEditMode[3] ? (
  <View style={styles.editModeContainer}>
   <TextInput
  value={friendStatusPercentage[3]}
  onChangeText={(text) => handlePercentageChange(text, "FriendStatus", 'orange', 'positive')}
  keyboardType="numeric"
  placeholder="הכנס/י אחוז מינמלי לדיווחים חיוביים"
  style={styles.textInput}
/>

    <TouchableOpacity onPress={() => handleUpdateData("FriendStatus", 'orange', 'positive')} style={styles.button}>
      <Text style={styles.buttonText}>עדכן</Text>
    </TouchableOpacity>
  </View>

  
) : (
  <View style={styles.viewModeContainer}>
    <Text style={styles.percentageText}>{friendStatusPercentage[0]}% - {friendStatusPercentage[3]}%</Text>
    <TouchableOpacity onPress={() => handleEdit("FriendStatus", 'orange', 'positive')} style={styles.button}>
      <Text style={styles.buttonText}>ערוך</Text>
    </TouchableOpacity>

  </View>
)}
<Entypo name="emoji-neutral" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
{friendStatusIsEditMode[4] ? (
  <View style={styles.editModeContainer}>
    <TextInput
  value={friendStatusPercentage[4]}
  onChangeText={(text) => handlePercentageChange(text, "FriendStatus", 'orange', 'meduim')}
  keyboardType="numeric"
  placeholder="הכנס/י אחוז מקסימלי לדיווחים נטרליים"
  style={styles.textInput}
/>

    <TouchableOpacity onPress={() => handleUpdateData("FriendStatus", 'orange', 'meduim')} style={styles.button}>
      <Text style={styles.buttonText}>עדכן</Text>
    </TouchableOpacity>

  </View>

  
) : (  
<View style={styles.viewModeContainer}>
      <Text style={styles.percentageText}> {friendStatusPercentage[1]}% -{friendStatusPercentage[4]}% </Text>
    <TouchableOpacity onPress={() => handleEdit("FriendStatus", 'orange', 'meduim')} style={styles.button}>
      <Text style={styles.buttonText}>ערוך</Text>
    </TouchableOpacity>

 </View>
)}
<Entypo name="emoji-sad" size={24} color="black" style={{textAlign:'center', alignItems:'center' }}/>
{friendStatusIsEditMode[5] ? (
  <View style={styles.editModeContainer}>
    <TextInput
  value={friendStatusPercentage[5]}
  onChangeText={(text) => handlePercentageChange(text, "FriendStatus", 'orange', 'negative')}
  keyboardType="numeric"
  placeholder="הכנס/י אחוז מקסימלי לדיווחים שליליים"
  style={styles.textInput}
/>

    <TouchableOpacity onPress={() => handleUpdateData("FriendStatus", 'orange', 'negative')} style={styles.button}>
      <Text style={styles.buttonText}>עדכן</Text>
    </TouchableOpacity>

  </View>

  
) : (  
<View style={styles.viewModeContainer}>
      <Text style={styles.percentageText}>{friendStatusPercentage[2]}% -{friendStatusPercentage[5]}%</Text>
    <TouchableOpacity onPress={() => handleEdit("FriendStatus", 'orange', 'negative')} style={styles.button}>
      <Text style={styles.buttonText}>ערוך</Text>
    </TouchableOpacity>

 </View>
)}
</View>

<View>
<Text style={{fontWeight:'bold', fontSize:18}}> קטגוריית נוכחות:</Text>
<Text style={{textAlign:'center', alignItems:'center' }}> נוכחות</Text>
{presenceIsEditMode[3] ? (
  <View style={styles.editModeContainer}>
   <TextInput
  value={presencePercentage[3]}
  onChangeText={(text) => handlePercentageChange(text, "Presence" , 'orange', 'presence')}
  keyboardType="numeric"
  placeholder="הכנס את אחוז הנוכחות המינימלי"
  style={styles.textInput}
/>

    <TouchableOpacity onPress={() => handleUpdateData("Presence" , 'orange', 'presence')} style={styles.button}>
      <Text style={styles.buttonText}>ערוך</Text>
    </TouchableOpacity>
  </View>
) : (
  <View style={styles.viewModeContainer}>
    <Text style={styles.percentageText}>{presencePercentage[0]}% - {presencePercentage[3]}%</Text>
    <TouchableOpacity onPress={() => handleEdit("Presence" , 'orange', 'presence')} style={styles.button}>
      <Text style={styles.buttonText}>עדכן</Text>
    </TouchableOpacity>
  </View>
)}

<Text style={{textAlign:'center', alignItems:'center' }}> איחורים</Text>
{presenceIsEditMode[4] ? (
  <View style={styles.editModeContainer}>
   <TextInput
  value={presencePercentage[4]}
  onChangeText={(text) => handlePercentageChange(text, "Presence" , 'orange', 'late')}
  keyboardType="numeric"
  placeholder="הכנס את אחוז האיחורים המקסימלי"
  style={styles.textInput}
/>

    <TouchableOpacity onPress={() => handleUpdateData("Presence" , 'orange', 'late')} style={styles.button}>
      <Text style={styles.buttonText}>ערוך</Text>
    </TouchableOpacity>
  </View>
) : (
  <View style={styles.viewModeContainer}>
    <Text style={styles.percentageText}> {presencePercentage[1]}%  - {presencePercentage[4]}% </Text>
    <TouchableOpacity onPress={() => handleEdit("Presence" , 'orange', 'late')} style={styles.button}>
      <Text style={styles.buttonText}>עדכן</Text>
    </TouchableOpacity>
  </View>
)}

<Text style={{textAlign:'center', alignItems:'center' }}> חיסורים</Text>
{presenceIsEditMode[5] ? (
  <View style={styles.editModeContainer}>
   <TextInput
  value={presencePercentage[5]}
  onChangeText={(text) => handlePercentageChange(text, "Presence" , 'orange', 'absent')}
  keyboardType="numeric"
  placeholder="הכנס את אחוז החיסורים המקסימלי"
  style={styles.textInput}
/>

    <TouchableOpacity onPress={() => handleUpdateData("Presence" , 'orange', 'absent')} style={styles.button}>
      <Text style={styles.buttonText}>ערוך</Text>
    </TouchableOpacity>
  </View>
) : (
  <View style={styles.viewModeContainer}>
    <Text style={styles.percentageText}> {presencePercentage[2]}% - {presencePercentage[5]}%</Text>
    <TouchableOpacity onPress={() => handleEdit("Presence" , 'orange', 'absent')} style={styles.button}>
      <Text style={styles.buttonText}>עדכן</Text>
    </TouchableOpacity>
  </View>
)}
</View>

<View>
<Text style={{fontWeight:'bold', fontSize:18}}> קטגוריית אירועים מיוחדים:</Text>
{eventsIsEditMode[1] ? (
    <View style={styles.inputButtonContainer}>
   <TextInput
  value={eventsPercentage[1]}
  onChangeText={(text) => handlePercentageChange(text, "Events", 'orange' , '')}
  keyboardType="numeric"
  placeholder="הכנס מספר אירועים שליליים"
  style={styles.textInput}
/>

    <TouchableOpacity onPress={() => handleUpdateData("Events", 'orange' , '')} style={styles.button}>
      <Text style={styles.buttonText}>ערוך</Text>
    </TouchableOpacity>
  </View>

) : (
  <View style={styles.viewModeContainer}>
    <Text style={styles.percentageText}>{eventsPercentage[1]}</Text>
    <TouchableOpacity onPress={() => handleEdit("Events" , 'orange' , '')} style={styles.button}>
      <Text style={styles.buttonText}>עדכן</Text>
    </TouchableOpacity>
  </View>
)}
</View>
      </View>
    )}
    
    <TouchableOpacity onPress={toggleRed}>
      <Text style={[{ textAlign: 'center', textDecorationLine: 'underline', fontSize:20 , color:'red' }]}>איזור האדום: </Text>
    </TouchableOpacity>

    {red && (
      <View>
        <Text style={[{ fontWeight: "bold" }]}>כדי לשנות את הערכים באיזור האדום, עליך לשנות את המידע באיזור הכתום </Text>
      <View>
    <Text style={{fontWeight:'bold', fontSize:18}}>קטגוריית נראות: </Text>
    <Entypo name="emoji-happy" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
<View style={styles.viewModeContainer}>
  <Text style={styles.percentageText}>  פחות מ-{appearancesPercentage[2]}% </Text>
</View>


<Entypo name="emoji-sad" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
<View style={styles.viewModeContainer}>
   <Text style={styles.percentageText}>יותר מ-  {appearancesPercentage[3]}%</Text>
</View>

</View>

<View>
<Text style={{fontWeight:'bold', fontSize:18}}>קטגוריית תזונה: </Text>
<Entypo name="emoji-happy" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
<View style={styles.viewModeContainer}>
  <Text style={styles.percentageText}>פחות מ- {dietPercentage[2]}% </Text>

</View>

<Entypo name="emoji-sad" size={24} color="black"  style={{textAlign:'center', alignItems:'center' }}/>
<View style={styles.viewModeContainer}>
  <Text style={styles.percentageText}>יותר מ- {dietPercentage[3]}%</Text>

</View>

</View>

<View>
<Text style={{fontWeight:'bold', fontSize:18}}>קטגוריית מצב נפשי: </Text>
<Entypo name="emoji-happy" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
<View style={styles.viewModeContainer}>
  <Text style={styles.percentageText}>פחות מ- {moodPercentage[3]}%</Text>


</View>


<Entypo name="emoji-neutral" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />

<View style={styles.viewModeContainer}>
  <Text style={styles.percentageText}> יותר מ- {moodPercentage[4]}%</Text>
 
</View>

<Entypo name="emoji-sad" size={24} color="black" style={{textAlign:'center', alignItems:'center' }} />
<View style={styles.viewModeContainer}>
  <Text style={styles.percentageText}>יותר מ- {moodPercentage[5]}%</Text>

</View>
</View>

<View>
<Text style={{fontWeight:'bold', fontSize:18}}>קטגוריית מצב חברתי: </Text>
<Entypo name="emoji-happy" size={24} color="black"  style={{textAlign:'center', alignItems:'center' }}/>

<View style={styles.viewModeContainer}>
  <Text style={styles.percentageText}>פחות מ- {friendStatusPercentage[3]}%</Text>
</View>

<Entypo name="emoji-neutral" size={24} color="black"  style={{textAlign:'center', alignItems:'center' }}/>
<View style={styles.viewModeContainer}>
    <Text style={styles.percentageText}> יותר מ- {friendStatusPercentage[4]}% </Text>


</View>

<Entypo name="emoji-sad" size={24} color="black" style={{textAlign:'center', alignItems:'center' }}/>

<View style={styles.viewModeContainer}>
    <Text style={styles.percentageText}>יותר מ- {friendStatusPercentage[5]}%</Text>


</View>
</View>

<View>
<Text style={{fontWeight:'bold', fontSize:18}}> קטגוריית נוכחות:</Text>
<Text style={{textAlign:'center', alignItems:'center' }}> נוכחות</Text>

<View style={styles.viewModeContainer}>
  <Text style={styles.percentageText}>פחות מ- {presencePercentage[3]}%</Text>
</View>


<Text style={{textAlign:'center', alignItems:'center' }}> איחורים</Text>

<View style={styles.viewModeContainer}>
  <Text style={styles.percentageText}> יותר מ- {presencePercentage[4]}% </Text>
</View>


<Text style={{textAlign:'center', alignItems:'center' }}> חיסורים</Text>

<View style={styles.viewModeContainer}>
  <Text style={styles.percentageText}> יותר מ- {presencePercentage[5]}%</Text>
  
</View>

</View>

<View>
<Text style={{fontWeight:'bold', fontSize:18}}> קטגוריית אירועים מיוחדים:</Text>

<View style={styles.viewModeContainer}>
  <Text style={styles.percentageText}> יותר מ-{eventsPercentage[1]}</Text>
 
</View>

</View>
    </View>
    )}
                <Text>{"\n\n\n\n\n\n"}</Text>

</ScrollView> 

<Text>{"\n\n\n\n\n\n"}</Text>

<Navbar/>
      </View>
 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2E3DB",
    alignItems: "center",
    justifyContent: "center",
  }, title: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  pageTitle: {
    color: "#AD8E70",
    fontSize: 36,
    fontWeight: "bold",
    padding: 10,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  subTitle: {
    fontSize: 20,
    textAlign: "right",
    fontWeight: "bold",
  },
  
  ruleTitle: {
    color: "green",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  editModeContainer: {
    width: width * 0.85,
    flexDirection: "row",
    alignItems: "center",
  },
  inputButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
  },
  viewModeContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.85,
textAlign:'center'

  },
  percentageText: {
    fontSize: 16,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
  },
  button: {
    width: width * 0.20,
    height: 45,
    justifyContent: 'center',
    backgroundColor: '#F1DEC9',
    borderWidth: 2,
    borderColor:'#F1DEC9',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 15,
    alignSelf: "center",
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.25)',
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
    fontSize: 20,
    color: '#AD8E70',
  },
});

export default SetRules;

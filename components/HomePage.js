import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
 Dimensions,
  Alert,
  Image,
} from "react-native";
import Navbar from './Navbar'
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  doc,
  where,
  updateDoc,
} from "firebase/firestore";

  const { width } = Dimensions.get('window');

const HomePage = () => {

  const navigation = useNavigation();
  const [myChoice1, setMyChoice1] = useState("");
  const [myChoice2, setMyChoice2] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [rules, SetRules] = useState([]);
  const [colors, setColors] = useState([
    "green",
    "green",
    "green",
    "green",
    "green",
    "green",
  ]);

  useEffect(() => {
    const fetchUserChoices = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("t_id", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          setMyChoice1(data.myChoice1);
          setMyChoice2(data.myChoice2);
        });
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
      }
    };

    fetchUserChoices();
    // check();
  }, []);

  // const check = async () => {
  //   const currentDate = new Date();
  //   const twoWeeksAgo = new Date();
  //   twoWeeksAgo.setDate(currentDate.getDate() - 14);

  //   const que = query(
  //     collection(db, "TrafficLights"),
  //     where("t_id", "==", auth.currentUser.uid)
  //   );
  //   const querySnap = await getDocs(que);
  //   const doc = querySnap.docs[0];

  //   if (doc.exists()) {
  //     SetRules(doc.data());
  //   } else {
  //     return;
  //   }

  //   const q = query(
  //     collection(db, "Classes"),
  //     where("t_id", "==", auth.currentUser.uid)
  //   );

  //   const querySnapshot = await getDocs(q);

  //   await Promise.all(
  //     querySnapshot.docs.map(async (doc) => {
  //       const classID = doc.id;
  //       const numOfStudents = doc.data().numOfStudents;

  //       // Presence Query
  //       const presenceQuery = query(
  //         collection(db, "Presence"),
  //         where("date", ">=", twoWeeksAgo),
  //         where("date", "<=", currentDate),
  //         where("t_id", "==", auth.currentUser.uid),
  //         where("class_id", "==", classID)
  //       );

  //       const presenceQuerySnapshot = await getDocs(presenceQuery);
  //       const days = presenceQuerySnapshot.size / numOfStudents;
  //       let presences = 0;
  //       let lates = 0;
  //       let absents = 0;

  //       presenceQuerySnapshot.forEach((doc) => {
  //         const presence = doc.data().presence;
  //         if (presence === "present") {
  //           presences += 1;
  //         } else if (presence === "late") {
  //           lates += 1;
  //         } else if (presence === "absent") {
  //           absents += 1;
  //         }
  //       });

  //       if (
  //         (presences * 100) / (numOfStudents * days) <=
  //         parseFloat(rules.G_presence)
  //       ) {
  //         if (
  //           presences / (numOfStudents * days) <
  //           parseFloat(rules.O_presence)
  //         ) {
  //           setColors((prevArray) => {
  //             console.log(1);
  //             const newArray = [...prevArray];
  //             newArray[0] = "red";
  //             return newArray;
  //           });
  //         } else {
  //           setColors((prevArray) => {
  //             const newArray = [...prevArray];
  //             newArray[0] = "orange";
  //             return newArray;
  //           });
  //         }
  //       } else {
  //         setColors((prevArray) => {
  //           const newArray = [...prevArray];
  //           newArray[0] = "green";
  //           return newArray;
  //         });
  //       }

  //       // Appearances Query
  //       const appearancesQuery = query(
  //         collection(db, "Appearances"),
  //         where("date", ">=", twoWeeksAgo),
  //         where("date", "<=", currentDate),
  //         where("t_id", "==", auth.currentUser.uid),
  //         where("class_id", "==", classID)
  //       );

  //       const appearancesQuerySnapshot = await getDocs(appearancesQuery);
  //       const appearancesdays = appearancesQuerySnapshot.size / numOfStudents;
  //       let goodReports = 0;
  //       let sadReports = 0;

  //       appearancesQuerySnapshot.forEach((doc) => {
  //         const appearances = doc.data().appearances;
  //         if (appearances === "good") {
  //           goodReports += 1;
  //         } else {
  //           sadReports += 1;
  //         }
  //       });

  //       if (
  //         (goodReports * 100) / (numOfStudents * appearancesdays) <=
  //         parseFloat(rules.G_appearances_p)
  //       ) {
  //         if (
  //           (goodReports * 100) / (numOfStudents * appearancesdays) <
  //           parseFloat(rules.O_appearances_p)
  //         ) {
  //           setColors((prevArray) => {
  //             const newArray = [...prevArray];
  //             newArray[1] = "red";
  //             return newArray;
  //           });
  //         } else {
  //           setColors((prevArray) => {
  //             const newArray = [...prevArray];
  //             newArray[1] = "orange";
  //             return newArray;
  //           });
  //         }
  //       } else {
  //         setColors((prevArray) => {
  //           const newArray = [...prevArray];
  //           newArray[1] = "green";
  //           return newArray;
  //         });
  //       }

  //       // Diet Query
  //       const dietQuery = query(
  //         collection(db, "Diet"),
  //         where("date", ">=", twoWeeksAgo),
  //         where("date", "<=", currentDate),
  //         where("t_id", "==", auth.currentUser.uid),
  //         where("class_id", "==", classID)
  //       );

  //       const dietQuerySnapshot = await getDocs(dietQuery);
  //       const dietDays = dietQuerySnapshot.size / numOfStudents;
  //       let goodDietReports = 0;
  //       let badDietReports = 0;

  //       dietQuerySnapshot.forEach((doc) => {
  //         const diet = doc.data().diet;
  //         if (diet === "good") {
  //           goodDietReports += 1;
  //         } else {
  //           badDietReports += 1;
  //         }
  //       });

  //       if (
  //         (goodDietReports * 100) / (numOfStudents * dietDays) <=
  //         parseFloat(rules.G_diet_p)
  //       ) {
  //         if (
  //           (goodDietReports * 100) / (numOfStudents * dietDays) <
  //           parseFloat(rules.O_diet_p)
  //         ) {
  //           setColors((prevArray) => {
  //             const newArray = [...prevArray];
  //             newArray[2] = "red";
  //             return newArray;
  //           });
  //         } else {
  //           setColors((prevArray) => {
  //             const newArray = [...prevArray];
  //             newArray[2] = "orange";
  //             return newArray;
  //           });
  //         }
  //       } else {
  //         setColors((prevArray) => {
  //           const newArray = [...prevArray];
  //           newArray[2] = "green";
  //           return newArray;
  //         });
  //       }

  //       // Mood Query
  //       const moodQuery = query(
  //         collection(db, "Mood"),
  //         where("date", ">=", twoWeeksAgo),
  //         where("date", "<=", currentDate),
  //         where("t_id", "==", auth.currentUser.uid),
  //         where("class_id", "==", classID)
  //       );

  //       const moodQuerySnapshot = await getDocs(moodQuery);
  //       const moodDays = moodQuerySnapshot.size / numOfStudents;
  //       let goodMoodReports = 0;
  //       let meduimMoodReports = 0;
  //       let badMoodReports = 0;

  //       moodQuerySnapshot.forEach((doc) => {
  //         const mood = doc.data().mood;
  //         if (mood === "good") {
  //           goodMoodReports += 1;
  //         } else if (mood === "meduim") {
  //           meduimMoodReports += 1;
  //         } else {
  //           badMoodReports += 1;
  //         }
  //       });

  //       if (
  //         (goodMoodReports * 100) / (numOfStudents * moodDays) <=
  //         parseFloat(rules.G_mood_p)
  //       ) {
  //         if (
  //           (goodMoodReports * 100) / (numOfStudents * moodDays) <
  //           parseFloat(rules.O_mood_p)
  //         ) {
  //           setColors((prevArray) => {
  //             const newArray = [...prevArray];
  //             newArray[3] = "red";
  //             return newArray;
  //           });
  //         } else {
  //           setColors((prevArray) => {
  //             const newArray = [...prevArray];
  //             newArray[3] = "orange";
  //             return newArray;
  //           });
  //         }
  //       } else {
  //         setColors((prevArray) => {
  //           const newArray = [...prevArray];
  //           newArray[3] = "green";
  //           return newArray;
  //         });
  //       }

  //       // friendStatus Query
  //       const friendStatusQuery = query(
  //         collection(db, "FriendStatus"),
  //         where("date", ">=", twoWeeksAgo),
  //         where("date", "<=", currentDate),
  //         where("t_id", "==", auth.currentUser.uid),
  //         where("class_id", "==", classID)
  //       );

  //       const friendStatusQuerySnapshot = await getDocs(friendStatusQuery);
  //       const friendStatusDays = friendStatusQuerySnapshot.size / numOfStudents;
  //       let goodFriendStatusReports = 0;
  //       let meduimFriendStatusReports = 0;
  //       let badFriendStatusReports = 0;

  //       moodQuerySnapshot.forEach((doc) => {
  //         const friendStatus = doc.data().friendStatus;
  //         if (friendStatus === "good") {
  //           goodFriendStatusReports += 1;
  //         } else if (friendStatus === "meduim") {
  //           meduimFriendStatusReports += 1;
  //         } else {
  //           badFriendStatusReports += 1;
  //         }
  //       });

  //       if (
  //         (goodFriendStatusReports * 100) /
  //           (numOfStudents * friendStatusDays) <=
  //         parseFloat(rules.G_friendStatus_p)
  //       ) {
  //         if (
  //           (goodFriendStatusReports * 100) /
  //             (numOfStudents * friendStatusDays) <
  //           parseFloat(rules.O_friendStatus_p)
  //         ) {
  //           setColors((prevArray) => {
  //             const newArray = [...prevArray];
  //             newArray[4] = "red";
  //             return newArray;
  //           });
  //         } else {
  //           setColors((prevArray) => {
  //             const newArray = [...prevArray];
  //             newArray[4] = "orange";
  //             return newArray;
  //           });
  //         }
  //       } else {
  //         setColors((prevArray) => {
  //           const newArray = [...prevArray];
  //           newArray[4] = "green";
  //           return newArray;
  //         });
  //       }

  //       // Events Query
  //       const eventsQuery = query(
  //         collection(db, "Events"),
  //         where("date", ">=", twoWeeksAgo),
  //         where("date", "<=", currentDate),
  //         where("t_id", "==", auth.currentUser.uid),
  //         where("class_id", "==", classID)
  //       );

  //       const eventsQueryQuerySnapshot = await getDocs(eventsQuery);
  //       const eventsQueryDays = eventsQueryQuerySnapshot.size / numOfStudents;
  //       let negativeEvents = 0;

  //       eventsQueryQuerySnapshot.forEach((doc) => {
  //         const type = doc.data().type;
  //         if (type === "negative") {
  //           negativeEvents += 1;
  //         }
  //       });

  //       if (negativeEvents <= parseFloat(rules.G_events)) {
  //         if (negativeEvents < parseFloat(rules.O_events)) {
  //           setColors((prevArray) => {
  //             const newArray = [...prevArray];
  //             newArray[5] = "red";
  //             return newArray;
  //           });
  //         } else {
  //           setColors((prevArray) => {
  //             const newArray = [...prevArray];
  //             newArray[5] = "orange";
  //             return newArray;
  //           });
  //         }
  //       } else {
  //         setColors((prevArray) => {
  //           const newArray = [...prevArray];
  //           newArray[5] = "green";
  //           return newArray;
  //         });
  //       }

  //       let R_arr = [];
  //       let O_arr = [];
  //       let greens = 0;
  //       let reds = 0;
  //       let oranges = 0;

  //       for (let i = 0; i < colors.length; i++) {
  //         if (colors[i] === "green") {
  //           greens++;
  //         } else if (colors[i] === "orange") {
  //           oranges++;
  //           if (colors[i] === 0) {
  //             O_arr.push("presence");
  //           } else if (colors[i] === 1) {
  //             O_arr.push("Appearances");
  //           } else if (colors[i] === 2) {
  //             O_arr.push("Diet");
  //           } else if (colors[i] === 3) {
  //             O_arr.push("Mood");
  //           } else if (colors[i] === 4) {
  //             O_arr.push("FriendStatus");
  //           } else {
  //             O_arr.push("Events");
  //           }
  //         } else {
  //           reds++;
  //           if (colors[i] === 0) {
  //             R_arr.push("presence");
  //           } else if (colors[i] === 1) {
  //             R_arr.push("Appearances");
  //           } else if (colors[i] === 2) {
  //             R_arr.push("Diet");
  //           } else if (colors[i] === 3) {
  //             R_arr.push("Mood");
  //           } else if (colors[i] === 4) {
  //             R_arr.push("FriendStatus");
  //           } else {
  //             R_arr.push("Events");
  //           }
  //         }
  //       }

  //       let color = "green";

  //       if (greens >= 3) {
  //         color = "green";
  //       }
  //       if (oranges >= 3) {
  //         color = "orange";
  //       }
  //       if (reds >= 3) {
  //         color = "red";
  //       }
  //       if (greens === 2 && oranges === 2) {
  //         color = "orange";
  //       }

  //       let orange_str = "";
  //       let red_str = "";

  //       for (let i = 0; i < O_arr.length; i++) {
  //         if (i === 0) {
  //           orange_str = "שים לב  הקטגוריות הבאות כתומות: ";
  //         }
  //         if (O_arr[i] === 0) {
  //           orange_str += " נוכחות";
  //         } else if (O_arr[i] === 1) {
  //           orange_str += " נראות";
  //         } else if (O_arr[i] === 2) {
  //           orange_str += " תזונה";
  //         } else if (O_arr[i] === 3) {
  //           orange_str += " מצב נפשי";
  //         } else if (O_arr[i] === 4) {
  //           orange_str += " מצב חברתי";
  //         } else {
  //           orange_str += " אירועים מיוחדים";
  //         }
  //       }

  //       console.log("orange_str" + " " + orange_str);
  //       for (let i = 0; i < R_arr.length; i++) {
  //         if (i === 0) {
  //           orange_str = "שים לב  הקטגוריות הבאות אדומות: ";
  //         }
  //         if (R_arr[i] === 0) {
  //           red_str += " נוכחות";
  //         } else if (R_arr[i] === 1) {
  //           red_str += " נראות";
  //         } else if (R_arr[i] === 2) {
  //           red_str += " תזונה";
  //         } else if (R_arr[i] === 3) {
  //           red_str += " מצב נפשי";
  //         } else if (R_arr[i] === 4) {
  //           red_str += " מצב חברתי";
  //         } else {
  //           red_str += " אירועים מיוחדים";
  //         }
  //       }

  //       red_str += ". ";
  //       orange_str += ". ";

  //       console.log(colors);
  //       let str = orange_str + red_str;
  //       const q = query(
  //         collection(db, "Colors"),
  //         where("t_id", "==", auth.currentUser.uid),
  //         where("class_id", "==", classID)
  //       );
  //       const updateColor = await getDocs(q);
  //       if (updateColor.docs.length > 0) {
  //         const _ref = updateColor.docs[0].ref;
  //         await updateDoc(_ref, {
  //           class_color: color,
  //           class_description: str,
  //         });
  //       }
  //     })
  //   );
  // };

  // const handleSidebarButtonPress = () => {
  //   // Implementation for handling sidebar button press
  //   // You can toggle a state value or perform any desired action
  //   console.log('Sidebar button pressed');
  // };
  


  return (  
    <View style={styles.container}>
      <View>
      <Image
            source={require("../assets/miniLogo-removebg-preview.png")}
          />
      </View>
    <View style={styles.title}>
      <Text style={styles.pageTitle}>דיווחים</Text>
    </View>


    <View style={styles.buttonContainer}>
      <TouchableOpacity
      style={[styles.button, styles.shadow]}
      onPress={() =>
          navigation.navigate('ChooseClass', { reported: 'Scores' })
        }
      >
        <Text style={styles.buttonText}>ציונים</Text>
      </TouchableOpacity>

      <TouchableOpacity
      style={[styles.button, styles.shadow]}
      onPress={() =>
          navigation.navigate('ChooseClass', { reported: 'Presence' })
        }
      >
        <Text style={styles.buttonText}>נוכחות</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.buttonContainer}>

    <TouchableOpacity
      style={[styles.button, styles.shadow]}
      onPress={() =>
        navigation.navigate('ChooseClass', { reported: 'FriendStatus' })
      }
    >
      <Text style={styles.buttonText}>מצב חברתי</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.button, styles.shadow]}
      onPress={() =>
        navigation.navigate('ChooseClass', { reported: 'Mood' })
      }
    >
      <Text style={styles.buttonText}>מצב רוח</Text>
    </TouchableOpacity>
    </View>

    <View style={styles.buttonContainer}>

    <TouchableOpacity
      style={[styles.button, styles.shadow]}
      onPress={() =>
        navigation.navigate('ChooseClass', { reported: 'Appearances' })
      }
    >
      <Text style={styles.buttonText}>נראות</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.button, styles.shadow]}
      onPress={() =>
        navigation.navigate('ChooseClass', { reported: 'Diet' })
      }
    >
      <Text style={styles.buttonText}>תזונה</Text>
    </TouchableOpacity>

    </View>


    <TouchableOpacity
      style={[styles.button, styles.shadow]}
      onPress={() =>
        navigation.navigate('ChooseClass', { reported: 'Events' })
      }
    >
      <Text style={styles.buttonText}>אירועים מיוחדים</Text>
    </TouchableOpacity>


    {(myChoice1 || myChoice2) && (
      <Text  style={[{fontWeight:'bold', fontSize:20}]}
      > הקטגוריות האישיות שלי: </Text>
    )}
    
    <View style={styles.buttonContainer}>



    {myChoice1 && (
      <TouchableOpacity
      style={[styles.button, styles.shadow, {backgroundColor:'white'}]}
      onPress={() =>
          navigation.navigate('ChooseClass', { reported: 'myChoice1' })
        }
      >
        <Text style={styles.buttonText}>{myChoice1}</Text>
      </TouchableOpacity>
    )}

    {myChoice2 && (
      <TouchableOpacity
      style={[styles.button, styles.shadow, {backgroundColor:'white'}]}
        onPress={() =>
          navigation.navigate('ChooseClass', { reported: 'myChoice2' })
        }
      >
        <Text style={styles.buttonText}>{myChoice2}</Text>
      </TouchableOpacity>
    )}

</View>

    <Navbar />
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#F2E3DB',
  alignItems: 'center',
  justifyContent: 'center',
},
title: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
},
pageTitle: {
  color: '#AD8E70',
    fontSize: 48,
  fontWeight: 'bold',
  padding: 10,
  textShadowColor: 'rgba(0, 0, 0, 0.25)',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 2,
},
buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
},
button: {
  width: width * 0.40,
  height: 65,
  justifyContent: 'center',
  backgroundColor: '#F1DEC9',
  borderWidth: 2,
  borderColor:'#F1DEC9',
  alignItems: 'center',
  marginHorizontal: 10,
  marginVertical: 10,
  borderRadius: 15,
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
  fontSize: 24,
  color: '#AD8E70',
},

});

export default HomePage;
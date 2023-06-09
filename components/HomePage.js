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
import Navbar from "./Navbar";
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

const { width } = Dimensions.get("window");

const HomePage = () => {
  const navigation = useNavigation();
  const [myChoice1, setMyChoice1] = useState("");
  const [myChoice2, setMyChoice2] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [rules, SetRules] = useState([]);
  const [colors, setColors] = useState([]);
  const [classes, setClasses] = useState([]);

  const [finalColors, setFinalColors] = useState([]);

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
    check();
  }, []);

  const changeValue = (index, newValue) => {
    setColors((prevColors) => {
      const updatedColors = [...prevColors];
      updatedColors[index] = newValue;
      return updatedColors;
    });
  };

  const appearancesQuery = async (
    twoWeeksAgo,
    currentDate,
    classID,
    numOfStudents
  ) => {
    const appearancesQuery = query(
      collection(db, "Appearances"),
      where("date", ">=", twoWeeksAgo),
      where("date", "<=", currentDate),
      where("t_id", "==", auth.currentUser.uid),
      where("class_id", "==", classID)
    );

    const appearancesQuerySnapshot = await getDocs(appearancesQuery);
    if (appearancesQuerySnapshot.size > 0) {
      const appearancesdays = appearancesQuerySnapshot.size / numOfStudents;
      let goodReports = 0;
      let sadReports = 0;

      appearancesQuerySnapshot.forEach((doc) => {
        const appearances = doc.data().appearances;
        if (appearances === "good") {
          goodReports += 1;
        } else {
          sadReports += 1;
        }
      });

      if (
        (goodReports * 100) / (numOfStudents * appearancesdays) <=
        parseFloat(rules.G_appearances_p)
      ) {
        if (
          (goodReports * 100) / (numOfStudents * appearancesdays) <
          parseFloat(rules.O_appearances_p)
        ) {
          // changeValue( 1 , "red");
          return "red";
        } else {
          changeValue(1, "orange");
          return "orange";
        }
      } else {
        changeValue(1, "green");
        return "green";
      }
    } else {
      changeValue(1, "green");
      return "green";
    }
  };

  const dietQuery = async (
    twoWeeksAgo,
    currentDate,
    classID,
    numOfStudents
  ) => {
    const dietQuery = query(
      collection(db, "Diet"),
      where("date", ">=", twoWeeksAgo),
      where("date", "<=", currentDate),
      where("t_id", "==", auth.currentUser.uid),
      where("class_id", "==", classID)
    );

    const dietQuerySnapshot = await getDocs(dietQuery);
    if (dietQuerySnapshot.size > 0) {
      const dietDays = dietQuerySnapshot.size / numOfStudents;
      let goodDietReports = 0;
      let badDietReports = 0;

      dietQuerySnapshot.forEach((doc) => {
        const diet = doc.data().diet;
        if (diet === "good") {
          goodDietReports += 1;
        } else {
          badDietReports += 1;
        }
      });

      if (
        (goodDietReports * 100) / (numOfStudents * dietDays) <=
        parseFloat(rules.G_diet_p)
      ) {
        if (
          (goodDietReports * 100) / (numOfStudents * dietDays) <
          parseFloat(rules.O_diet_p)
        ) {
          changeValue(2, "red");
          return "red";
        } else {
          changeValue(2, "orange");
          return "orange";
        }
      } else {
        changeValue(2, "green");
        return "green";
      }
    } else {
      changeValue(2, "green");
      return "green";
    }
  };

  const moodQuery = async (
    twoWeeksAgo,
    currentDate,
    classID,
    numOfStudents
  ) => {
    const moodQuery = query(
      collection(db, "Mood"),
      where("date", ">=", twoWeeksAgo),
      where("date", "<=", currentDate),
      where("t_id", "==", auth.currentUser.uid),
      where("class_id", "==", classID)
    );

    const moodQuerySnapshot = await getDocs(moodQuery);
    if (moodQuerySnapshot.size > 0) {
      const moodDays = moodQuerySnapshot.size / numOfStudents;
      let goodMoodReports = 0;
      let meduimMoodReports = 0;
      let badMoodReports = 0;

      moodQuerySnapshot.forEach((doc) => {
        const mood = doc.data().mood;
        if (mood === "good") {
          goodMoodReports += 1;
        } else if (mood === "meduim") {
          meduimMoodReports += 1;
        } else {
          badMoodReports += 1;
        }
      });

      if (
        (goodMoodReports * 100) / (numOfStudents * moodDays) <=
        parseFloat(rules.G_mood_p)
      ) {
        if (
          (goodMoodReports * 100) / (numOfStudents * moodDays) <
          parseFloat(rules.O_mood_p)
        ) {
          changeValue(3, "red");
          return "red";
        } else {
          changeValue(3, "orange");
          return "orange";
        }
      } else {
        changeValue(3, "green");
        return "green";
      }
    } else {
      changeValue(3, "green");
      return "green";
    }
  };

  const friendStatusQuery = async (
    twoWeeksAgo,
    currentDate,
    classID,
    numOfStudents
  ) => {
    const friendStatusQuery = query(
      collection(db, "FriendStatus"),
      where("date", ">=", twoWeeksAgo),
      where("date", "<=", currentDate),
      where("t_id", "==", auth.currentUser.uid),
      where("class_id", "==", classID)
    );

    const friendStatusQuerySnapshot = await getDocs(friendStatusQuery);
    if (friendStatusQuerySnapshot.size > 0) {
      const friendStatusDays = friendStatusQuerySnapshot.size / numOfStudents;
      let goodFriendStatusReports = 0;
      let meduimFriendStatusReports = 0;
      let badFriendStatusReports = 0;

      friendStatusQuerySnapshot.forEach((doc) => {
        const friendStatus = doc.data().friendStatus;
        if (friendStatus === "good") {
          goodFriendStatusReports += 1;
        } else if (friendStatus === "meduim") {
          meduimFriendStatusReports += 1;
        } else {
          badFriendStatusReports += 1;
        }
      });

      if (
        (goodFriendStatusReports * 100) / (numOfStudents * friendStatusDays) <=
        parseFloat(rules.G_friendStatus_p)
      ) {
        if (
          (goodFriendStatusReports * 100) / (numOfStudents * friendStatusDays) <
          parseFloat(rules.O_friendStatus_p)
        ) {
          changeValue(4, "red");
          return "red";
        } else {
          changeValue(4, "orange");
          return "orange";
        }
      } else {
        changeValue(4, "green");
        return "green";
      }
    } else {
      changeValue(4, "green");
      return "green";
    }
  };

  const eventsQuery = async (
    twoWeeksAgo,
    currentDate,
    classID,
    numOfStudents
  ) => {
    const eventsQuery = query(
      collection(db, "Events"),
      where("date", ">=", twoWeeksAgo),
      where("date", "<=", currentDate),
      where("t_id", "==", auth.currentUser.uid),
      where("class_id", "==", classID)
    );

    const eventsQueryQuerySnapshot = await getDocs(eventsQuery);
    if (eventsQueryQuerySnapshot.size > 0) {
      const eventsQueryDays = eventsQueryQuerySnapshot.size / numOfStudents;
      let negativeEvents = 0;

      eventsQueryQuerySnapshot.forEach((doc) => {
        const type = doc.data().type;
        if (type === "negative") {
          negativeEvents += 1;
        }
      });

      if (negativeEvents === parseFloat(rules.G_events)) {
        changeValue(5, "green");
        return "green";
      }

      if (negativeEvents === parseFloat(rules.O_events)) {
        changeValue(5, "orange");
        return "orange";
      }

      if (negativeEvents >= parseFloat(rules.R_events)) {
        changeValue(5, "red");
        return "red";
      }
    } else {
      changeValue(5, "green");
      res = "green";
      return res;
    }
  };

  const check = async () => {
    const currentDate = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(currentDate.getDate() - 14);

    const que = query(
      collection(db, "TrafficLights"),
      where("t_id", "==", auth.currentUser.uid)
    );
    const querySnap = await getDocs(que);
    const doc = querySnap.docs[0];

    if (doc.exists()) {
      SetRules(doc.data());
    } else {
      return;
    }

    const q = query(
      collection(db, "Classes"),
      where("t_id", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);

    const classes = [];

    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const classID = doc.id;
        const classData = doc.data();
        const className = classData.class_name;
        const numOfStudents = classData.numOfStudents;

        const classInfo = {
          classID,
          className,
          numOfStudents,
        };

        classes.push(classInfo);
      })
    );

    setClasses(classes);

    for (let i = 0; i < classes.length; i++) {
      await updateColor(
        twoWeeksAgo,
        currentDate,
        classes[i].classID,
        classes[i].numOfStudents,
        i,
        classes[i].className
      );
    }
  };

  const presenceQyrery = async (
    twoWeeksAgo,
    currentDate,
    classID,
    numOfStudents
  ) => {
    const presenceQuery = query(
      collection(db, "Presence"),
      where("date", ">=", twoWeeksAgo),
      where("date", "<=", currentDate),
      where("t_id", "==", auth.currentUser.uid),
      where("class_id", "==", classID)
    );

    const presenceQuerySnapshot = await getDocs(presenceQuery);
    if (presenceQuerySnapshot.size > 0) {
      const days = presenceQuerySnapshot.size / numOfStudents;
      let presences = 0;
      let lates = 0;
      let absents = 0;

      presenceQuerySnapshot.forEach((doc) => {
        const presence = doc.data().presence;
        if (presence === "present") {
          presences += 1;
        } else if (presence === "late") {
          lates += 1;
        } else if (presence === "absent") {
          absents += 1;
        }
      });

      let res = "";

      if (
        (presences * 100) / (numOfStudents * days) <=
        parseFloat(rules.G_presence)
      ) {
        if (presences / (numOfStudents * days) < parseFloat(rules.O_presence)) {
          // changeValue( 0 , "red");
          res = "red";
          return res;
        } else {
          // changeValue( 0 , "orange");

          res = "orange";
          return res;
        }
      } else {
        // changeValue( 0 , "green");
        res = "green";
        return res;
      }
    } else {
      // changeValue( 0 , "green");
      res = "green";
      return res;
    }
  };

  const updateColor = async (
    twoWeeksAgo,
    currentDate,
    classID,
    numOfStudents,
    classIndex,
    className
  ) => {
    let colorsForClass = ["green", "green", "green", "green", "green", "green"];
    const colorQuery = query(
      collection(db, "Colors"),
      where("t_id", "==", auth.currentUser.uid),
      where("class_id", "==", classID)
    );
    const colorsQuerySnapshot = await getDocs(colorQuery);

    let current_color = "";
    colorsQuerySnapshot.forEach((doc) => {
      if (doc.data().class_color) {
        current_color = doc.data().class_color;
      }
    });

    // let color = current_color;

    let presence = await presenceQyrery(
      twoWeeksAgo,
      currentDate,
      classID,
      numOfStudents
    );
    let appearances = await appearancesQuery(
      twoWeeksAgo,
      currentDate,
      classID,
      numOfStudents
    );
    let diet = await dietQuery(
      twoWeeksAgo,
      currentDate,
      classID,
      numOfStudents
    );
    let mood = await moodQuery(
      twoWeeksAgo,
      currentDate,
      classID,
      numOfStudents
    );
    let friendStatus = await friendStatusQuery(
      twoWeeksAgo,
      currentDate,
      classID,
      numOfStudents
    );
    let events = await eventsQuery(
      twoWeeksAgo,
      currentDate,
      classID,
      numOfStudents
    );

    colorsForClass[0] = presence;
    colorsForClass[1] = appearances;
    colorsForClass[2] = diet;
    colorsForClass[3] = mood;
    colorsForClass[4] = friendStatus;
    colorsForClass[5] = events;

    let orange_str = "";
    let red_str = "";

    let orange_flag = 0;
    let red_flag = 0;
    let sum = 0;


    for (let i = 0; i < colorsForClass.length; i++) {
      if (colorsForClass[i] === "green") {
        sum += 1;
      } 
      
      else if (colorsForClass[i] === "orange") {
        if (orange_flag == 0) {
          orange_str = "לתשומת ליבך הקטגוריות הבאות כתומות: ";
          orange_flag = 1;
        }

        if (i === 0) {
          orange_str += " נוכחות";
        } else if (i === 1) {
          orange_str += " נראות";
        } else if (i === 2) {
          orange_str += " תזונה";
        } else if (i === 3) {
          orange_str += " מצב רוח";
        } else if (i === 4) {
          orange_str += " מצב רוח";
        } else {
          orange_str += " אירועים שליליים ";
        }
        sum += 2;
      } 
      else if (colorsForClass[i] === "red") {
        if (red_flag == 0) {
          red_str = "לתשומת ליבך הקטגוריות הבאות אדומות: ";
          red_flag = 1;
        }
        if (i === 0) {
          red_str += " נוכחות";
        } else if (i === 1) {
          red_str += " נראות";
        } else if (i === 2) {
          red_str += " תזונה";
        } else if (i === 3) {
          red_str += " מצב רוח";
        } else if (i === 4) {
          red_str += " מצב רוח";
        } else {
          red_str += " אירועים שליליים ";
        }
        sum += 3;
      }
    }

  if(orange_str!= ''){
    orange_str += '.';
  }
  if(red_str!= ''){
    red_str += '.';
  }
    let str = orange_str + red_str; 
    let average = sum/colorsForClass.length;
    average = parseFloat(average.toFixed(2));


    let color='';
    if(1<=average && average<=1.66){
      color='green'
    }
    if(1.66<=average && average<=2.33){
      color='orange'
    }
    if(2.33<=average && average>=2){
      color='red'
    }

  
    if (current_color !== color) {
      const q = query(
        collection(db, "Colors"),
        where("t_id", "==", auth.currentUser.uid),
        where("class_id", "==", classID)
      );
      const updateColor = await getDocs(q);
      if (updateColor.docs.length > 0) {
        const _ref = updateColor.docs[0].ref;
        await updateDoc(_ref, {
          class_color: color,
          class_description: str,
        });

        let str_color;
        if (color === "red") {
          str_color = "אדום";
        } else if (color === "orange") {
          str_color = "כתום";
        } else {
          str_color = "ירוק";
        }


        if (color !== "green") {
          Alert.alert(
            "שינוי צבע",
            `הכיתה ${className} שינתה את צבעה ל- ${str_color}.${str}`,
            [
              {
                text: "אוקיי",
                onPress: () => {},
                style: "cancel",
              },
            ]
          );
        }
      }
    }

  };

  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../assets/miniLogo-removebg-preview.png")} />
      </View>
      <View style={styles.title}>
        <Text style={styles.pageTitle}>דיווחים</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.shadow]}
          onPress={() =>
            navigation.navigate("ChooseClass", { reported: "Scores" })
          }
        >
          <Text style={styles.buttonText}>ציונים</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.shadow]}
          onPress={() =>
            navigation.navigate("ChooseClass", { reported: "Presence" })
          }
        >
          <Text style={styles.buttonText}>נוכחות</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.shadow]}
          onPress={() =>
            navigation.navigate("ChooseClass", { reported: "FriendStatus" })
          }
        >
          <Text style={styles.buttonText}>מצב חברתי</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.shadow]}
          onPress={() =>
            navigation.navigate("ChooseClass", { reported: "Mood" })
          }
        >
          <Text style={styles.buttonText}>מצב רוח</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.shadow]}
          onPress={() =>
            navigation.navigate("ChooseClass", { reported: "Appearances" })
          }
        >
          <Text style={styles.buttonText}>נראות</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.shadow]}
          onPress={() =>
            navigation.navigate("ChooseClass", { reported: "Diet" })
          }
        >
          <Text style={styles.buttonText}>תזונה</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.shadow]}
        onPress={() =>
          navigation.navigate("ChooseClass", { reported: "Events" })
        }
      >
        <Text style={styles.buttonText}>אירועים מיוחדים</Text>
      </TouchableOpacity>

      {(myChoice1 || myChoice2) && (
        <Text style={[{ fontWeight: "bold", fontSize: 20 }]}>
          {" "}
          הקטגוריות האישיות שלי:{" "}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        {myChoice1 && (
          <TouchableOpacity
            style={[styles.button, styles.shadow, { backgroundColor: "white" }]}
            onPress={() =>
              navigation.navigate("ChooseClass", { reported: "myChoice1" })
            }
          >
            <Text style={styles.buttonText}>{myChoice1}</Text>
          </TouchableOpacity>
        )}

        {myChoice2 && (
          <TouchableOpacity
            style={[styles.button, styles.shadow, { backgroundColor: "white" }]}
            onPress={() =>
              navigation.navigate("ChooseClass", { reported: "myChoice2" })
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
    fontSize: 48,
    fontWeight: "bold",
    padding: 10,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: width * 0.4,
    height: 65,
    justifyContent: "center",
    backgroundColor: "#F1DEC9",
    borderWidth: 2,
    borderColor: "#F1DEC9",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 15,
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
  alertContainer: {
    color: "red",
  },
});

export default HomePage;

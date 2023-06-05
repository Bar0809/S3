import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const HistoryForStudent = ({ route }) => {
  const { student_name } = route.params;
  const { s_id } = route.params;

  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [validDate, setValidDate] = useState(false);
  const [validDateTwo, setValidDateTwo] = useState(false);
  const [presenceIds, setPresenceIds] = useState([]);
  const [scoresIds, setScoresIds] = useState([]);
  const [moodIds, setMoodIds] = useState([]);
  const [friendStatusIds, setFriendStatusIds] = useState([]);
  const [dietIds, setDietIds] = useState([]);
  const [appearancesIds, setAppearancesIds] = useState([]);
  const [eventsIds, setEventsIds] = useState([]);
  const [presenceResult, setPresenceResult] = useState([]);

  const [scoreResult, setScoreResult] = useState([]);
  const [moodResult, setMoodResult] = useState([]);
  const [friendStatusResult, setFriendStatusResult] = useState([]);
  const [dietResult, setDietResult] = useState([]);
  const [appearancesResult, setAppearancesResult] = useState([]);
  const [eventsResult, setEventsResult] = useState([]);
  const [moodForShow, setMoodForShow] = useState(false);
  const [friendStatusForShow, setFriendStatusForShow] = useState(false);
  const [dietForShow, setDietForShow] = useState(false);
  const [appearancesForShow, setAppearancesForShow] = useState(false);
  const [eventsForShow, setEventsForShow] = useState(false);
  const [presenceForShow, setPresenceForShow] = useState(false);
  const [scoreForShow, setScoreForShow] = useState(false);
  const [myChoice1ForShow, setMyChoice1ForShow] = useState(false);
  const [myChoice2ForShow, setMyChoice2ForShow] = useState(false);
  const [icon1, setIcon1] = useState(false);
  const [icon2, setIcon2] = useState(false);
  const [myChoice1, setMyChoice1] = useState("");
  const [myChoice2, setMyChoice2] = useState("");
  const [myChoice1Result, setMyChoice1Result] = useState([]);
  const [myChoice2Result, setMyChoice2Result] = useState([]);

  useEffect(() => {
    const getIcons = async () => {
      const iconsRef = collection(db, "users");
      const q = query(iconsRef, where("t_id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const icons = [];
      querySnapshot.forEach((doc) => {
        const mychoice1 = doc.data().icons1;
        icons.push(mychoice1);
        const mychoice2 = doc.data().icons2;
        icons.push(mychoice2);
        const categoryName1 = doc.data().myChoice1;
        icons.push(categoryName1);
        const categoryName2 = doc.data().myChoice2;
        icons.push(categoryName2);
      });
      setIcon1(icons[0]);
      setIcon2(icons[1]);
      setMyChoice1(icons[2]);
      setMyChoice2(icons[3]);
    };
    getIcons();
  }, []);

  const handlePresenceButton = () => {
    setPresenceForShow((prevState) => !prevState);
    if (!presenceForShow) {
      getPresence();
    }
  };
  const handleMyChoice1Button = () => {
    setMyChoice1ForShow((prevState) => !prevState);
    if (!myChoice1ForShow) {
      getMyChoice1();
    }
  };
  const handleMyChoice2Button = () => {
    setMyChoice2ForShow((prevState) => !prevState);
    if (!myChoice2ForShow) {
      getMyChoice2();
    }
  };

  const handleScoresButton = () => {
    setScoreForShow((prevState) => !prevState);
    if (!scoreForShow) {
      getScores();
    }
  };

  const handleMoodButton = () => {
    setMoodForShow((prevState) => !prevState);
    if (!moodForShow) {
      getMood();
    }
  };

  const handleFriendStatusButton = () => {
    setFriendStatusForShow((prevState) => !prevState);
    if (!friendStatusForShow) {
      getFriendStatus();
    }
  };

  const handleDietButton = () => {
    setDietForShow((prevState) => !prevState);
    if (!dietForShow) {
      getDiet();
    }
  };

  const handleAppearancesButton = () => {
    setAppearancesForShow((prevState) => !prevState);
    if (!appearancesForShow) {
      getAppearances();
    }
  };

  const handleEventsButton = () => {
    setEventsForShow((prevState) => !prevState);
    if (!eventsForShow) {
      getEvents();
    }
  };

  function parseDateString(inputString) {
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = inputString.match(dateRegex);
    if (!match) {
      return false;
    }
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);

    const date = new Date(year, month, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return false;
    }

    if (month > 11) {
      return false;
    }

    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    if (day > lastDayOfMonth) {
      return false;
    }

    const currentDate = new Date();
    const minDate = new Date("2023-01-01");
    if (date < minDate || date > currentDate) {
      return false;
    }

    return true;
  }

  const getPresence = async () => {
    const startDateArray = startDateString.split("/");
    const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
    const startDateTime = new Date(startDateISO);
    const endDateArray = endDateString.split("/");
    const endDateISO = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
    const endDateTime = new Date(endDateISO);

    if (startDate && endDate) {
      try {
        const presenceRef = collection(db, "Presence");
        const q = query(
          presenceRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime),
          where("t_id", "==", auth.currentUser.uid),
          where("s_id", "==", s_id)
        );
        const querySnapshot = await getDocs(q);

        const result = {};
        querySnapshot.forEach((doc) => {
          const courseName = doc.data().courseName;
          const presence = doc.data().presence;
          const presenceValue = doc.data().date.toDate();
          const day = presenceValue.getDate().toString().padStart(2, "0");
          const month = (presenceValue.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const year = presenceValue.getFullYear();
          const date = `${day}/${month}/${year}`;
          if (!result[courseName]) {
            result[courseName] = [];
          }
          result[courseName].push({ date, presence });
          setPresenceForShow(true);
        });

        setPresenceResult(result);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
        console.log(error.message);
      }
    }
  };

  const getScores = async () => {
    const startDateArray = startDateString.split("/");
    const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
    const startDateTime = new Date(startDateISO);
    const endDateArray = endDateString.split("/");
    const endDateISO = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
    const endDateTime = new Date(endDateISO);
    let querySnapshot;
    if (startDate && endDate) {
      try {
        const scoresRef = collection(db, "Scores");
        const q = query(
          scoresRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime),
          where("t_id", "==", auth.currentUser.uid),
          where("s_id", "==", s_id)
        );

        const querySnapshot = await getDocs(q);

        const result = {};
        querySnapshot.forEach((doc) => {
          const courseName = doc.data().courseName;
          const exercise_name = doc.data().exercise_name;
          const score = doc.data().score;
          const note = doc.data().note;
          const presenceValue = doc.data().date.toDate();
          const day = presenceValue.getDate().toString().padStart(2, "0");
          const month = (presenceValue.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const year = presenceValue.getFullYear();
          const date = `${day}/${month}/${year}`;

          if (!result[courseName]) {
            result[courseName] = [];
          }
          result[courseName].push({ date, exercise_name, score, note });
          setScoreForShow(true);
        });

        setScoreResult(result);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
        console.log(error.message);
      }
    }
  };

  const getMood = async () => {
    const startDateArray = startDateString.split("/");
    const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
    const startDateTime = new Date(startDateISO);
    const endDateArray = endDateString.split("/");
    const endDateISO = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
    const endDateTime = new Date(endDateISO);
    let querySnapshot;
    if (startDate && endDate) {
      try {
        const moodRef = collection(db, "Mood");
        const q = query(
          moodRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime),
          where("t_id", "==", auth.currentUser.uid),
          where("s_id", "==", s_id)
        );

        const querySnapshot = await getDocs(q);

        const result = {};
        querySnapshot.forEach((doc) => {
          const courseName = doc.data().courseName;
          const mood = doc.data().mood;
          const note = doc.data().note;
          const presenceValue = doc.data().date.toDate();
          const day = presenceValue.getDate().toString().padStart(2, "0");
          const month = (presenceValue.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const year = presenceValue.getFullYear();
          const date = `${day}/${month}/${year}`;

          if (!result[courseName]) {
            result[courseName] = [];
          }
          result[courseName].push({ date, mood, note });
          setMoodForShow(true);
        });

        setMoodResult(result);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
        console.log(error.message);
      }
    }
  };

  const getFriendStatus = async () => {
    const startDateArray = startDateString.split("/");
    const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
    const startDateTime = new Date(startDateISO);
    const endDateArray = endDateString.split("/");
    const endDateISO = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
    const endDateTime = new Date(endDateISO);
    let querySnapshot;
    if (startDate && endDate) {
      try {
        const categoryRef = collection(db, "FriendStatus");
        const q = query(
          categoryRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime),
          where("t_id", "==", auth.currentUser.uid),
          where("s_id", "==", s_id)
        );

        const querySnapshot = await getDocs(q);

        const result = {};
        querySnapshot.forEach((doc) => {
          const courseName = doc.data().courseName;
          const friendStatus = doc.data().friendStatus;
          const note = doc.data().note;
          const presenceValue = doc.data().date.toDate();
          const day = presenceValue.getDate().toString().padStart(2, "0");
          const month = (presenceValue.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const year = presenceValue.getFullYear();
          const date = `${day}/${month}/${year}`;

          if (!result[courseName]) {
            result[courseName] = [];
          }
          result[courseName].push({ date, friendStatus, note });
          setFriendStatusForShow(true);
        });

        setFriendStatusResult(result);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
        console.log(error.message);
      }
    }
  };

  const getDiet = async () => {
    const startDateArray = startDateString.split("/");
    const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
    const startDateTime = new Date(startDateISO);
    const endDateArray = endDateString.split("/");
    const endDateISO = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
    const endDateTime = new Date(endDateISO);
    let querySnapshot;
    if (startDate && endDate) {
      try {
        const categoryRef = collection(db, "Diet");
        const q = query(
          categoryRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime),
          where("t_id", "==", auth.currentUser.uid),
          where("s_id", "==", s_id)
        );

        const querySnapshot = await getDocs(q);

        const result = {};
        querySnapshot.forEach((doc) => {
          const courseName = doc.data().courseName;
          const diet = doc.data().diet;
          const note = doc.data().note;
          const presenceValue = doc.data().date.toDate();
          const day = presenceValue.getDate().toString().padStart(2, "0");
          const month = (presenceValue.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const year = presenceValue.getFullYear();
          const date = `${day}/${month}/${year}`;

          if (!result[courseName]) {
            result[courseName] = [];
          }
          result[courseName].push({ date, diet, note });
          setDietForShow(true);
        });

        setDietResult(result);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
        console.log(error.message);
      }
    }
  };

  const getAppearances = async () => {
    const startDateArray = startDateString.split("/");
    const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
    const startDateTime = new Date(startDateISO);
    const endDateArray = endDateString.split("/");
    const endDateISO = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
    const endDateTime = new Date(endDateISO);
    let querySnapshot;
    if (startDate && endDate) {
      try {
        const categoryRef = collection(db, "Appearances");
        const q = query(
          categoryRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime),
          where("t_id", "==", auth.currentUser.uid),
          where("s_id", "==", s_id)
        );

        const querySnapshot = await getDocs(q);

        const result = {};
        querySnapshot.forEach((doc) => {
          const courseName = doc.data().courseName;
          const appearances = doc.data().diet;
          const note = doc.data().note;
          const presenceValue = doc.data().date.toDate();
          const day = presenceValue.getDate().toString().padStart(2, "0");
          const month = (presenceValue.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const year = presenceValue.getFullYear();
          const date = `${day}/${month}/${year}`;

          if (!result[courseName]) {
            result[courseName] = [];
          }
          result[courseName].push({ date, appearances, note });
          setAppearancesForShow(true);
        });

        setAppearancesResult(result);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
        console.log(error.message);
      }
    }
  };

  const getEvents = async () => {
    const startDateArray = startDateString.split("/");
    const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
    const startDateTime = new Date(startDateISO);
    const endDateArray = endDateString.split("/");
    const endDateISO = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
    const endDateTime = new Date(endDateISO);
    let querySnapshot;
    if (startDate && endDate) {
      try {
        const categoryRef = collection(db, "Events");
        const q = query(
          categoryRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime),
          where("t_id", "==", auth.currentUser.uid),
          where("s_id", "==", s_id)
        );

        const querySnapshot = await getDocs(q);

        const result = {};
        querySnapshot.forEach((doc) => {
          const courseName = doc.data().courseName;
          const type = doc.data().type;
          const eventType = doc.data().eventType;

          const notes = doc.data().notes;
          const presenceValue = doc.data().date.toDate();
          const day = presenceValue.getDate().toString().padStart(2, "0");
          const month = (presenceValue.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const year = presenceValue.getFullYear();
          const date = `${day}/${month}/${year}`;

          if (!result[courseName]) {
            result[courseName] = [];
          }
          result[courseName].push({ date, type, eventType, notes });
          setEventsForShow(true);
        });

        setEventsResult(result);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
        console.log(error.message);
      }
    }
  };

  const getMyChoice1 = async () => {
    if (icon1 === true) {
      const startDateArray = startDateString.split("/");
      const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
      const startDateTime = new Date(startDateISO);
      const endDateArray = endDateString.split("/");
      const endDateISO = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
      const endDateTime = new Date(endDateISO);
      let querySnapshot;
      if (startDate && endDate) {
        try {
          const categoryRef = collection(db, "MyChoice1");
          const q = query(
            categoryRef,
            where("date", ">=", startDateTime),
            where("date", "<=", endDateTime),
            where("t_id", "==", auth.currentUser.uid),
            where("s_id", "==", s_id)
          );

          const querySnapshot = await getDocs(q);

          const result = {};
          querySnapshot.forEach((doc) => {
            const courseName = doc.data().courseName;
            const myChoice = doc.data().myChoice;
            const note = doc.data().note;
            const presenceValue = doc.data().date.toDate();
            const day = presenceValue.getDate().toString().padStart(2, "0");
            const month = (presenceValue.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            const year = presenceValue.getFullYear();
            const date = `${day}/${month}/${year}`;

            if (!result[courseName]) {
              result[courseName] = [];
            }
            result[courseName].push({ date, myChoice, note });
            setMyChoice1ForShow(true);
          });

          setMyChoice1Result(result);
        } catch (error) {
          Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
          console.log(error.message);
        }
      }
    } else if (icon1 === false) {
      const startDateArray = startDateString.split("/");
      const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
      const startDateTime = new Date(startDateISO);
      const endDateArray = endDateString.split("/");
      const endDateISO = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
      const endDateTime = new Date(endDateISO);
      let querySnapshot;
      if (startDate && endDate) {
        try {
          const categoryRef = collection(db, "MyChoice1");
          const q = query(
            categoryRef,
            where("date", ">=", startDateTime),
            where("date", "<=", endDateTime),
            where("t_id", "==", auth.currentUser.uid),
            where("s_id", "==", s_id)
          );

          const querySnapshot = await getDocs(q);

          const result = {};
          querySnapshot.forEach((doc) => {
            const courseName = doc.data().courseName;
            const myChoice = doc.data().myChoice;
            const presenceValue = doc.data().date.toDate();
            const day = presenceValue.getDate().toString().padStart(2, "0");
            const month = (presenceValue.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            const year = presenceValue.getFullYear();
            const date = `${day}/${month}/${year}`;

            if (!result[courseName]) {
              result[courseName] = [];
            }
            result[courseName].push({ date, myChoice });
            setMyChoice1ForShow(true);
          });

          setMyChoice1Result(result);
        } catch (error) {
          Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
          console.log(error.message);
        }
      }
    }
  };

  const getMyChoice2 = async () => {
    if (icon2 === true) {
      const startDateArray = startDateString.split("/");
      const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
      const startDateTime = new Date(startDateISO);
      const endDateArray = endDateString.split("/");
      const endDateISO = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
      const endDateTime = new Date(endDateISO);
      let querySnapshot;
      if (startDate && endDate) {
        try {
          const categoryRef = collection(db, "MyChoice2");
          const q = query(
            categoryRef,
            where("date", ">=", startDateTime),
            where("date", "<=", endDateTime),
            where("t_id", "==", auth.currentUser.uid),
            where("s_id", "==", s_id)
          );

          const querySnapshot = await getDocs(q);

          const result = {};
          querySnapshot.forEach((doc) => {
            const courseName = doc.data().courseName;
            const myChoice = doc.data().myChoice;
            const note = doc.data().note;
            const presenceValue = doc.data().date.toDate();
            const day = presenceValue.getDate().toString().padStart(2, "0");
            const month = (presenceValue.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            const year = presenceValue.getFullYear();
            const date = `${day}/${month}/${year}`;

            if (!result[courseName]) {
              result[courseName] = [];
            }
            result[courseName].push({ date, myChoice, note });
            setMyChoice2ForShow(true);
          });

          setMyChoice2Result(result);
        } catch (error) {
          Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
          console.log(error.message);
        }
      }
    } else if (icon2 === false) {
      const startDateArray = startDateString.split("/");
      const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
      const startDateTime = new Date(startDateISO);
      const endDateArray = endDateString.split("/");
      const endDateISO = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
      const endDateTime = new Date(endDateISO);
      let querySnapshot;
      if (startDate && endDate) {
        try {
          const categoryRef = collection(db, "MyChoice2");
          const q = query(
            categoryRef,
            where("date", ">=", startDateTime),
            where("date", "<=", endDateTime),
            where("t_id", "==", auth.currentUser.uid),
            where("s_id", "==", s_id)
          );

          const querySnapshot = await getDocs(q);

          const result = {};
          querySnapshot.forEach((doc) => {
            const courseName = doc.data().courseName;
            const myChoice = doc.data().myChoice;
            const presenceValue = doc.data().date.toDate();
            const day = presenceValue.getDate().toString().padStart(2, "0");
            const month = (presenceValue.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            const year = presenceValue.getFullYear();
            const date = `${day}/${month}/${year}`;

            if (!result[courseName]) {
              result[courseName] = [];
            }
            result[courseName].push({ date, myChoice });
            setMyChoice2ForShow(true);
          });

          setMyChoice2Result(result);
        } catch (error) {
          Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
          console.log(error.message);
        }
      }
    }
  };
  const handleChangeStartDate = (text) => {
    setStartDateString(text);
    setStartDate(parseDateString(text, "dd/mm/yyyy"));
    setValidDate(parseDateString(text));
  };

  const handleChangeEndDate = (text) => {
    setEndDateString(text);
    setEndDate(parseDateString(text, "dd/mm/yyyy"));
    setValidDateTwo(parseDateString(text));
  };

  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../assets/miniLogo-removebg-preview.png")} />
      </View>

      <View style={styles.title}>
        <Text style={[styles.pageTitle, { textAlign: "center" }]}>
          היסטוריית דיווחים - {"\n"}
          {student_name}{" "}
        </Text>
      </View>

      <View>
        <Text style={styles.subTitle}>מתאריך: </Text>
        <TextInput
          style={[styles.input, { textAlign: "right" }]}
          value={startDateString}
          onChangeText={handleChangeStartDate}
          placeholder="הכנס/י תאריך מהצורה (DD/MM/YYYY)"
        />
        {startDateString && !validDate && (
          <Text style={{ color: "red" }}>ערך לא תקין</Text>
        )}

        {validDate && <AntDesign name="check" size={24} color="green" />}
      </View>

      <View>
        <Text style={styles.subTitle}>עד תאריך: </Text>
        <TextInput
          style={[styles.input, { textAlign: "right" }]}
          value={endDateString}
          onChangeText={handleChangeEndDate}
          placeholder="הכנס/י תאריך מהצורה (DD/MM/YYYY)"
        />

        {endDateString && !validDateTwo && (
          <Text style={{ color: "red" }}>ערך לא תקין</Text>
        )}

        {validDateTwo && <AntDesign name="check" size={24} color="green" />}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
        <View>
          <TouchableOpacity
            onPress={handlePresenceButton}
            style={[styles.button, { backgroundColor: "white" }]}
          >
            <Text style={styles.buttonText}>נוכחות </Text>
          </TouchableOpacity>
          {presenceForShow &&
            (Object.entries(presenceResult).length === 0 ? (
              <Text>אין דיווחים בתאריכים אלו </Text>
            ) : (
              Object.entries(presenceResult).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 16,
                      textDecorationLine: "underline",
                    }}
                  >
                    {courseName}
                  </Text>
                  {data.map(({ date, presence }) => {
                    let presenceLabel = presence;
                    if (presence === "absent") {
                      presenceLabel = "חיסור";
                    } else if (presence === "late") {
                      presenceLabel = "delay";
                    } else {
                      presenceLabel = "נוכח/ת";
                    }

                    return (
                      <Text key={date}>{`${date} - ${presenceLabel}`}</Text>
                    );
                  })}
                </View>
              ))
            ))}

          <TouchableOpacity
            onPress={handleScoresButton}
            style={[styles.button, { backgroundColor: "white" }]}
          >
            <Text style={styles.buttonText}>ציונים </Text>
          </TouchableOpacity>
          {scoreForShow &&
            (Object.entries(scoreResult).length === 0 ? (
              <Text>אין דיווחים בתאריכים אלו </Text>
            ) : (
              Object.entries(scoreResult).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 16,
                      textDecorationLine: "underline",
                    }}
                  >
                    {courseName}
                  </Text>
                  {data.map(({ date, exercise_name, score, note }) => (
                    <Text key={date}>
                      {`${date} - ${exercise_name} - ${score}${
                        note !== "" ? ` (${note})` : ""
                      }`}
                    </Text>
                  ))}
                </View>
              ))
            ))}

          <TouchableOpacity
            onPress={handleMoodButton}
            style={[styles.button, { backgroundColor: "white" }]}
          >
            <Text style={styles.buttonText}>מצב רוח </Text>
          </TouchableOpacity>
          {moodForShow &&
            (Object.entries(moodResult).length === 0 ? (
              <Text>אין דיווחים בתאריכים אלו </Text>
            ) : (
              Object.entries(moodResult).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 16,
                      textDecorationLine: "underline",
                    }}
                  >
                    {courseName}
                  </Text>
                  {data.map(({ date, mood, note }) => {
                    let label = mood;
                    if (mood === "sad") {
                      label = "הערכה שלילית";
                    } else if (mood === "medium") {
                      label = "הערכה בינונית";
                    } else {
                      label = "הערכה חיובית";
                    }
                    return (
                      <Text key={date}>
                        {`${date} -  ${label}${
                          note !== "" ? ` (${note})` : ""
                        }`}
                      </Text>
                    );
                  })}
                </View>
              ))
            ))}

          <TouchableOpacity
            onPress={handleFriendStatusButton}
            style={[styles.button, { backgroundColor: "white" }]}
          >
            <Text style={styles.buttonText}>מצב חברתי </Text>
          </TouchableOpacity>
          {friendStatusForShow &&
            (Object.entries(friendStatusResult).length === 0 ? (
              <Text>אין דיווחים בתאריכים אלו </Text>
            ) : (
              Object.entries(friendStatusResult).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 16,
                      textDecorationLine: "underline",
                    }}
                  >
                    {courseName}
                  </Text>
                  {data.map(({ date, friendStatus, note }) => {
                    let label = friendStatus;
                    if (friendStatus === "sad") {
                      label = "הערכה שלילית";
                    } else if (friendStatus === "medium") {
                      label = "הערכה בינונית";
                    } else {
                      label = "הערכה חיובית";
                    }
                    return (
                      <Text key={date}>
                        {`${date} -  ${label}${
                          note !== "" ? ` (${note})` : ""
                        }`}
                      </Text>
                    );
                  })}
                </View>
              ))
            ))}

          <TouchableOpacity
            onPress={handleDietButton}
            style={[styles.button, { backgroundColor: "white" }]}
          >
            <Text style={styles.buttonText}> תזונה </Text>
          </TouchableOpacity>

          {dietForShow &&
            (Object.entries(dietResult).length === 0 ? (
              <Text>אין דיווחים בתאריכים אלו </Text>
            ) : (
              Object.entries(dietResult).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 16,
                      textDecorationLine: "underline",
                    }}
                  >
                    {courseName}
                  </Text>
                  {data.map(({ date, diet, note }) => {
                    let label = diet;
                    if (diet === "sad") {
                      label = "הערכה שלילית";
                    } else {
                      label = "הערכה חיובית";
                    }
                    return (
                      <Text key={date}>
                        {`${date} -  ${label}${
                          note !== "" ? ` (${note})` : ""
                        }`}
                      </Text>
                    );
                  })}
                </View>
              ))
            ))}

          <TouchableOpacity
            onPress={handleAppearancesButton}
            style={[styles.button, { backgroundColor: "white" }]}
          >
            <Text style={styles.buttonText}> נראות </Text>
          </TouchableOpacity>
          {appearancesForShow &&
            (Object.entries(appearancesResult).length === 0 ? (
              <Text>אין דיווחים בתאריכים אלו </Text>
            ) : (
              Object.entries(appearancesResult).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 16,
                      textDecorationLine: "underline",
                    }}
                  >
                    {courseName}
                  </Text>
                  {data.map(({ date, appearances, note }) => {
                    let label = appearances;
                    if (appearances === "sad") {
                      label = "הערכה שלילית ";
                    } else {
                      label = "הערכה חיובית ";
                    }
                    return (
                      <Text key={date}>
                        {`${date} -  ${label}${
                          note !== "" ? ` (${note})` : ""
                        }`}
                      </Text>
                    );
                  })}
                </View>
              ))
            ))}

          <TouchableOpacity
            onPress={handleEventsButton}
            style={[styles.button, { backgroundColor: "white" }]}
          >
            <Text style={styles.buttonText}> אירועים מיוחדים </Text>
          </TouchableOpacity>
          {eventsForShow &&
            (Object.entries(eventsResult).length === 0 ? (
              <Text>אין דיווחים בתאריכים אלו </Text>
            ) : (
              Object.entries(eventsResult).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 16,
                      textDecorationLine: "underline",
                    }}
                  >
                    {courseName}
                  </Text>
                  {data.map(({ date, type, eventType, notes }) => {
                    let label = eventType;
                    if (eventType === "academicExcellence") {
                      label = "  הצטיינות לימודית";
                    } else if (eventType === "associateHonors") {
                      label = " הצטיינות חברתית";
                    } else if (eventType === "Verbal violence") {
                      label = " אלימות מילולית";
                    } else if (eventType === "physical violence") {
                      label = " אלימות פיזית";
                    } else {
                      label = eventType;
                    }
                    return (
                      <Text key={date}>
                        {`${date} - ${label}${
                          notes !== "" ? ` (${notes})` : ""
                        }`}
                      </Text>
                    );
                  })}
                </View>
              ))
            ))}

          <TouchableOpacity
            onPress={handleMyChoice1Button}
            style={[styles.button, { backgroundColor: "white" }]}
          >
            <Text style={styles.buttonText}>{myChoice1} </Text>
          </TouchableOpacity>

          {myChoice1ForShow &&
            icon1 == true &&
            (Object.entries(myChoice1Result).length === 0 ? (
              <Text>אין דיווחים בתאריכים אלו </Text>
            ) : (
              Object.entries(myChoice1Result).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 16,
                      textDecorationLine: "underline",
                    }}
                  >
                    {courseName}
                  </Text>
                  {data.map(({ date, myChoice, note }) => {
                    let label = myChoice;
                    if (myChoice === "sad") {
                      label = " הערכה שלילית";
                    } else {
                      label = " הערכה חיובית";
                    }
                    return (
                      <Text key={date}>
                        {`${date} - ${label}${note !== "" ? ` (${note})` : ""}`}
                      </Text>
                    );
                  })}
                </View>
              ))
            ))}

          {myChoice1ForShow &&
            icon1 === false &&
            Object.values(myChoice1Result).map((data) => {
              const hasNonEmptyChoice = data.some(
                ({ myChoice }) => myChoice !== ""
              );
              return (
                <View key={data.date}>
                  {hasNonEmptyChoice ? (
                    data.map(
                      ({ date, myChoice }) =>
                        myChoice !== "" && (
                          <Text key={date}>{`${date} - ${myChoice}`}</Text>
                        )
                    )
                  ) : (
                    <Text>אין דיווחים בתאריכים אלו </Text>
                  )}
                </View>
              );
            })}

          <TouchableOpacity
            onPress={handleMyChoice2Button}
            style={[styles.button, { backgroundColor: "white" }]}
          >
            <Text style={styles.buttonText}>{myChoice2} </Text>
          </TouchableOpacity>

          {myChoice2ForShow &&
            icon2 == true &&
            (Object.entries(myChoice2Result).length === 0 ? (
              <Text>אין דיווחים בתאריכים אלו </Text>
            ) : (
              Object.entries(myChoice2Result).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 16,
                      textDecorationLine: "underline",
                    }}
                  >
                    {courseName}
                  </Text>
                  {data.map(({ date, myChoice, note }) => {
                    let label = myChoice;
                    if (myChoice === "sad") {
                      label = "הערכה שלילית";
                    } else {
                      label = "הערכה חיובית ";
                    }
                    return (
                      <Text key={date}>
                        {`${date} - ${label}${note !== "" ? ` (${note})` : ""}`}
                      </Text>
                    );
                  })}
                </View>
              ))
            ))}

          {myChoice2ForShow &&
            icon2 === false &&
            Object.values(myChoice2Result).map((data) => {
              const hasNonEmptyChoice = data.some(
                ({ myChoice }) => myChoice !== ""
              );
              return (
                <View key={data.date}>
                  {hasNonEmptyChoice ? (
                    data.map(
                      ({ date, myChoice }) =>
                        myChoice !== "" && (
                          <Text key={date}>{`${date} - ${myChoice}`}</Text>
                        )
                    )
                  ) : (
                    <Text>אין דיווחים בתאריכים אלו </Text>
                  )}
                </View>
              );
            })}
        </View>
        <Text>{"\n\n\n\n\n\n\n\n\n\n\n\n"}</Text>
      </ScrollView>

      <Navbar />
    </View>
  );
};

export default HistoryForStudent;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: 300,
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  container: {
    flex: 1,
    backgroundColor: "#F2E3DB",
    alignItems: "center",
    justifyContent: "center",
  },

  dateItem: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    margin: 12,
    borderRadius: 10,
  },
  percentageData: {
    fontSize: 18,
    fontWeight: "bold",
  },

  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  itemContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginLeft: 20,
    marginRight: 20,
  },
  itemText: {
    fontSize: 22,
    textAlign: "right",
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 10,
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
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  subTitle: {
    fontSize: 20,
    textAlign: "right",
    fontWeight: "bold",
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
});

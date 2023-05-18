import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toolbar from "./Toolbar";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { RadioButton } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";

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

  const handlePresenceButton = () => {
    setPresenceForShow((prevState) => !prevState);
    if (!presenceForShow) {
      getPresence();
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
      try {
        const categoryRef = collection(db, "Diet");
        const q = query(
          categoryRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime)
          // where("t_id", "===", auth.currentUser.uid),
          // where("s_id", "===", s_id)
        );
        querySnapshot = await getDocs(q);
        const dietIdst = [];
        querySnapshot.forEach((doc) => {
          dietIdst.push(doc.id);
        });

        setDietIds(dietIdst);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
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
    <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
      <View>
        <Toolbar />
        <Text style={{ fontSize: 20, padding: 10 }}>היסטוריה </Text>
        <View>
          <Text>מתאריך: </Text>
          <TextInput
            style={[styles.input, { textAlign: "right" }]}
            value={startDateString}
            onChangeText={handleChangeStartDate}
            placeholder="הכנס תאריך מהצורה (DD/MM/YYYY)"
          />
          {validDate ? (
            <Text style={{ color: "green" }}>Correct date</Text>
          ) : (
            <Text style={{ color: "red" }}>Incorrect date</Text>
          )}

          <Text>עד תאריך: </Text>
          <TextInput
            style={[styles.input, { textAlign: "right" }]}
            value={endDateString}
            onChangeText={handleChangeEndDate}
            placeholder="הכנס תאריך מהצורה (DD/MM/YYYY)"
          />
          {validDateTwo ? (
            <Text style={{ color: "green" }}>Correct date</Text>
          ) : (
            <Text style={{ color: "red" }}>Incorrect date</Text>
          )}

          <View>
            <TouchableOpacity onPress={handlePresenceButton}>
              <Text style={styles.continueButtonText}>נוכחות </Text>
            </TouchableOpacity>
            {presenceForShow &&
              Object.entries(presenceResult).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}
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
                      presenceLabel = "נוכחות";
                    }

                    return (
                      <Text key={date}>{`${date} - ${presenceLabel}`}</Text>
                    );
                  })}
                </View>
              ))}

            <TouchableOpacity onPress={handleScoresButton}>
              <Text style={styles.continueButtonText}>ציונים </Text>
            </TouchableOpacity>
            {scoreForShow &&
              Object.entries(scoreResult).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}
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
              ))}

            <TouchableOpacity onPress={handleMoodButton}>
              <Text style={styles.continueButtonText}>מצב נפשי </Text>
            </TouchableOpacity>
            {moodForShow &&
              Object.entries(moodResult).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}
                  >
                    {courseName}
                  </Text>
                  {data.map(({ date, mood, note }) => {
                    let label = mood;
                    if (mood === "bed") {
                      label = "לא טוב";
                    } else if (mood === "medium") {
                      label = "בינוני";
                    } else {
                      label = "טוב";
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
              ))}

            <TouchableOpacity onPress={handleFriendStatusButton}>
              <Text style={styles.continueButtonText}>מצב חברתי </Text>
            </TouchableOpacity>
            {friendStatusForShow &&
              Object.entries(friendStatusResult).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}
                  >
                    {courseName}
                  </Text>
                  {data.map(({ date, friendStatus, note }) => {
                    let label = friendStatus;
                    if (friendStatus === "bed") {
                      label = "לא טוב";
                    } else if (friendStatus === "medium") {
                      label = "בינוני";
                    } else {
                      label = "טוב";
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
              ))}

            <TouchableOpacity onPress={handleDietButton}>
              <Text style={styles.continueButtonText}> תזונה </Text>
            </TouchableOpacity>
            {dietForShow &&
              Object.entries(dietResult).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}
                  >
                    {courseName}
                  </Text>
                  {data.map(({ date, diet, note }) => {
                    let label = diet;
                    if (diet === "bed") {
                      label = "לא טוב";
                    } else {
                      label = "טוב";
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
              ))}

            <TouchableOpacity onPress={handleAppearancesButton}>
              <Text style={styles.continueButtonText}> נראות </Text>
            </TouchableOpacity>
            {appearancesForShow &&
              Object.entries(appearancesResult).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}
                  >
                    {courseName}
                  </Text>
                  {data.map(({ date, appearances, note }) => {
                    let label = appearances;
                    if (appearances === "bed") {
                      label = "לא טוב";
                    } else {
                      label = "טוב";
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
              ))}

            <TouchableOpacity onPress={handleEventsButton}>
              <Text style={styles.continueButtonText}> אירועים מיוחדים </Text>
            </TouchableOpacity>
            {eventsForShow &&
              Object.entries(eventsResult).map(([courseName, data]) => (
                <View key={courseName}>
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}
                  >
                    {courseName}
                  </Text>
                  {data.map(({ date, type, eventType, notes }) => {
                    let label = eventType;
                    if (eventType === "academicExcellence") {
                      label = " הצטיינות לימודית";
                    } else if (eventType === "associateHonors") {
                      label = " הצטיינות חברתית";
                    } else if (eventType === "Verbal violence") {
                      label = " אלימות מילולית ";
                    } else if (eventType === "physical violence") {
                      label = " אלימות פיזית ";
                    } else {
                      label = eventType;
                    }
                    return (
                      <Text key={date}>
                        {`${date} -  ${label}${
                          notes !== "" ? ` (${notes})` : ""
                        }`}
                      </Text>
                    );
                  })}
                </View>
              ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HistoryForStudent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "gray",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    margin: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  continueButtonText: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    margin: 12,
    borderRadius: 10,
  },
  dateItem: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    margin: 12,
    borderRadius: 10,
  },
});

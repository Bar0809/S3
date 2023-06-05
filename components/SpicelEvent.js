import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image,ScrollView, Dimensions} from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { RadioButton } from 'react-native-paper';
import Navbar from "./Navbar";
import { AntDesign } from "@expo/vector-icons";


const { width } = Dimensions.get('window');


const SpicelEvent = ({ route }) => {
    const navigation = useNavigation();
    const { className } = route.params;
    const { courseName } = route.params;
    const { classId } = route.params;
    const { course_id } = route.params;
    const { studentName } = route.params;
    const { studentId } = route.params;


    const [eventType, setEventType] = useState('');
    const [comment, setComment] = useState('');
    const [positiveType, setPositiveType] = useState('');
    const [negativeType, setNegativeType] = useState('');
    const [dateString, setDateString] = useState('');
    const [validDate, setValidDate] = useState(false);
    const [other, setOther] = useState('');

    const handlePositiveSelection = (value) => {
        setEventType('positive');
        setPositiveType(value);
    };

    const handleNegativeSelection = (value) => {
        setEventType('negative');
        setNegativeType(value);
    };

    const handleOtherChange = (value) => {
        setOther(value);
    }

    const handleCommentChange = (value) => {
        setComment(value);
    };

    const handleChangeText = (text) => {
        setDateString(text);
        setValidDate(parseDateString(text, 'dd/mm/yyyy'));
    };

    const handleCreateReport = async () => {
        if (!eventType) {
            Alert.alert('בחר/י סוג אירוע');
            return;
        }

        if (!validDate) {
            Alert.alert('הזן תאריך תקין');
            return;
        }

        let eventTypeText = '';
        if (negativeType === 'other' || positiveType === 'other') {
            eventTypeText = other;
            if (!eventTypeText) {
                Alert.alert('הכנס ערך עבור "אחר"');
                return;
            }
        }


        if (negativeType !== 'other' && eventType === 'negative') {
            eventTypeText = negativeType;
        }

        if (positiveType !== 'other' && eventType === 'positive') {
            eventTypeText = positiveType;
        }

        const startDateArray = dateString.split('/');
        const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
        const startDateTime = new Date(startDateISO);

        const report = {
            course_id,
            s_id: studentId,
            class_id: classId,
            eventType: eventTypeText,
            type: eventType,
            notes: comment || '',
            date: startDateTime,
            t_id: auth.currentUser.uid,
            class_name: className,
            courseName: courseName,
            student_name: studentName
        };

        try {
            const docRef = await addDoc(collection(db, 'Events'), report);
            
            Alert.alert('', 'דו"ח אירוע המיוחד הוגש בהצלחה!')

            navigation.navigate("HomePage");
        } catch (error) {
            Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
        }
    };

    function parseDateString(inputString) {
        const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        const match = inputString.match(dateRegex);

        if (!match) {
            return null;
        }

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; 
        const year = parseInt(match[3], 10);

        const date = new Date(year, month, day);
        if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
            return null;
        }

        if (month > 11) {
            return null;
        }

        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        if (day > lastDayOfMonth) {
            return null;
        }

        const currentDate = new Date();
        const minDate = new Date('2023-01-01');
        if (date < minDate || date >= currentDate) {
            Alert.alert('', 'לא ניתן להכניס תאריך עתידי')
            return null;
        }

        return date;
    }

    return (
        <View style={styles.container}>
      <View>
        <Image source={require("../assets/miniLogo-removebg-preview.png")} />
      </View>

      <View style={styles.title}>
      <Text style={[styles.pageTitle]}> אירועים מיוחדים {"\n"} {studentName} </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.subTitle}>תאריך</Text>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={dateString}
            onChangeText={handleChangeText}
            placeholder="הכנס/י תאריך מהצורה (DD/MM/YYYY)"
          />
          <Text>{"\n"}</Text>
          {dateString && !validDate && (
            <Text style={{ color: "red" }}>ערך לא תקין</Text>
          )}
        </View>
        {validDate && <AntDesign name="check" size={24} color="green" />}
      </View>
           


            <Text style={[{ textAlign: 'right', fontSize: 20, fontWeight: 'bold' }]}>סוג האירוע: </Text>
            <View style={styles.radioContainer}>
                <View style={styles.radioItem}>
                    <RadioButton.Android value="positive" status={eventType === 'positive' ? 'checked' : 'unchecked'} onPress={() => setEventType('positive')} />
                    <Text style={styles.radioLabel}>אירוע חיובי</Text>
                </View>
                <View style={styles.radioItem}>
                    <RadioButton.Android value="negative" status={eventType === 'negative' ? 'checked' : 'unchecked'} onPress={() => setEventType('negative')} />
                    <Text style={styles.radioLabel}>אירוע שלילי </Text>
                </View>
            </View>

            {eventType === 'positive' && (
                <View>
                    <Text style={[{ textAlign: 'right', fontSize: 20, fontWeight: 'bold' }]}>{"\n"}בחר/י את האירוע הרלוונטי:</Text>
                    <View style={styles.radioContainer}>
                        <View style={styles.radioItem}>
                            <RadioButton.Android value="academicExcellence" status={positiveType === 'academicExcellence' ? 'checked' : 'unchecked'} onPress={() => handlePositiveSelection('Academic excellence')} />
                            <Text style={styles.radioLabel}>הצטיינות לימודית</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton.Android value="associateHonors" status={positiveType === 'associateHonors' ? 'checked' : 'unchecked'} onPress={() => handlePositiveSelection('associateHonors')} />
                            <Text style={styles.radioLabel}>הצטיינות חברתית  </Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton.Android value="other" status={positiveType === 'other' ? 'checked' : 'unchecked'} onPress={() => handlePositiveSelection('other')} />
                            <Text style={styles.radioLabel}>אירוע אחר </Text>
                        </View>
                    </View>
                    {positiveType === 'other' && (
                        <View>
                            <Text style={styles.label}>סוג האירוע: </Text>
                            <TextInput style={styles.input} onChangeText={handleOtherChange} 
                                        placeholder="הכנס/י סוג אירוע לבחירתך"
                                        />
                        </View>
                    )}
                    <Text style={styles.label}>הערות: </Text>
                    <TextInput style={styles.input} onChangeText={handleCommentChange} value={comment}
                 placeholder="הכנס/י הערות- לא חובה" />


                </View>
            )}

            {eventType === 'negative' && (
                <View>
                    <Text style={[{ textAlign: 'right', fontSize: 20, fontWeight: 'bold' }]}>{"\n"}בחר/י את האירוע הרלוונטי:</Text>
                    <View style={styles.radioContainer}>
                        <View style={styles.radioItem}>
                            <RadioButton.Android value="Verbal violence" status={negativeType === 'Verbal violence' ? 'checked' : 'unchecked'} onPress={() => handleNegativeSelection('Verbal violence')} />
                            <Text style={styles.radioLabel}>אלימות מילולית</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton.Android value="physical violence" status={negativeType === 'physical violence' ? 'checked' : 'unchecked'} onPress={() => handleNegativeSelection('physical violence')} />
                            <Text style={styles.radioLabel}>אלימות פיזית</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton.Android value="other" status={negativeType === 'other' ? 'checked' : 'unchecked'} onPress={() => handleNegativeSelection('other')} />
                            <Text style={styles.radioLabel}>אירוע אחר </Text>
                        </View>
                    </View>
                    {negativeType === 'other' && (
                        <View>
                            <Text style={styles.label}>סוג האירוע: </Text>
                            <TextInput style={styles.input} onChangeText={handleOtherChange} 
                        placeholder="הכנס/י סוג אירוע לבחירתך" />
                        </View>
                    )}
                    <Text style={styles.label}>הערות: </Text>
                    <TextInput style={styles.input} onChangeText={handleCommentChange} value={comment}
                                          placeholder="הכנס/י הערות- לא חובה" />


                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleCreateReport}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.buttonText}> שלח/י דיווח</Text>
        </View>
      </TouchableOpacity>
      <Text>{"\n\n\n\n\n\n"}</Text>


</ScrollView>



      <Navbar/>
        </View>
    )
}

export default SpicelEvent


const styles = StyleSheet.create({
    name: {
        fontWeight: "bold",
        marginRight: 8,
      },
     
      radioButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginRight: 16,
      },
     
      input: {
        height: 40,
        borderColor: "grey",
        borderWidth: 1,
        padding: 10,
        width: 300,
        backgroundColor: "white",
      },
      inputFreeText: {
        height: 40,
        borderColor: "grey",
        borderWidth: 1,
        padding: 10,
        width: 120,
        backgroundColor: "white",
      },
      container: {
        flex: 1,
        backgroundColor: "#F2E3DB",
        alignItems: "center",
        justifyContent: "center",
      },
      scrollContainer: {
        flex: 1,
        width: "100%",
      },
    
      title: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
      },
      pageTitle: {
        color: "#AD8E70",
        fontSize: 34,
        fontWeight: "bold",
        padding: 10,
        textShadowColor: "rgba(0, 0, 0, 0.25)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
        textAlign: 'center'
      },
      subTitle: {
        fontSize: 24,
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
    radioContainer:{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",

    }
    });
    
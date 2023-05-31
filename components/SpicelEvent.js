import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Toolbar from './Toolbar';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { RadioButton } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';


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
            Alert.alert('Please select an event type');
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
                Alert.alert('Please enter a value for "Other"');
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
            Alert.alert('Error creating report, please try again later');
        }
    };

    function parseDateString(inputString) {
        const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        const match = inputString.match(dateRegex);

        if (!match) {
            return null;
        }

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // JavaScript months are 0-indexed
        const year = parseInt(match[3], 10);

        // Check if the date is valid
        const date = new Date(year, month, day);
        if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
            return null;
        }

        // Check if the month is valid
        if (month > 11) {
            return null;
        }

        // Check if the day is valid for the given month and year
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        if (day > lastDayOfMonth) {
            return null;
        }

        // Check if the date is within the desired range
        const currentDate = new Date();
        const minDate = new Date('2023-01-01');
        if (date < minDate || date > currentDate) {
            Alert.alert('', 'לא ניתן להכניס תאריך עתידי')
            return null;
        }

        return date;
    }

    return (
        <View>
            <Toolbar />
            <View style={styles.report}>
                <Text style={{ fontSize: 20, padding: 10 }}> צור/י דיווח חדש</Text>
                <Ionicons name="create-outline" size={24} color="black" />
            </View>

            <View style={styles.row}>
                <Text style={[{ textAlign: 'right', fontSize: 20, fontWeight: 'bold' }]}>שם התלמיד/ה: </Text>
                <Text style={[{ textAlign: 'right', fontSize: 20 }]}>{studentName}</Text>
            </View>

            <View>
                <Text>תאריך</Text>
                <TextInput style={[styles.input, { textAlign: 'right' }]} value={dateString} onChangeText={handleChangeText} placeholder="הכנס תאריך מהצורה (DD/MM/YYYY)" />
                {validDate ? (
                    <Text style={{ color: 'green' }}>Correct date</Text>
                ) : (
                    <Text style={{ color: 'red' }}>Incorrect date</Text>
                )}
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
                    <Text style={styles.label}>בחר/י את האירוע הרלוונטי: </Text>
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
                            <TextInput style={styles.input} onChangeText={handleOtherChange} />
                        </View>
                    )}
                    <Text style={styles.label}>הערות: </Text>
                    <TextInput style={styles.input} onChangeText={handleCommentChange} value={comment} />

                </View>
            )}

            {eventType === 'negative' && (
                <View>
                    <Text style={styles.label}>בחר/י את האירוע הרלוונטי:</Text>
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
                            <TextInput style={styles.input} onChangeText={handleOtherChange} />
                        </View>
                    )}
                    <Text style={styles.label}>הערות: </Text>
                    <TextInput style={styles.input} onChangeText={handleCommentChange} value={comment} />

                </View>
            )}



            <TouchableOpacity style={[styles.butt]} onPress={handleCreateReport} >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ marginLeft: 5 }}>צור דיווח</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default SpicelEvent


const styles = StyleSheet.create({
    back: {
        padding: '30%'
    },

    report: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'right',
        justifyContent: 'flex-end',
    },
    row: {
        textAlign: 'right',
        flexDirection: 'row-reverse',
        alignItems: 'flex-end'
    },
    radioContainer: {
        textAlign: 'right',
        flexDirection: 'row-reverse',
        // alignItems:'flex-end',
        alignItems: 'center',

    },
    radioItem: {
        padding: 10
    },
    input: {
        height: 40,
        borderColor: 'grey',
        borderWidth: 1,
        padding: 10,
        width: 300,
        backgroundColor: 'white'
    },
    butt: {
        backgroundColor: '#90EE90',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: 100
    },
});


import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Toolbar from './Toolbar';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from './firebase';
import { collection, getDocs, query, doc, where } from 'firebase/firestore';


const HomePage = () => {
    const navigation = useNavigation();
    const [myChoice1, setMyChoice1] = useState('');
    const [myChoice2, setMyChoice2] = useState('');


    useEffect(async () => {
        try {
            const q = query(collection(db, 'users'), where('t_id', '==', auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              console.log(doc.data())
              setMyChoice1(data.myChoice1);
              setMyChoice2(data.myChoice2);
            });
          
          } catch (error) {
            console.error(error);
          }
      }, []);


    return (
        <View style={styles.allPage}>
            <Toolbar />

            <View style={styles.title}>
                <Text style={styles.pageTitle}>דיווח: </Text>
                <MaterialIcons name="update" size={50} color="black" />
            </View>


            <View style={styles.loc}>
                <View style={styles.row}>
                    <TouchableOpacity style={[styles.butt, { backgroundColor: '#f6f9ff' }]} onPress={() => navigation.navigate('ChooseClass', { param1: 'Scores' })}>
                        <Text style={styles.text}>ציונים</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.butt, { backgroundColor: '#ecf2ff' }]} onPress={() => navigation.navigate('ChooseClass', { param1: 'Presence' })}>
                        <Text style={styles.text}>נוכחות</Text>
                    </TouchableOpacity>



                </View>
            </View>

            <View style={styles.loc}>
                <View style={styles.row}>
                    <TouchableOpacity style={[styles.butt, { backgroundColor: '#e3ecff' }]} onPress={() => navigation.navigate('ChooseClass', { param1: 'FriendStatus' })}>
                        <Text style={styles.text}>מצב חברתי</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.butt, { backgroundColor: '#dae5ff' }]} onPress={() => navigation.navigate('ChooseClass', { param1: 'Mood' })}>
                        <Text style={styles.text}>מצב רוח</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.loc}>
                <View style={styles.row}>
                    <TouchableOpacity style={[styles.butt, { backgroundColor: '#bed2fe' }]} onPress={() => navigation.navigate('ChooseClass', { param1: 'Appearances' })}>
                        <Text style={styles.text}>נראות</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.butt, { backgroundColor: '#b5ccfe' }]} onPress={() => navigation.navigate('ChooseClass', { param1: 'Diet' })}>
                        <Text style={styles.text}>תזונה</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.loc}>
                <View style={styles.row}>


                    <TouchableOpacity style={[styles.butt, { backgroundColor: '#c7d9fe' }]} onPress={() => navigation.navigate('ChooseClass', { param1: 'Events' })}>
                        <Text style={styles.text}>אירועים מיוחדים</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.row}>

                {myChoice1 && (
                    <TouchableOpacity style={[styles.butt, { backgroundColor: '#ffffff' }]} onPress={() => navigation.navigate('ChooseClass', { param1: 'myChoice1' })}>
                        <Text style={styles.text}>{myChoice1}</Text>
                    </TouchableOpacity>
                )}

                {myChoice2 && (
                    <TouchableOpacity style={[styles.butt, { backgroundColor: '#ffffff' }]} onPress={() => navigation.navigate('ChooseClass', { param1: 'myChoice2' })}>
                        <Text style={styles.text}>{myChoice2}</Text>
                    </TouchableOpacity>
                )}


            </View>




        </View>
    );
}

const styles = StyleSheet.create({
    allPage: {
        flex: 1,
        alignItems: 'center',


    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

    },
    pageTitle: {
        color: 'black',
        fontSize: 60,
        fontWeight: 'bold',
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    butt: {
        borderRadius: 20,
        width: 180,
        height: 65,
        marginHorizontal: 30,
        borderWidth: 1,
    },
    text: {
        fontSize: 30,
        textAlign: 'center',
        padding: 10
    },
    loc: {
        paddingTop: 30,
    },
    back: {
        padding: '30%'
    }


});

export default HomePage;

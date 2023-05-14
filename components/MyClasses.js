import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation,  useFocusEffect} from '@react-navigation/native';
import Toolbar from './Toolbar';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from './firebase';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';


const MyClasses = (props) => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [ids, setIdes] = useState([]);
  const [classesChanged, setClassesChanged] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setClassesChanged(true);
    }, [])
  );
  
  useEffect(() => {
    if (classesChanged) {
      getClasses().then(() => setClassesChanged(false)).catch(console.error);
    }
  }, [classesChanged]);

  const getClasses = async () => {
    const q = query(collection(db, 'Classes'), where('t_id', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    const classNames = [];
    const classIds = [];
    querySnapshot.forEach((doc) => {
      const classData = doc.data();
      if (classData.class_name) {
        classNames.push(classData.class_name);
        console.log("hey")
      }
      classIds.push(doc.id); // Use doc.id instead of classData.class_id
    });
    classNames.sort(); // Sort the classNames array alphabetically
    setData(classNames);
    setIdes(classIds);
  };
  
  

  const handleDeleteStudents = async (className) => {
    const q = query(collection(db, 'Students'), where('t_id', '==', auth.currentUser.uid), where('class_id', '==', className));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    handleDeleteClasses(className)
  };

  const handleDeleteClasses = async (className) => {
    const q = query(collection(db, 'Classes'), where('t_id', '==', auth.currentUser.uid), where('class_name', '==', className));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return;
    }
  
    Alert.alert(
      'Delete Class',
      'Are you sure you want to delete this class?',
      [
        { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Yes', onPress: async () => {
            querySnapshot.forEach(async (doc) => {
              await deleteDoc(doc.ref);
            });
            setData(prevData => prevData.filter(item => item !== className));
          }
        },
      ],
      { cancelable: false }
    );
  };

  const handleAddClass = () => {
    setClassesChanged(true); 
    navigation.navigate('SetDetails');
  };
  
  const renderItem = ({ item, index }) => (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={() => navigation.navigate('ClassDetails', { class_id: ids[index] , class_name: data[index]})}>
        <Text style={{ padding: 10, fontSize: 22, textAlign: 'center', textDecorationLine: 'underline', flexDirection: 'column', justifyContent: 'center' }}>
          {item}
        </Text>

      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteStudents(item)}>
        <MaterialIcons name="delete" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  

  return (
    <View style={styles.allPage}>
      <Toolbar />
      <View style={styles.title}>
        <Text style={styles.pageTitle}> הכיתות שלי:</Text>
        <FontAwesome name="users" size={30} color="black" style={[{ paddingLeft: -50 }]} />
      </View>
      
      <View>
      <TouchableOpacity style={styles.button} onPress={handleAddClass}>
        <Text style={styles.buttonText}>הוסף כיתה</Text>
      </TouchableOpacity>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => item + index}
          contentContainerStyle={{ alignItems: 'center', position: 'relative'}}
        />

      </View>
      
      <TouchableOpacity style={[styles.back, { marginTop: 'auto' }]} onPress={() => navigation.navigate('HomePage') }>
        <MaterialIcons name="navigate-next" size={24} color="black" />
        <Text>הקודם</Text>
      </TouchableOpacity>
    </View>
  );
};


export default MyClasses;

const styles = StyleSheet.create({
  allPage: {
   // flex: 1,
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
    marginTop: 'auto'
  }
  ,
   butt: {
    backgroundColor: '#90EE90',
    borderRadius: 50,
    // padding: 20,
    width: '100%',
    // top: 20,
    // marginBottom: 10,
  },
  butt1: {
    backgroundColor: '#90EE90',
    borderRadius: 50,
    padding: 20,
    width: '80%',
    top: 20,
    marginTop: 'auto',
    bottom: 30,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 50,
    width: '80%',
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
import React from 'react';
import { View, Text, TextInput, StyleSheet,Image, TouchableOpacity} from 'react-native';
import Toolbar from './Toolbar';

const ReportPage = (props) => {
  return (
    <View style={styles.allPage}>
        <Toolbar/>
        <Text style={styles.separation}></Text>
        <Text style={styles.pageTitle}>דיווח:</Text>

        <View style={styles.loc}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.butt1} >
                    <Text style={styles.text}>ציונים</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.butt2}>
                    <Text style={styles.text}>נוכחות</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.loc}>
            <View style={styles.row}>
            <TouchableOpacity style={styles.butt3} >
                    <Text style={styles.text}>מצב חברתי</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.butt4}>
                    <Text style={styles.text}>מצב נפשי</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.loc}>
            <View style={styles.row}>
            <TouchableOpacity style={styles.butt5} >
                <Text style={styles.text}>אלימות</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.butt6}>
                <Text style={styles.text}>אירועים שונים</Text>
            </TouchableOpacity>
            </View>
        </View>

        <View style={styles.loc}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.butt7} >
                    <Text style={styles.text}>נראות</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.butt8}>
                    <Text style={styles.text}>תזונה</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.loc}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.butt9} >
                    <Text style={styles.text}>שונות1</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.butt10}>
                    <Text style={styles.text}>שונות2</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    allPage: {
        backgroundColor:'white'
    },
    pageTitle:{
        color:'black',
        fontSize:60,
        fontWeight:'bold',
        textAlign:'center'        
    },
    row:{
        flexDirection:'row',  
    },
    butt1:{
        backgroundColor:'#f6f9ff',
        borderRadius:20,
        width: 180,
        height: 65,
        marginHorizontal: 30,
        borderWidth:1,
    },
    butt2:{
        backgroundColor:'#ecf2ff',
        borderRadius:20,
        width: 180,
        height: 65,
        borderWidth:1,
        shadowColor: 'blue',
    },
    butt3:{
        backgroundColor:'#e3ecff',
        borderRadius:20,
        width: 180,
        height: 65,
        marginHorizontal: 30,
        borderWidth:1,
    },
    butt4:{
        backgroundColor:'#dae5ff',
        borderRadius:20,
        width: 180,
        height: 65,
        borderWidth:1,
        shadowColor: 'blue',
    },
    butt5:{ 
        backgroundColor:'#d1dfff',
        borderRadius:20,
        width: 180,
        height: 65,
        marginHorizontal: 30,
        borderWidth:1,
    },
    butt6:{
        backgroundColor:'#c7d9fe',
        borderRadius:20,
        width: 180,
        height: 65,
        borderWidth:1,
        shadowColor: 'blue',
    },
    butt7:{
        backgroundColor:'#bed2fe',
        borderRadius:20,
        width: 180,
        height: 65,
        marginHorizontal: 30,
        borderWidth:1,
    },
    butt8:{
        backgroundColor:'#b5ccfe',
        borderRadius:20,
        width: 180,
        height: 65,
        borderWidth:1,
        shadowColor: 'blue',
    },
    butt9:{
        backgroundColor:'#abc5fe',
        borderRadius:20,
        width: 180,
        height: 65,
        marginHorizontal: 30,
        borderWidth:1,
    },
    butt10:{
        backgroundColor:'#A8B5E0',
        borderRadius:20,
        width: 180,
        height: 65,
        borderWidth:1,
        shadowColor: 'blue',
    },
    text: {
        fontSize:30,
        textAlign: 'center',
        padding:10
    },
    loc:{
        paddingTop:25,
    }
  
});

export default ReportPage;

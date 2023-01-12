

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FullLogin from './components/FullLogin';
import HomePage from './components/HomePage';
import Fpassword from './components/Fpassword';
import SignUp from './components/SignUp';
import ReportPage from './components/ReportPage';


// import * as firebase from 'firebase/app';
// import 'firebase/analytics';
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";


// const firebaseConfig = {
//   apiKey: "AIzaSyDe3ywgZ524Z4oitwxSNAD30g0j6MiP0HQ",
//   authDomain: "tikita-76085.firebaseapp.com",
//   projectId: "tikita-76085",
//   storageBucket: "tikita-76085.appspot.com",
//   messagingSenderId: "1036872786088",
//   appId: "1:1036872786088:web:4b3efbe53e85c4f509629d",
//   measurementId: "G-VQP79DTMSH"
// };

// if (analytics.isSupported()) {
  // Initialize the Firebase Analytics library
  // firebase.initializeAnalytics(firebaseConfig);
// }

// const app = initializeApp();
// const analytics = getAnalytics(app);

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="FullLogin" component={FullLogin}/>
        <Stack.Screen name="HomePage" component={HomePage}/>
        <Stack.Screen name="SignUp" component={SignUp}/>
        <Stack.Screen name="Fpassword" component={Fpassword}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
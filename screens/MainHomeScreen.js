import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import HomeScreen from './HomeScreen.js';
import ProfileScreen from './ProfileScreen.js';
import StandingsScreen from './StandingsScreen.js';
import ExploreScreen from './ExploreScreen.js';

import {
  HomeIcon,
  ExploreIcon,
  StandingsIcon,
  ProfileIcon,
} from '../assets/icons';

const Tab = createBottomTabNavigator();

// const user = auth().currentUser;

export default function App(props) {
  useEffect(() => {
    // if(auth().currentUser){
    //   // getUser()
    //   console.log('user from main home screen '+auth().currentUser)
    // }else{
    //   console.log("Current user not found in main home screen")
    // }
  }, []);

  // //get user to firebase
  // async function getUser(){

  //   firestore()
  //     .collection('Users')
  //     .doc(auth().currentUser.uid)
  //     .onSnapshot(documentSnapshot => {
  //       if(documentSnapshot.exists){
  //         if(!documentSnapshot.data().name){
  //             console.log("navigate to profile");
  //             props.navigation.navigate("Profile");
  //         }
  //       }

  //     });

  // }

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? (
              <Text style={styles.HomeButton}>Home{'\n'}.</Text>
            ) : (
              <HomeIcon />
            );
          } else if (route.name === 'Explore') {
            iconName = focused ? (
              <Text style={styles.HomeButton}>News{'\n'}.</Text>
            ) : (
              <ExploreIcon />
            );
          } else if (route.name === 'Standings') {
            iconName = focused ? (
              <Text style={styles.HomeButton}>Standings{'\n'}.</Text>
            ) : (
              <StandingsIcon />
            );
          } else if (route.name === 'Profile') {
            iconName = focused ? (
              <Text style={styles.HomeButton}>My Profile{'\n'}.</Text>
            ) : (
              <ProfileIcon />
            );
          }

          // You can return any component that you like here!
          return <View>{iconName}</View>;
        },
        // tabBarActiveTintColor: 'tomato',
        // tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          width: '100%',
          height: 85,
          backgroundColor: '#222232',
          borderTopWidth: 0,
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Standings" component={StandingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  HomeButton: {
    color: '#246BFD',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

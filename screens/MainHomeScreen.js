import  React ,{useEffect,useState} from 'react';
import { Text, View,StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import HomeScreen from './HomeScreen.js';
import ProfileScreen from './ProfileScreen.js';
import StandingsScreen from './StandingsScreen.js';
import ExploreScreen from './ExploreScreen.js';


import{
  HomeIcon,
  ExploreIcon,
  StandingsIcon,
  ProfileIcon,
  Home,
  News,
  Discover,
  Profile,
  Filled_Home,
  Filled_News,
  Filled_Discover,
  Filled_Profile
} from '../assets/icons';



  const Tab = createBottomTabNavigator();
  
  export default function App(props) {
    return (
        <Tab.Navigator 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? <View style={{margin:10,borderBottomWidth:2,borderBottomColor:'white',padding:10}}><Filled_Home/></View>   :<View style={{margin:10}}><Home/></View> ;
            } else if (route.name === 'Explore') {
              iconName = focused ? <View style={{margin:10,borderBottomWidth:2,borderBottomColor:'white',padding:10}}><Filled_News/></View> :<View style={{margin:10}}><News/></View> ;
            }else if (route.name === 'Standings') {
              iconName = focused ? <View style={{margin:10,borderBottomWidth:2,borderBottomColor:'white',padding:10}}><Filled_Discover/></View> :<View style={{margin:10}}><Discover/></View> ;
            }else if (route.name === 'Profile') {
              iconName = focused ? <View style={{margin:10,borderBottomWidth:2,borderBottomColor:'white',padding:10}}><Filled_Profile/></View> : <View style={{margin:10}}><Profile/></View>;
            }

            return <View >{iconName}</View>;
          },
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: '#000000',
            borderTopWidth: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 40,
          }
        })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Explore" component={ExploreScreen} />
          <Tab.Screen name="Standings" component={StandingsScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      
    );
  }

  const styles = StyleSheet.create({
    HomeButton:{
      color: '#246BFD',
      textAlignVertical: "center",
      textAlign: "center",
      fontWeight:"bold"
    }
  })
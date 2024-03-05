import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, SafeAreaView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Button,
  ScrollView,
  Center,
  Image,
  Text,
  Avatar,
  View,
  Modal,
  HStack,
  Spinner,
  Heading,
  Pressable,
  NBBox,
  Box,
  Input,
  Stack,
  VStack
} from 'native-base';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { EditProfileImage } from '../assets/icons';
import ProfileScreenMyPro from '../screens/ProfileScreenMyPro.js'
import ProfileScreenSupport from '../screens/ProfileScreenSupport.js';
import LoadingModal from '../screens/LoadingModal.js';




import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import database from '@react-native-firebase/database';

const Tab = createMaterialTopTabNavigator();


function ProfileScreen(props) {
  // const databaseRef = database().ref('/');

  // const user = auth().currentUser;

  const [profileImage, setProfileImage] = useState();
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const [uName, setUName] = useState();

  //const [editeMode, setEditMode] = useState(false);

  // const [userName, setUserName] = useState("");
  // const [editeNameMode, setEditNameMode] = useState(false);

  // const [userEmail, setUserEmail] = useState("");
  // const [editeEmailMode, setEditEmailMode] = useState(false);

  // const [userPhone, setUserPhone] = useState("");

  // const [userAddress, setUserAddress] = useState("");
  // const [editeAddressMode, setEditAddressMode] = useState(false);



  // useEffect(() => {
  //   // console.log("User from profile screen" + user.uid)
  //   if (user) {
  //     const uid= user.uid;
  //     console.log(uid, "uid");
  //     getProfileImage();
  //     databaseRef.child(`whatsappUserData/${uid}`).once('value', (snapshot) => {
  //       const data = snapshot.val();
    
  //       // Do something with the user's data
  //       console.log(data, "data");

  //   })
  // } else {
  //   console.log('No user is currently signed in.');
  // }
  // }, [])



  //Save User data to  firebase
  // function saveUserDataToFirebase() {
  //   firestore()
  //     .collection('Users')
  //     .doc(user.uid)
  //     .set({
  //       email: userEmail
  //     })
  //     .then(() => {
  //       console.log('User updated!');
  //     });
  // }

  //get image from firebase storage
  function getProfileImage() {
    storage()
      .ref('profileImages/' + user.uid)
      .getDownloadURL()
      .then((url) => {
        setProfileImage(url)
      })
      .catch((e) => console.log('Errors while downloading => ', e));
  }

  //Update Image
  function updateImage() {
    const options = {
      maxWidth: 800,
      maxHeight: 800,
      mediaType: "photo",
      quality: 1,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else if (response.assets) {
        //showLoadingModal
        setShowLoadingModal(true);
        console.log('after loading model');
        console.log(user,"user");
        storage()
          .ref("profileImages/" + user.uid)
          .putFile(response.assets[0].uri)
          .then((snapshot) => {
            //console.log(`imagee has been successfully uploaded.`);
            //Update Profile Image
            getProfileImage();
            setShowLoadingModal(false);
          })


      } else {
        console.log(response);
      }
    })
  }

  return (
    <>

      <LoadingModal show={showLoadingModal} />

      <View style={{ backgroundColor: '#181829' }}>
        <View style={{ alignSelf: "center" }} mt="10">
          <Avatar width="100" height="130" source={{
            uri: profileImage
          }}>
          </Avatar>

          <LinearGradient style={styles.add} colors={['#F4A58A', '#ED6B4E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} >
            <Pressable onPress={() => updateImage()}>
              <EditProfileImage />
            </Pressable>
          </LinearGradient>
        </View>

        <Center mt="5">
          <Text fontSize="25" style={{ color: "white" }} mb="5">{uName}</Text>
        </Center>
      </View>



      <Tab.Navigator
        sceneContainerStyle={{ backgroundColor: '#181829' }}
        style={{ backgroundColor: '#181829' }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'MyPro') {
              iconName = focused ? <LinearGradient style={styles.colorButton} colors={['#ED6B4E', '#F4A58A']} start={{ x: 0.4, y: 1.5 }} end={{ x: 0.15, y: 0.0 }} ><Text style={styles.colorButtonText}>My Profile</Text></LinearGradient> : <Text style={styles.colorButtonText}>My Profile</Text>;
            } else if (route.name === 'Support') {
              iconName = focused ? <LinearGradient style={styles.colorButton} colors={['#ED6B4E', '#F4A58A']} start={{ x: 0.4, y: 1.5 }} end={{ x: 0.15, y: 0.0 }} ><Text style={styles.colorButtonText}>Support</Text></LinearGradient> : <Text style={styles.colorButtonText}>Support</Text>;
            }

            return <View >{iconName}</View>;
          },
          tabBarShowLabel: false,
          headerShow: false,
          tabBarPressColor: 'transparent',
          tabBarStyle: {
            width: '100%',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            shadowColor: 'transparent',
            borderTopWidth: 0,
            paddingLeft: "20%",
            paddingRight: "20%",
          },
          //for remove underline
          tabBarIndicatorStyle: {
            width: 0,
          },
          tabBarIconStyle: {
            height: 50,
            minWidth: '100%',
          },
        })}>
        <Tab.Screen name="MyPro" children={() => <ProfileScreenMyPro setUName={setUName} setShowLoadingModal={setShowLoadingModal} />} />
        <Tab.Screen name="Support" component={ProfileScreenSupport} />
      </Tab.Navigator>



    </>
  );

}

export default ProfileScreen;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: undefined,
    width: undefined
  },
  add: {
    backgroundColor: "#F4A58A",
    position: "absolute",
    bottom: 0,
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 30,
    borderStyle: "solid",
    borderWidth: 3,
    borderColor: "#181829",
    alignItems: "center",
    justifyContent: "center"
  },
  colorButton: {
    height: 50,
    borderRadius: 50,
  },
  colorButtonText: {
    height: 50,
    color: "white",
    fontSize: 15,
    textAlign: "center",
    textAlignVertical: "center",
  }
});
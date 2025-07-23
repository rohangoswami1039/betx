import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Center, Text, Avatar, View, Pressable} from 'native-base';

//import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

import {EditProfileImage} from '../assets/icons';
import ProfileScreenMyPro from '../screens/ProfileScreenMyPro.js';
import ProfileScreenSupport from '../screens/ProfileScreenSupport.js';
import LoadingModal from '../screens/LoadingModal.js';

import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function ProfileScreen(props) {
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  return (
    <>
      <View style={{backgroundColor: '#161616'}}>
        <View style={{alignSelf: 'center', marginTop: 40}}>
          <Avatar
            width="150"
            height="150"
            source={{uri: auth().currentUser.photoURL}}
          />
        </View>

        <Center mt="5">
          <Text fontSize="25" style={{color: 'white', marginBottom: 20}}>
            {auth().currentUser.displayName}
          </Text>
        </Center>
      </View>

      <Tab.Navigator
        sceneContainerStyle={{backgroundColor: '#161616'}}
        style={{backgroundColor: '#161616'}}
        screenOptions={({route}) => ({
          tabBarIcon: ({focused}) => {
            let tabLabel;
            if (route.name === 'MyPro') {
              tabLabel = (
                <>
                  {focused ? (
                    <Text
                      style={{
                        borderRadius: 16,
                        fontSize: 16,
                        borderWidth: 2,
                        borderColor: '#F63D68',
                        width: 150,
                        height: 56,
                        color: 'white',
                        textAlignVertical: 'center',
                        textAlign: 'center',
                        backgroundColor: '#1e1e1e',
                      }}>
                      My Profile
                    </Text>
                  ) : (
                    <Text style={[styles.colorButtonText]}>My Profile</Text>
                  )}
                </>
              );
            } else if (route.name === 'Support') {
              tabLabel = (
                <>
                  {focused ? (
                    <Text
                      style={{
                        borderRadius: 16,
                        fontSize: 16,
                        borderWidth: 2,
                        borderColor: '#F63D68',
                        width: 150,
                        height: 56,
                        color: 'white',
                        textAlignVertical: 'center',
                        textAlign: 'center',
                        backgroundColor: '#1e1e1e',
                      }}>
                      Support
                    </Text>
                  ) : (
                    <Text style={[styles.colorButtonText]}>Support</Text>
                  )}
                </>
              );
            }

            return <View style={styles.colorButton}>{tabLabel}</View>;
          },
          tabBarShowLabel: false,
          tabBarPressColor: 'transparent',
          tabBarStyle: {
            justifyContent: 'center',
            backgroundColor: 'transparent',
            shadowColor: 'transparent',
            borderTopWidth: 0,
          },
          tabBarIndicatorStyle: {
            width: 0,
          },
          tabBarIconStyle: {
            height: '100%',
            minWidth: '100%',
          },
        })}>
        <Tab.Screen name="MyPro" children={() => <ProfileScreenMyPro />} />
        <Tab.Screen name="Support" component={ProfileScreenSupport} />
      </Tab.Navigator>
    </>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  colorButton: {
    height: 50,
    borderRadius: 50,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
  colorButtonText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  focusedText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

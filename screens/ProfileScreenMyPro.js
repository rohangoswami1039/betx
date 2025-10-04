import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import {
  PersonRound,
  CallRound,
  EmailRound,
  LocationRound,
  LockIcon,
  EditIcon,
} from '../assets/icons';
import { CustomeAlert } from '../Components';
import { firestore } from './../firebaseConfig';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import Icon from "@react-native-vector-icons/fontawesome";


function ProfileScreenMyPro({ props }) {
  const user = auth().currentUser;
  const [userFind, setUserFind] = useState('');

  const [userName, setUserName] = useState(''); //
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState(''); //
  const [userAddress, setUserAddress] = useState('');
  const [waIdData, setWaId] = useState(''); //
  const [waNameUser, setWaName] = useState('');
  const [TimeStamp, setTimeStamp] = useState(''); //
  const [waNumber, setWaNumber] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [FCMToken, setFCMToken] = useState('');

  //For Custome Alert
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  // For Users Number Update 
  const [newPhoneNumber, setNewPhoneNumber] = useState('');


  const navigation = useNavigation();



useFocusEffect(
  React.useCallback(() => {
    setEditMode(false);
    setNewPhoneNumber('');
    checkUserExists();
  }, [])
);



  useEffect(() => {
    const userdataToFind = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData !== null) {
          const data1 = JSON.parse(userData);
          console.log(data1, 'dataaa1');
          // console.log('stored the value');

          let som = await data1;

          const id = som.user.waId ? som.user.waId : som.user.id;

          checkUserExists(id, som);
        }
      } catch (error) {
        console.log(error, 'idhar error h');
      }
    };
    // },[])
    userdataToFind();

    const createUser = (waId, userData) => {
      console.log(userData, 'idhar dekh kr kro');
      const timeStamp = firestore.FieldValue.serverTimestamp();
      const userRef = firestore().collection('WhatsppALoginData').doc(waId);

      const createUserOnFirestore = () => {
        console.log(userData, 'idhar dekh kr kro second');
        userRef
          .set({
            waId: waId,
            // userName: userData.data.userName ? userData.data.userName : (userData.user ? userData.user.name : ''),
            userEmail: userEmail
              ? userEmail
              : userData.user
                ? userData.user.email
                : '',
            // userName:  userData.data && userData.data.userName ? userData.data.userName : userData.user &&  userData.user.name? userData.user.name :'',
            userName:
              userData.data && userData.data.userName
                ? userData.data.userName
                : userData.user.name
                  ? userData.user.name
                  : '',

            userMobile:
              userData.data && userData.data.userMobile
                ? userData.data.userMobile
                : userData.user
                  ? ''
                  : '',

            userAddress: userAddress,
            waName: waNameUser,
            waNumber: waNumber,
            createdAt: timeStamp,
            updatedAt: timeStamp,
            FCMToken: FCMToken,
          })
          .then(() => {
            console.log('User created successfully!');
          })
          .catch(error => {
            console.error(error, 'salman');
            setAlertTitle('Error');
            setAlertDescription('Error creating user!');
            setAlertVisible(true);
          });
      };

      // check if userData is not null, otherwise wait and retry
      const checkUserData = setInterval(() => {
        if (userData !== null) {
          clearInterval(checkUserData);
          createUserOnFirestore();
        }
      }, 1000); // check every 1 second
    };

    // Get FCM Token for push notifications
    const getFCMToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        setFCMToken(token);
      } catch (error) {
        console.error(error);
      }
    };

    // Call the function to get FCM Token
    getFCMToken();

    return () => {
      // cleanup function
      console.log('Cleanup function called!');
    };
  }, []);

  useEffect(() => {
    {
      getFCMToken();
    }
  }, []);


   const checkUserExists = async () => {
      try {
        const currentUser = auth().currentUser;

        if (!currentUser) {
          console.log('No authenticated user found');
          return;
        }
        
        // Fetch user document from Users collection
        const userDoc = await firestore()
        .collection('Users')
        .doc(currentUser.uid)
        .get();
        console.log('Authenticated user found', userDoc);

        if (userDoc.exists) {
          const userData = userDoc.data();

          // Set user phone if available
          if (userData?.mobile) {
            setUserPhone(userData.mobile);
          } else {
            setUserPhone(null); // show "not added" state
          }

          // Optional: Set waId if stored there
          if (userData?.waId) {
            setWaId(userData.waId);
          }
        } else {
          console.log('User document not found');
          setUserPhone(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };


  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      setFCMToken(token);
      console.log(token);
    } catch (e) {
      console.log(e);
    }
  };

  const signOut = () =>
    Alert.alert('Sign out', 'Are you sure you want to sign out', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Sign out',
        onPress: () => {
          try {
            console.log('Signing out');
            auth().signOut();
            //arshad
            AsyncStorage.clear()
              .then(() => {
                console.log(
                  'All items removed successfully from async storage',
                );
                // props.navigation.replace('Login');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              })
              .catch(error => {
                console.log('Error clearing AsyncStorage: ', error);
              });

            //arshad

            console.log('Signing out after a successful');
          } catch (error) {
            console.log(error.message);
          }
        },
      },
    ]);

  const updatePhoneNumber = async () => {
    try {
      const phoneNumberObj = parsePhoneNumberFromString(newPhoneNumber);

      if (!phoneNumberObj || !phoneNumberObj.isValid()) {
        Alert.alert('Invalid Number', 'Please enter a valid mobile number.');
        return;
      }

      const userId = auth().currentUser.uid;
      await firestore().collection('Users').doc(userId).update({
        mobile: phoneNumberObj.number // stores in +CountryCode format
      });

      setUserPhone(phoneNumberObj.number);
      setEditMode(false);
      console.log('Phone number updated successfully!');
    } catch (error) {
      console.error('Error updating phone number: ', error);
    }
  };


  return (
    <>
      <CustomeAlert
        visible={alertVisible}
        setAlertVisible={setAlertVisible}
        title={alertTitle}
        description={alertDescription}
      />
      <ScrollView style={{ backgroundColor: '#161616', padding: 12 }}>
        <View style={styles.mainView} pl="10" pr="10" mt="10">
          <View style={{ top: 8 }}>
            <PersonRound />
          </View>
          <View
            style={styles.innerView}
            borderBottomWidth={2}
            borderColor="#222232">
            <View style={{ top: 8 }}>
              <Text style={{ color: 'white' }} fontSize="lg">
                Name
              </Text>
              {
                <Text style={{ color: 'white' }}>
                  {auth().currentUser.displayName}
                </Text>
              }
            </View>
          </View>
        </View>

        <View style={styles.mainView} pl="10" pr="10" mt="2">
          <View style={{ top: 8 }}>
            <EmailRound />
          </View>
          <View
            style={styles.innerView}
            borderBottomWidth={2}
            borderColor="#222232">
            <View style={{ top: 8 }}>
              <Text style={{ color: 'white' }} fontSize="lg">
                Email
              </Text>
              <Text style={{ color: 'white' }}>{auth().currentUser.email}</Text>
            </View>
            <View style={{ height: 70 }}>
              <Text></Text>
              <LockIcon />
            </View>
          </View>
        </View>

        <View style={styles.mainView} pl="10" pr="10" mt="2" mb="7">
          <View style={{ marginTop: 12 }} />
          <View style={{ top: 8 }}>
            <CallRound />
          </View>
          <View style={styles.innerView} borderBottomWidth={2} borderColor="#222232">
            <View style={{ top: 8 }}>
              <Text style={{ color: 'white' }} fontSize="lg">Phone Number</Text>

              {editMode ? (
                <TextInput
                  style={{ color: 'white', borderBottomWidth: 1, borderColor: 'gray' }}
                  value={newPhoneNumber}
                  onChangeText={setNewPhoneNumber}
                  placeholder="Enter phone number with country code (+1...)"
                  placeholderTextColor="gray"
                  keyboardType="phone-pad"
                />

              ) : (
                <Text style={{ color: 'white' }}>
                  {userPhone || 'Phone Number is not Added'}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => {
                if (editMode) {
                  updatePhoneNumber();
                } else {
                  setEditMode(true);
                }
              }}
              style={{ marginTop: 12, padding: 6, borderRadius: 8, }}
            >
              <Text style={{ color: 'white' }}>
                {editMode ? 
                  <Icon
                    name='save'
                    size={24}
                    color={'#ffff'}
                  />
                : 
                   <Icon
                    name='edit'
                    size={24}
                    color={'#ffff'}
                  />
                }
              </Text>
            </TouchableOpacity>
          </View>

        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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
              marginTop: 22
            }}
            onPress={() => signOut()}>
            Sign Out
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

export default ProfileScreenMyPro;

const styles = StyleSheet.create({
  heading: {
    color: 'white',
  },
  headingValue: {
    color: 'white',
  },
  mainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 70,
    paddingHorizontal: 12
  },
  signOutButton: {
    fontSize: 20,
    width: 120,
    height: 50,
    color: 'white',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  colorButton: {
    borderRadius: 50,
  },
});

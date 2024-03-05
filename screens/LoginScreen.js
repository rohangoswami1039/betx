import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ImageBackground, TouchableOpacity, Text, View, Image } from 'react-native';
import GmailSignIn from './GmailSignIn';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AppLogo, Avatar1, Avatar2, Avatar3 } from '../assets/icons';


export default function LoginScreen(props) {
  const [currentStep, setCurrentStep] = useState(0);
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user);
        setUser(user);
        saveUser();
        //navigation.navigate('MainHome');
        props.navigation.navigate('MainHome');
      } else {
        console.log('Not logged in');
        props.navigation.navigate('Login');
      }
    });
    return unsubscribe;
  }, []);
  const steps = [
    {
      text: 'Win Big with AI Powered sportspicks',
      image: <Avatar1/>,
      buttonLabel: 'Next',
      subText: 'With a powerful prediction model ensure wins for you.',
    },
    {
      text: 'Multiple sports to choose from',
      image: <Avatar2/>,
      buttonLabel: 'Next',
      subText: 'With a powerful prediction model ensure wins',
    },
    {
      text: 'Get accurate predictions',
      image: <Avatar3/>,
      buttonLabel: 'Google Sign In',
      subText: 'Join today and start your journey',
    },
  ];

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const [user, setUser] = useState();
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    check();
  }, [check]);



  const check = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData !== null && mountedRef.current) {
       // navigation.navigate('MainHome');
        props.navigation.navigate('MainHome');
        console.log('User mobile number retrieved from AsyncStorage: ', userData);
      }
    } catch (error) {
      console.log('Error retrieving user mobile number from AsyncStorage: ', error);
    }
  };

  async function saveUser() {
    console.log('save user called');
    if (user) {
      const userData = JSON.stringify(user);
      await AsyncStorage.setItem('userData', userData);
      firestore()
        .collection('Users')
        .doc(user.uid)
        .onSnapshot(documentSnapshot => {
          if (!documentSnapshot.exists) {
            console.log('User not exists');
            firestore()
              .collection('Users')
              .doc(user.uid)
              .set({
                Name:user.displayName,
                Email:user.email,
                PhoneNumber:user.phoneNumber,
              })
              .then(() => {
                console.log('User updated!');
              });
          } else {
            if (documentSnapshot.data().deactive) {
              auth().signOut();
              ToastAndroid.showWithGravityAndOffset(
                'Your Account is disabled by admin',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
            } else {
              if (!documentSnapshot.data().interest) {
                props.navigation.navigate('InterestScreen');
              }
            }
          }
        });
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#101010',justifyContent:'center',alignItems:'center' }}>
        <View style={{margin:50,marginTop:100}}>
        <AppLogo/>
        </View>
        <View style={{ width: '90%', marginTop: 5 }}>
          <Text style={styles.subtitleText}>{steps[currentStep].text}</Text>
        </View>
        {currentStep === 2 ? <View style={{marginBottom:-30,marginTop:-20,marginLeft:-10,}}>
        {steps[currentStep].image}
        </View>:<View style={{marginBottom:-30,marginTop:-20,marginLeft:30,}}>
        {steps[currentStep].image}
        </View>}
        <View style={styles.contentContainer}>
          {currentStep === 2 && <GmailSignIn navigation={props.navigation} />}
          
          {currentStep !== 2 && <View style={{ marginBottom: 0,alignItems:'flex-end' }}>
            <Text style={{ color: 'white', textAlign: 'center', margin: 20, fontWeight: 'bold' }}>
              {steps[currentStep].subText}
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 15,
                marginBottom: 10,
                width: 160,
                height: 50,
                backgroundColor: '#85057A',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
              onPress={handleNext}>
              <Text style={{ color: 'white', fontSize: 20 }}>{steps[currentStep].buttonLabel}</Text>
            </TouchableOpacity>
          </View>}

        </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#141414',
    alignItems: 'flex-end',
    borderRadius: 10,
    borderWidth:1,
    borderColor:'#181818',
    padding: 20,
    marginVertical: 20,
  },
  subtitleText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    lineHeight: 40,
    fontFamily: 'Syne',
  },
});

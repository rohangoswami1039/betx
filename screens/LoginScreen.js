import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import GmailSignIn from './GmailSignIn';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Actionsheet} from 'native-base';

export default function LoginScreen(props) {
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

  const [user, setUser] = useState();
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
                Name: user.displayName,
                Email: user.email,
                PhoneNumber: user.phoneNumber,
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
                50,
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
    <>
      <View style={{flex: 1, backgroundColor: '#181829'}}>
        <Image
          source={require('../assets/images/AppLogoSlogan.png')}
          alt="Alternate Text"
          style={{width: '100%', height: 200, resizeMode: 'contain'}}
        />
        <Text style={{color: 'white', textAlign: 'center'}}>
          AI Powered Sports Prediction Platform
        </Text>
      </View>

      <Actionsheet isOpen={true} bgColor="transparent">
        <Actionsheet.Content bg={styles.ActionSheet.bgColor}>
          <>
            <GmailSignIn navigation={props.navigation} />
          </>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}

const styles = StyleSheet.create({
  ActionSheet: {
    bgColor: '#222232',
    HeadingColor: '#FFFFFF',
    InputBackgroundColor: '#181829',
  },
  roundedTextInput: {
    borderRadius: 100,
    borderWidth: 2,
    color: '#0E0F0F',
    backgroundColor: '#F5FCFF', 
  },
});

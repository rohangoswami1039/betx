import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import GmailSignIn from './GmailSignIn';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore'; // Ensure you import firestore
import {Actionsheet} from 'native-base';

export default function LoginScreen(props) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true); // Add loading state
  const mountedRef = useRef(false);

  useEffect(() => {
    const checkUserData = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
        props.navigation.navigate('MainHome');
      } else {
        const unsubscribe = auth().onAuthStateChanged(async user => {
          if (user) {
            console.log('User data if user in firebase', userData);
            saveUser(user); // Pass user to saveUser function
            setUser(user);
            setLoading(false);
            props.navigation.navigate('MainHome');
          } else {
            console.log('Not logged in');
            setLoading(false); // Set loading to false if not logged in
          }
        });
        return unsubscribe;
      }
    };
    checkUserData();
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  async function saveUser(user) {
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
                setLoading(false); // Set loading to false after updating user
                props.navigation.navigate('MainHome');
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
              setLoading(false); // Set loading to false if account is disabled
            } else {
              if (!documentSnapshot.data().interest) {
                props.navigation.navigate('MainHome');
              }
              setLoading(false); // Set loading to false if user exists
            }
          }
        });
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
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
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

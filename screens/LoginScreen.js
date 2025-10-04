import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import GmailSignIn from './GmailSignIn';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { firestore } from '../firebaseConfig';
import AppLogoSlogan from '../assets/images/AppLogoSlogan.png'

export default function LoginScreen(props) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [showActionSheet, setShowActionSheet] = useState(true);
  const mountedRef = useRef(false);
  
  const checkUserData = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
      props.navigation.navigate('MainHome');
      console.log('User Is in this Screen');
    } else {
      const unsubscribe = auth().onAuthStateChanged(async user => {
        if (user) {
          console.log('User data if user in firebase', user);
          saveUser(user);
          setUser(user);
          setLoading(false);
          props.navigation.navigate('MainHome');
        } else {
          console.log('Not logged in');
          setLoading(false);
        }
      });
      return unsubscribe;
    }
  };

  useEffect(() => {
    checkUserData();
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      checkUserData();
    }, [props.navigation]),
  );

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
            firestore().collection('Users').doc(user.uid).set({
                Name: user.displayName,
                Email: user.email,
                PhoneNumber: user.phoneNumber,
              })
              .then(() => {
                console.log('User updated!');
                setLoading(false);
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
              setLoading(false);
            } else {
              if (!documentSnapshot.data().interest) {
                props.navigation.navigate('MainHome');
              }
              setLoading(false);
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
      <View style={{ flex: 1, backgroundColor: '#1c1c1c' }}>
        <Image
          source={AppLogoSlogan}
          alt="Alternate Text"
          style={{ width: '100%', height: 200, resizeMode: 'contain' }}
        />
      </View>

      {/* Custom ActionSheet as Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={showActionSheet}
        onRequestClose={() => setShowActionSheet(false)}>
        <TouchableWithoutFeedback onPress={() => setShowActionSheet(false)}>
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.sheet}>
                <View style={[styles.sheetContent, { backgroundColor: styles.ActionSheet.bgColor }]}>
                  <GmailSignIn navigation={props.navigation} />
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  ActionSheet: {
    bgColor: '#161616',
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  sheetContent: {
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});

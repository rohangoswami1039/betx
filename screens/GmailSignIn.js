import React, { useEffect } from 'react';
import { Button, TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const GmailSignIn = (props) => {
  const navigation = useNavigation()

  useEffect(() => {
     GoogleSignin.configure();
  }, []);


  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      console.log('user info', userInfo);
      if (userInfo) {
        try {
          await AsyncStorage.setItem('userData', JSON.stringify(userInfo));
          console.log('User mobile number with gmail saved in AsyncStorage.');
          //props.navigation.replace('MainHome');
          //navigation.replace('MainHome');
          navigation.navigate('MainHome');
        } catch (error) {
          console.log('Error saving user in  gmail login in AsyncStorage: and firebase ', error);
        }
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("SIGN_IN_CANCELLED")
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("statusCodes.IN_PROGRESS")
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("PLAY_SERVICES_NOT_AVAILABLE")
      } else {
        console.log("error:", error);
      }
    }
  };

  return (
   
    <View style={{margin:25}}>
      <Text style={{ color: "white", textAlign: "center",fontWeight:'bold'}}>Join today and start your journey</Text>
      <View>
      <TouchableOpacity
        style={{
          marginTop: 15,
          marginBottom: 10,
          width: 260,
          height: 60,
          backgroundColor: '#85057A',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex:1
        }}
        onPress={signIn}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', fontSize: 25 }}>
          <Image
            source={require('../Images/google.png')}
            style={{ width: 20, height: 20, marginRight: 5 }}
          />
          <Text style={{ color: 'white', fontSize: 18, }}>Sign in with Google</Text>
        </View>
      </TouchableOpacity>
      </View>     
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius:25,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15 ,
    shadowOffset : { width: 1, height: 13},
  },
})


export default GmailSignIn;



`box-shadow: rgba(240, 46, 170, 0.4) 5px 5px, 
             rgba(240, 46, 170, 0.3) 10px 10px, 
             rgba(240, 46, 170, 0.2) 15px 15px, 
             rgba(240, 46, 170, 0.1) 20px 20px, 
             rgba(240, 46, 170, 0.05) 25px 25px;`



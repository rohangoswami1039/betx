import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { firestore } from '../firebaseConfig';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useNavigation,
} from '@react-navigation/native';

const TERMS_KEY = 'hasAcceptedTerms';
const POLICY_TERMS = 'hasAcceptedPolicy';

const GmailSignIn = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    GoogleSignin.configure({
      offlineAccess: false,
      webClientId:
        '140917884578-gdgabdsnvua1vlee8uba768kbe3g454o.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    });

    // Load saved checkbox state
    const loadTerms = async () => {
      try {
        const saved = await AsyncStorage.getItem(TERMS_KEY);
        const saved_Policy = await AsyncStorage.getItem(POLICY_TERMS);
        if (saved && JSON.parse(saved) === true && saved_Policy && JSON.parse(saved_Policy) === true) {
          setAcceptedTerms(true);
          setAcceptedPolicy(true)
        }
      } catch (e) {
        console.log('Error loading saved terms state:', e);
      }
    };
    loadTerms();
  }, []);

  const handleCheck = async (newValue) => {
    try {
      setAcceptedTerms(newValue);
      await AsyncStorage.setItem(TERMS_KEY, JSON.stringify(newValue));
    } catch (e) {
      console.log('Error saving terms state:', e);
    }
  };

  const handlePolicyCheck = async (newValue) => {
    try {
      // ✅ First update and save state
      setAcceptedPolicy(newValue);
      await AsyncStorage.setItem(POLICY_TERMS, JSON.stringify(newValue));

    } catch (e) {
      console.log('Error saving policy state:', e);
    }
  };


  const signIn = async () => {
    if (isSigningIn) {
      console.log('Sign-in already in progress, please wait.');
      return;
    }
    if (!acceptedTerms) {
      console.log('Please accept Terms of Service before signing in.');
      return;
    }

    setIsSigningIn(true);

    try {
      await GoogleSignin.hasPlayServices();
      // Sign out any previous session to ensure fresh sign-in
      await GoogleSignin.signOut();
      const response = await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GithubAuthProvider.credential(idToken);

      const userLoginToken = response.data.idToken;
      if (response && userLoginToken) {
        const googleCredential = auth.GoogleAuthProvider.credential(
          userLoginToken,
        );
        const userInfo = await auth().signInWithCredential(googleCredential);
        // console.log('In My SignIn Google', userInfo);
        if (userInfo) {
          const userRef = firestore()
            .collection('Users')
            .doc(auth().currentUser.uid);
          await userRef.set({
            name: userInfo.user.displayName,
            email: userInfo.user.email,
            photoURL: userInfo.user.photoURL,
            coin: '0',
          });
          console.log('User created successfully!');
        }
      } else {
        console.log('Sign-in was cancelled or no idToken returned');
      }
    } catch (error) {
      if (error && error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('SIGN_IN_CANCELLED');
            break;
          case statusCodes.IN_PROGRESS:
            console.log('Sign-in already in progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Play Services not available or outdated');
            break;
          default:
            console.log('Google Sign-In error:', error);
            break;
        }
      } else {
        console.log('An unexpected error occurred:', error);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
        Join today and start your journey
      </Text>


      {/* Terms Checkbox */}
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={acceptedPolicy}
          onValueChange={handlePolicyCheck}
          tintColors={{ true: '#fff', false: '#fff' }}
          style={{ right: 32 }}
        />
        <Text
          style={styles.policyText}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        >
          I agree to the Policy
        </Text>
      </View>

      {/* Terms Checkbox */}
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={acceptedTerms}
          onValueChange={handleCheck}
          tintColors={{ true: '#fff', false: '#fff' }}
        />
        <Text
          style={styles.termsText}
          onPress={() =>
            Linking.openURL(
              'https://docs.google.com/document/d/151LhA1OvP-qOtm49uXdDBhc8ykmeK1h0TT-z8VkacvU/edit?usp=sharing'
            )
          }>
          I agree to the Terms of Service
        </Text>
      </View>

      {/* Google Sign-In */}
      <TouchableOpacity
        disabled={isSigningIn || !acceptedTerms}
        style={{
          marginTop: 15,
          marginBottom: 10,
          width: Dimensions.get('window').width - 50,
          height: Dimensions.get('window').height / 15,
          backgroundColor: isSigningIn || !acceptedTerms ? '#ccc' : '#fff',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={signIn}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../Images/google.png')}
            style={{ width: 20, height: 20, marginRight: 5 }}
          />
          <Text style={{ color: 'black', fontSize: 18 }}>
            {isSigningIn ? 'Signing In...' : 'Sign in with Google'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default GmailSignIn;

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 },
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 15,
  },
  policyText: {
    color: '#f1f1f1',
    right: 32,
    textDecorationLine: 'underline',
  },
  termsText: {
    color: '#f1f1f1',
    textDecorationLine: 'underline',
  },
});

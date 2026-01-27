import React, {useEffect, useState} from 'react';
import {
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import Router from './screens/Router.js';
import DeviceInfo from 'react-native-device-info';
import { firestore } from './firebaseConfig.js';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AppLogoSlogan from './assets/images/AppLogoSlogan.png';
// import { StripeProvider } from '@stripe/stripe-react-native';


const App = () => {
  const [version, setVersion] = useState('');
  const [versionMessage, setVersionMessage] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);

    useEffect(() => {
    GoogleSignin.configure({
      offlineAccess: false,
      webClientId:
        '140917884578-gdgabdsnvua1vlee8uba768kbe3g454o.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
    });
  }, []);

  const getVersion = async () => {
    try {
      const docRef = firestore().collection('Version').doc('App');
      const data = await docRef.get();
      console.log("My Firestore", data.data());
      
      if (data.exists) {
        const {Version, Message} = data.data();
        setVersion(Version);
        setVersionMessage(Message);
        let myDeviceVersion = DeviceInfo.getVersion();
        console.log(Version,"My Firestore", myDeviceVersion);
        if (Version && Version !== myDeviceVersion) {
          setShowUpdateModal(true); // directly open modal if version mismatch
        }
      }
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  };

  const openPlayStore = () => {
    const playStoreLink =
      'https://play.google.com/store/apps/details?id=com.betx&pcampaignid=web_share';
    Linking.openURL(playStoreLink);
  };

  useEffect(() => {
    getVersion();

    // Set status bar styling
    StatusBar.setBarStyle('light-content', true);
    StatusBar.setBackgroundColor('#1c1c1c');

    SplashScreen.hide();

    // Subscribe to notifications
    messaging()
      .subscribeToTopic('all')
      .then(() => console.log('Subscribed to topic! all'));
  }, []);

  return (
    //  <StripeProvider publishableKey="pk_test_51SQYLkPadpW7zTTuMxKoTpfXd2pUDW0ZlX8KyV7xIZqOEeax2inZgdrLawM4q8Siq7pIptKbPQeNy3UDbg1ThXlO009jLMoBRl">
    <>
      <Modal
        visible={showUpdateModal}
        transparent={true}
        animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
              source={AppLogoSlogan}
              style={styles.logo}
            />
            <Text style={styles.title}>New Update Available</Text>

            <View style={styles.versionRow}>
              <Text style={styles.versionLabel}>Version :</Text>
              <Text style={styles.versionValue}>{version}</Text>
            </View>

            <Text style={styles.message}>{versionMessage}</Text>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={openPlayStore}>
              <Text style={styles.updateButtonText}>Update Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {!showUpdateModal && <Router />}
    </>
    // </StripeProvider>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#161616',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '85%',
  },
  logo: {
    width: '80%',
    maxWidth: 300,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  versionRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  versionLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  versionValue: {
    color: 'white',
    marginLeft: 5,
  },
  message: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  updateButton: {
    backgroundColor: '#AB0003',
    width: 300,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default App;
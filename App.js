import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import HomeScreen from './screens/HomeScreen.js';
import Router from './screens/Router.js';
import {Actionsheet, Button, NativeBaseProvider} from 'native-base';
import {useState} from 'react';
import {Image} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';

const App = () => {
  const [version, set_version] = useState('');
  const [version_message, set_versionmessage] = useState('');

  const getVersion = async () => {
    const docRef = firestore().collection('Version').doc('App');
    await docRef.get().then(data => {
      if (data.exists) {
        set_version(data.data().Version);
        set_versionmessage(data.data().Message);
      }
    });
  };
  useEffect(() => {
    getVersion();
  }, []);
  const openPlayStore = () => {
    const playStoreLink =
      'https://play.google.com/store/apps/details?id=com.betx&pcampaignid=web_share';
    Linking.openURL(playStoreLink);
  };

  useEffect(() => {
    const linkingEvent = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({url});
      }
    });
    return () => {
      linkingEvent.remove();
    };
  }, [handleDeepLink]);

  const handleDeepLink = async url => {
    const searchParams = new URLSearchParams(new URL(url.url).search);
    const waId = searchParams.get('waId');
  };

  useEffect(() => {
    //for status bar color
    StatusBar.setBarStyle('light-content', true);
    StatusBar.setBackgroundColor('#1c1c1c');

    SplashScreen.hide();
    //subscribe to notifications
    messaging()
      .subscribeToTopic('all')
      .then(() => console.log('Subscribed to topic! all'));
  }, []);
  if (version && version !== DeviceInfo.getVersion()) {
    return (
      <NativeBaseProvider>
        <View
          style={{
            flex: 1,
            backgroundColor: '#161616',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Image
            source={require('./assets/images/AppLogoSlogan.png')}
            alt="Alternate Text"
            style={{
              width: '80%',
              maxWidth: 300,
              height: 200,
              resizeMode: 'contain',
            }}
          />
          <Actionsheet isOpen={true}>
            <Actionsheet.Content bg={'#161616'}>
              <View
                style={{
                  justifyContent: 'center',
                  marginTop: 10,
                  marginBottom: 20,
                }}>
                <Text
                  style={{color: 'white', fontSize: 25, fontWeight: 'bold'}}>
                  New Update Available
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 10,
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    Version :
                  </Text>
                  <Text style={{color: 'white', marginLeft: 5}}>{version}</Text>
                </View>
              </View>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 20,
                }}>
                {version_message}
              </Text>
              <View>
                <Button
                  size="lg"
                  variant="outline"
                  _text={{color: 'white', fontWeight: 'bold'}}
                  style={{
                    backgroundColor: '#AB0003',
                    width: 300,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 15,
                    borderWidth: 1,
                    marginTop: 20,
                    marginBottom: 30,
                    borderColor: '#fff', // White border around the button
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                  onPress={openPlayStore}>
                  Update Now
                </Button>
              </View>
            </Actionsheet.Content>
          </Actionsheet>
        </View>
      </NativeBaseProvider>
    );
  } else {
    return <Router />;
  }
};

export default App;

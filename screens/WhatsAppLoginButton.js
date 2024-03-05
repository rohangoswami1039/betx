import React, { useCallback } from 'react';
import { Alert, Button, Linking, TouchableOpacity, Text, Image, View } from 'react-native';
import LoadingModal from './LoadingModal.js';
import { useNavigation } from '@react-navigation/native';
const WhatsAppLoginButton = ({navigation}) => {

  const handlePress = useCallback(async () => {
    const url =
      'https://betxapp.authlink.me?redirectUri=betxappotpless://otpless';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    

    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, []);

  return (
    <>
     
      <View> 
         <TouchableOpacity
          style={{
            marginTop: 15,
            width: 360,
            height: 60,
            backgroundColor: '#25d366',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handlePress}>
          <View style={{ flexDirection: 'row', alignItems: 'center', fontSize: 25 }}>

            <Image
              source={require('../Images/whatsapp.png')}
              style={{ width: 30, height: 30, marginRight: 10 }}
            />
            <Text style={{ color: '#fff', fontWeight: "600", fontSize: 18 }}>

              Continue with WhatsApp
            </Text>
          </View>
        </TouchableOpacity>

      </View >


    </>
  );


};

export default WhatsAppLoginButton;
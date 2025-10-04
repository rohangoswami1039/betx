import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Text, View, Button, Pressable } from 'native-base';

import { useNavigation } from '@react-navigation/native';

import { ArrawDown, ArrawRight } from '../assets/icons';

function ProfileScreenSupport(props) {
  const navigation = useNavigation();
  const [expandFaq, setExpandFaq] = useState(false);
  return (
    <ScrollView style={{ backgroundColor: '#161616', padding: 20, }}>
      {/* <TouchableOpacity onPress={() => { navigation.navigate("PredictionHistory");}}>
            <View ml="12" mr="12" mt="10"  pb="5" style={{flexDirection: 'row',justifyContent:'space-between'}}borderBottomWidth={2} borderColor="#222232">
                <View>
                    <Text style={{color: 'white'}}>Prediction History </Text>
                    </View>
                <ArrawRight/>
            </View>
            </TouchableOpacity>  */}
      <TouchableOpacity
        onPress={() => {
          setExpandFaq(!expandFaq);
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 2,
            top: 40,
            borderColor: "#222232"
          }}
          borderColor="#222232">
          <View style={{ paddingBottom: 8 }}>
            <Text style={{ color: 'white', paddingBottom: 8 }}>FAQ’s </Text>
          </View>
          {expandFaq ? <ArrawDown /> : <ArrawRight />}
        </View>
      </TouchableOpacity>
      {expandFaq ? (
        <View>
          <View style={{
            paddingBottom: 8,
            top: 39
          }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>What is EdgePX?</Text>
            <Text mt="2" style={{ color: 'white', padding: 2 }}>
              EdgePX is an AI-powered sports prediction platform that analyzes data, trends, players, stats, and patterns to generate match odds and predictions.
            </Text>
          </View>
          <View style={{
            paddingBottom: 8,
            top: 42
          }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              How accurate are the predictions?{' '}
            </Text>
            <Text mt="2" style={{ color: 'white', padding: 2 }}>
              For full transparency, we maintain a public, transparent record of past predictions to show historical win rates. You can view past matches within the app or at{' '}
              <Text
                style={{ textDecorationLine: 'underline', color: '#00BFFF' }}
                onPress={() => Linking.openURL('https://www.edgepx.com')}
              >
                www.edgepx.com
              </Text>
              . However, past results do not guarantee future results, and EdgePX is to be used for entertainment purposes only, at your own risk.
            </Text>
          </View>
          <View style={{
            paddingBottom: 8,
            top: 40
          }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              Can I use EdgePX to make betting decisions?
            </Text>
            <Text mt="2" style={{ color: 'white', padding: 2 }}>
              EdgePX is a predictive AI company. We strive to improve our model to make statistical, data-driven predictions that humans cannot make. EdgePX is strictly for entertainment and educational use. Any decisions you make based on our predictions are entirely at your own risk.
            </Text>
          </View>
          <View style={{
            paddingBottom: 8,
            top: 40
          }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              What sports do you cover?{' '}
            </Text>
            <Text mt="2" style={{ color: 'white', padding: 2 }}>
              Currently, our model is focused on football (soccer). In the future, we plan to expand to other sports. If there is a particular sport you’d like to see added to the platform, please reach out to us at{' '}
              <Text
                style={{ textDecorationLine: 'underline', color: '#00BFFF' }}
                onPress={() => Linking.openURL('help@edgpx.com')}
              >
                help@edgpx.com 
              </Text>
               {' '}and let us know!
            </Text>
          </View>
          <View style={{
            paddingBottom: 8,
            top: 40
          }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              Is there a cost to use EdgePX?
            </Text>
            <Text mt="2" style={{ color: 'white' }}>
              It’s 100% free to get started at EdgePX and gain access to our free daily predictions. A premium subscription is available to unlock our premium match predictions.
            </Text>
          </View>

          <View style={{
            paddingBottom: 8,
            top: 40
          }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              What EdgePX apps are available?
            </Text>
            <Text mt="2" style={{ color: 'white', padding: 2 }}>
              Currently, EdgePX is available for Android in the Google Play Store and on the web at {' '}
              <Text
                style={{ textDecorationLine: 'underline', color: '#00BFFF' }}
                onPress={() => Linking.openURL('https://www.edgepx.com')}
              >
                www.edgepx.com.
              </Text>
               {' '}An Apple / iOS version is coming soon, but in the meantime, iOS users can access the full EdgePX experience on the EdgePX website.
            </Text>
          </View>
          <View style={{
            paddingBottom: 8,
            top: 40
          }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              How do I contact EdgePX for support?
            </Text>
            <Text mt="2" style={{ color: 'white', padding: 2 }}>
              You can reach our support team at  {' '}
              <Text
                style={{ textDecorationLine: 'underline', color: '#00BFFF' }}
                onPress={() => Linking.openURL('help@edgepx.com.')}
              >
                help@edgepx.com.
              </Text>
               {' '}We’ll be happy to assist with technical issues, account questions, or general inquiries.

            </Text>
          </View>
        </View>
      ) : null}
      <TouchableOpacity
        style={{
          paddingTop: 12,
          paddingBottom: 12,
          borderBottomWidth: 2,
          top: 50,
          borderColor: "#222232"
        }}
        onPress={() => {
          Linking.openURL('mailto:betxperfect@gmail.com');
        }}>
        <View>
          <Text style={{ color: 'white' }}>Email </Text>
          <Text style={{ color: 'white' }}>help@edgepx.com</Text>
        </View>
      </TouchableOpacity>
      {/* <View ml="12" mr="12" mt="5"  pb="5"borderBottomWidth={2} borderColor="#222232">
                    <Text style={{color: 'white'}}>Contact</Text>
                    <Text style={{color: 'white'}}>+91 0123456789</Text>
            </View>
            <TouchableOpacity onPress={() => { Linking.openURL('https://goo.gl/maps/H2Ar8PAZSzzSgz1h6')}}>
                <View ml="12" mr="12" mt="5"  pb="5" mb="5"borderBottomWidth={2} borderColor="#222232">
                        <Text style={{color: 'white'}}>Address </Text>
                        <Text style={{color: 'white'}}>Pune, Maharashtra </Text>
                </View>
            </TouchableOpacity> */}
    </ScrollView>
  );
}

export default ProfileScreenSupport;

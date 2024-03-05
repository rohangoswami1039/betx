import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, extendTheme } from 'native-base';
const Stack = createNativeStackNavigator();

import MainHomeScreen from './MainHomeScreen.js';
import LoginScreen from './LoginScreen.js';
import Test from './Test.js';
import InterestScreen from './InterestScreen.js';
import BetImageScreen from './BetImageScreen.js';
import PredictionHistory from './PredictionHistory.js';
import NotificationScreen from './NotificationScreen.js';
import ExploreArticleDetails from './ExploreArticleDetails.js';
import NoInternetScreen from './NoInternetScreen.js';
import VideoAd from './VideoAd.js';
import HomeScreen from './HomeScreen.js';
import Wallet from './Wallet.js';
import Notification from './Notification.js';

function Router({ props, navigation }) {
 
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false, animation: 'default' }}>
          {/* <Stack.Screen  name="Test" component={Test} /> */}
          <React.Fragment>

            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="MainHome" component={MainHomeScreen} />
            <Stack.Screen name="InterestScreen" component={InterestScreen} />
            <Stack.Screen name="BetImageScreen" component={BetImageScreen} />
            <Stack.Screen name='VideoAd' component={VideoAd} />
            <Stack.Screen name='Wallet' component={Wallet} />
            <Stack.Screen name='Notification' component={Notification} />


           
            <Stack.Screen
              name="PredictionHistory"
              component={PredictionHistory}
            />
            <Stack.Screen
              name="NotificationScreen"
              component={NotificationScreen}
            />
            <Stack.Screen
              name="ExploreArticleDetails"
              component={ExploreArticleDetails}
            />
            <Stack.Screen
              name="NoInternetScreen"
              component={NoInternetScreen}
            />
          </React.Fragment>
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default Router;

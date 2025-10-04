import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import ProfileScreenMyPro from '../screens/ProfileScreenMyPro.js';
import ProfileScreenSupport from '../screens/ProfileScreenSupport.js';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator(); // ✅ define once, not inside component

function ProfileScreen() {
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#161616', paddingTop: insets.top, paddingBottom: insets.bottom }}>
      
       {/* Profile Header */}
      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <Image
          source={{ uri: auth().currentUser?.photoURL }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{auth().currentUser?.displayName}</Text>
      </View> 

      {/* Tabs */}
      <View style={{flex: 1}}>
        <Tab.Navigator
          sceneContainerStyle={{ backgroundColor: '#161616' }}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {
              const labelStyleFocused = {
                borderRadius: 16,
                fontSize: 16,
                borderWidth: 2,
                borderColor: '#F63D68',
                width: 150,
                height: 56,
                color: 'white',
                textAlignVertical: 'center',
                textAlign: 'center',
                backgroundColor: '#1e1e1e',
                lineHeight: 56,
              };

              const labelStyleUnfocused = [styles.colorButtonText];

              let tabLabel;
              if (route.name === 'MyPro') {
                tabLabel = focused
                  ? <Text style={labelStyleFocused}>My Profile</Text>
                  : <Text style={labelStyleUnfocused}>My Profile</Text>;
              } else if (route.name === 'Support') {
                tabLabel = focused
                  ? <Text style={labelStyleFocused}>Support</Text>
                  : <Text style={labelStyleUnfocused}>Support</Text>;
              }

              return <View style={styles.colorButton}>{tabLabel}</View>;
            },
            tabBarShowLabel: false,
            tabBarPressColor: 'transparent',
            tabBarStyle: {
              justifyContent: 'center',
              backgroundColor: 'transparent',
              shadowColor: 'transparent',
              borderTopWidth: 0,
            },
            tabBarIndicatorStyle: { width: 0 },
            tabBarIconStyle: { height: '100%', minWidth: '100%' },
          })}
        >
          <Tab.Screen name="MyPro" component={ProfileScreenMyPro} />
          <Tab.Screen name="Support" component={ProfileScreenSupport} />
        </Tab.Navigator>
      </View>
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ccc',
  },
  userName: {
    fontSize: 25,
    color: 'white',
    marginTop: 20,
    marginBottom: 20,
  },
  colorButton: {
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorButtonText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
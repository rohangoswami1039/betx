import React from 'react';
import {View }from 'react-native';
import{
    LockIcon,
  } from '../../assets/icons';

function LockButton(props) {
    return (
        <View
        style={{
            position: 'absolute',justifyContent: 'center',alignItems: 'center',
            height: 30,
            width: 30,
            borderRadius: 15,
            //margin: 10,
            //shadowColor: 'rgba(0,0,0,0.5)',
            shadowColor: '#222A32',
            shadowOffset: {width: 30, height:30},
            shadowOpacity: 1,
            shadowRadius: 5,
            elevation: 10,
            backgroundColor: 'rgba(0,0,0,0.2)',
            left: -15,top:8,

          
        }}>
        <LockIcon/>
    </View>
    );
};

export default LockButton;
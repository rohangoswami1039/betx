import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BetexLogo } from '../assets/icons'

export default function Notification(props) {
  return (
    <View style={{ flex: 1, backgroundColor: '#101010' }}>
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={{ flex: 1, resizeMode: 'cover' }}
    >
      <View style={{flex:1}}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
          <BetexLogo style={{ margin:10, width: 40, height: 50 }} />
          <View style={{ flexDirection: 'row' }}>
           
          </View>
        </View>


        

        
      </View>     
    </ImageBackground>
  </View>
  )
}

const styles = StyleSheet.create({})
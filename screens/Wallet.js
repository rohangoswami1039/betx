import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { RewardAvatar, BetexLogo, Coin, Notification } from '../assets/icons'

export default function Wallet(props) {
  return (
    <View style={{ flex: 1, backgroundColor: '#101010' }}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={{ flex: 1, resizeMode: 'cover' }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
            <BetexLogo style={{ margin: 15, width: 40, height: 50 }} />
            <View style={{ flexDirection: 'row' }}>
              <View style={{ marginVertical: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(62, 60, 60, 0.4)', width: 100, height: 33, borderRadius: 40, borderTopWidth: 1, borderTopColor: 'rgba(256,256,256, 0.8)', borderLeftWidth: 1, borderLeftColor: 'rgba(256,256,256, 0.8)', borderRightWidth: 1, borderRightColor: 'white', borderBottomWidth: 0 }}>
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <View style={{ width: 43, height: 43, marginTop: -6, borderRadius: 40, marginLeft: -50 }}>
                    <Coin />
                  </View>
                  <View style={{ marginTop: 6 }}>
                    <Text style={{ color: 'white', marginLeft: 15, fontSize: 16, fontWeight: 'bold' }}>{300}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => props.navigation.navigate("Notification")} style={{ marginHorizontal: 10 }}>
                <Notification />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 1, borderRadius: 25, backgroundColor: '#21152D', margin: 20, borderWidth: 1, borderColor: 'white', overflow: 'hidden' }}>
            <ImageBackground
              source={require('../assets/reward_background.png')}
              style={{ flex: 1, resizeMode: 'cover', borderRadius: 25 }}
            >
              <View style={{ flex: 1, margin: 20, borderRadius: 25 }}>
                <View>
                  <Text style={{ color: 'white', fontSize: 30, textAlign: "center", fontWeight: "bold" }}>Refer to your Friends & Earn coins</Text>
                </View>

                <View style={{ margin: 10}}>
                  <Text style={{ color: 'white', marginTop: 12, fontSize: 16, textAlign: "center" }}>For every Friend you refer you both get 🟡 100</Text>
                </View>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                  <View style={{ marginTop:-5,}}>
                    <View style={{marginLeft:25}}>
                      <RewardAvatar />
                    </View>
                    <View style={{height:60,width:250,backgroundColor:"#26123D",borderRadius:25,borderWidth:1,borderColor:"white",justifyContent:'center'}}>
                      <Text style={{color:"white",textAlign:"center",fontSize:26,fontWeight:'bold',textTransform: 'uppercase'}}>qwerty</Text>
                    </View>
                    <TouchableOpacity>
                    <View style={{height:60,width:250,backgroundColor:"#85057A",borderRadius:7,marginTop:20,justifyContent:'center'}}>
                      <Text style={{color:"white",textAlign:"center",fontSize:20}}>Refer & Earn</Text>
                    </View>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            </ImageBackground>
          </View>
          <View style={{ height: 70, backgroundColor: 'rgba(80, 77, 84,0.45)', borderRadius: 25, margin: 20,justifyContent:"center" }}>
            <View style={{justifyContent:"space-between"}}>
                <Text style={{color:"white",textAlign:"center",fontSize:20}}>Your 3 Friends Joined</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({})

import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RewardAvatar, BetexLogo, Coin, Notification } from '../assets/icons'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; 

export default function Wallet(props) {
  const [localCode, setLocalCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [showAvatar, setShowAvatar] = useState(true);
  const [refralCode, setRefralCode] = useState('');
  const [coins,set_coins] = useState('');

  const generateUniqueCode = () => {
    const randomString = Math.random().toString(36).substring(2, 6);
    const timestamp = Date.now();
    const uniqueCode = randomString + timestamp.toString().slice(-2); 
    return uniqueCode;
  };

  const Coincheck = async () => {
    const UserRef = firestore().collection('Users').doc(auth().currentUser.uid);
     UserRef.onSnapshot((doc) => {
      set_coins(doc.data().coins);
    })
  }

  useEffect(() => {
    Coincheck()
  },[])



  const check = async () => {
    const user = auth().currentUser;
    const userRef = firestore().collection('Users').doc(user.uid);
    await userRef.get().then((doc) => {
      if(!doc.exists) {
        console.log("No such document!");
      }
      else if(!doc.data().refer_code){
        write_referal_code()
      }
      else {
        const referCode = doc.data().refer_code;
        setLocalCode(referCode);
      }
    })
};

  const write_referal_code = async () => {
    const code = generateUniqueCode();
    setLocalCode(code);
    const user = auth().currentUser;
    if (user) {
      const referRef = firestore().collection('rewards').doc(localCode);
      await referRef.set({
        code: localCode,
        created_by: user.uid
      }).then(() => {
        console.log("User code has been written to refer ")
        const userRef = firestore().collection('Users').doc(user.uid);
        userRef.update({
          refer_code: localCode
        }).then(() => {
          console.log("Data has been written to Users location also")
        }).catch((error) => {
          console.log(error)
        })
      }).catch((error) => {
        console.log(error)
      });
    }
  }

  useEffect(() => {
    check();
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setShowAvatar(false);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setShowAvatar(true);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleInputChange = (text) => {
    setInputCode(text);
  }

  const handleReferEarn = () => {
    if (inputCode.trim() !== "") {
      setRefralCode(inputCode.trim());
    } else {
      alert("Please enter a valid referral code.");
    }
  }
  console.log(refralCode, "refralCode")

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
                    <Text style={{ color: 'white', marginLeft: 15, fontSize: 16, fontWeight: 'bold' }}>{0}</Text>
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
                  {showAvatar && (
                    <View style={{marginTop:-5,}}>
                      <View style={{marginLeft:25}}>
                        <RewardAvatar />
                      </View>
                      <View style={{height:60,width:250,backgroundColor:"#26123D",borderRadius:25,borderWidth:1,borderColor:"white",justifyContent:'center'}}>
                        <Text style={{color:"white",textAlign:"center",fontSize:26,fontWeight:'bold'}}>{localCode}</Text>
                      </View>
                      <TouchableOpacity>
                        <View style={{height:60,width:250,backgroundColor:"#85057A",borderRadius:7,marginTop:20,justifyContent:'center'}}>
                          <Text style={{color:"white",textAlign:"center",fontSize:20}}>Refer & Earn</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

              </View>
            </ImageBackground>
          </View>
          
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'rgba(80, 77, 84, 0.8)',
    borderRadius: 25,
    margin: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: 'transparent',
    borderRadius: 10,
    backgroundColor: '#333',
    paddingHorizontal: 20,
    fontSize: 18,
    color: 'white',
  },
  button: {
    backgroundColor: '#85057A',
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    elevation: 3,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
})

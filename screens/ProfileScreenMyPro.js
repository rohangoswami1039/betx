import React,{useState,useEffect}from 'react';
import { StyleSheet,TouchableOpacity,Alert   } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import{
    PersonRound,
    CallRound,
    EmailRound,
    LocationRound,
    LockIcon,
    EditIcon
  } from '../assets/icons';
import {Box,
    Text,
    Avatar,
    HStack,
    View,
    ScrollView ,
    Button,
    Input,
    Pressable
} from 'native-base';

import {
    CustomeAlert
  } from '../Components';

  import LinearGradient from 'react-native-linear-gradient';
  import firestore from '@react-native-firebase/firestore';
  import auth from '@react-native-firebase/auth';
  import messaging from '@react-native-firebase/messaging';
  
  
 
function ProfileScreenMyPro({props,setUName,setShowLoadingModal}) {
    const user = auth().currentUser;
    const [userFind, setUserFind]= useState('');

    const [userName, setUserName] = useState('');   //
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState(''); //
    const [userAddress, setUserAddress] = useState('');
    const [waIdData, setWaId] = useState('');    //
    const [waNameUser, setWaName] = useState('');
    const[TimeStamp, setTimeStamp] = useState('');  //
    const[waNumber, setWaNumber] = useState('');


    const [editMode, setEditMode] = useState(false);
    const [FCMToken, setFCMToken] = useState('');

    //For Custome Alert
    const [alertTitle, setAlertTitle] = useState('');
    const [alertDescription , setAlertDescription] = useState('');
    const [alertVisible , setAlertVisible] = useState(false);

    const navigation = useNavigation();
   
    // const deleteUsersByName = async (name) => {
    //   try {
    //     const userRef = firestore().collection('WhatsppALoginData');
    //     const snapshot = await userRef.where("userEmail", "==", name).get();
    
    //     snapshot.forEach(async (doc) => {
    //       console.log('Deleting user:', doc.id);
    //       await doc.ref.delete();
    //     });
    
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    
    // deleteUsersByName("iquablarshad@gmail.com");
    
    
    
    
    
    useEffect(() => {
      
      
         const userdataToFind =async()=> {
          try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData !== null) {
              const data1 = JSON.parse(userData);
              console.log(data1, "dataaa1");

           
              // if(data1.data.userMobile!==undefined || null){
              //   setUserFind(data1.data.userMobile);
              // }
             
              console.log("stored the value");
              
              // const userRef = firestore().collection('WhatsppALoginData').doc(data1.user.waId);
              // const doc = await userRef.get();
              // if (doc.exists) {
              //   console.log('User data:', doc.data());
              //   const data = doc.data();
              //   setUserName(data.userName);
              //   setUserPhone(data.userMobile);
              //   setWaId(data.waId);
              //   setUserEmail(data.userEmail);
              //   setUserAddress(data.userAddress)
              // } else {
              //   console.log('User does not exist userdataToFind!');
              //   // Create new user
              //   console.log(data1, "checking");
                let som= await data1;
              //   createUser(som.user.waId, som)
              // }
                    
                   const id=som.user.waId? som.user.waId: som.user.id;

              checkUserExists(id, som);
            }
          }
          catch(error){
            console.log(error,"idhar error h")
          }
         }
        // },[])
        userdataToFind();
    
      
      const createUser = (waId, userData) => {
        console.log(userData, "idhar dekh kr kro");
        const timeStamp = firestore.FieldValue.serverTimestamp();
        const userRef = firestore().collection('WhatsppALoginData').doc(waId);
      
        const createUserOnFirestore = () => {
          console.log(userData, "idhar dekh kr kro second");
          userRef.set({
            waId: waId,
    // userName: userData.data.userName ? userData.data.userName : (userData.user ? userData.user.name : ''),
    userEmail: userEmail ? userEmail : (userData.user ? userData.user.email : ''),
    // userName:  userData.data && userData.data.userName ? userData.data.userName : userData.user &&  userData.user.name? userData.user.name :'',
    userName: userData.data && userData.data.userName ? userData.data.userName : userData.user.name ? userData.user.name : '',

    // userMobile: userData.data.userMobile ? userData.data.userMobile : (userData.user ? userData.user.email : ''),
    // userMobile: userEmail ? userEmail : (userData.user ? userData.user.email : '')
    userMobile: userData.data && userData.data.userMobile ? userData.data.userMobile : (userData.user ? '' : ''),

    userAddress: userAddress,
    waName: waNameUser,
    waNumber: waNumber,
    createdAt: timeStamp,
    updatedAt: timeStamp,
    FCMToken: FCMToken,
          }).then(() => {
            console.log('User created successfully!');
          }).catch((error) => {
            console.error(error, "salman");
            setAlertTitle('Error');
            setAlertDescription('Error creating user!');
            setAlertVisible(true);
          });
        };
      
        // check if userData is not null, otherwise wait and retry
        const checkUserData = setInterval(() => {
          if (userData !== null) {
            clearInterval(checkUserData);
            createUserOnFirestore();
          }
        }, 1000); // check every 1 second
      };
      
      
      
      // Get FCM Token for push notifications
      const getFCMToken = async () => {
        try {
          const token = await messaging().getToken();
          console.log('FCM Token:', token);
          setFCMToken(token);
        } catch (error) {
          console.error(error);
        }
      };
      
      // Call the function to get FCM Token
      getFCMToken();
      
      // Check if user exists in Firebase
      const checkUserExists = async (waId, som) => {
        // const userName = userInfo.user.name ? userInfo.user.name : '';
        console.log("mobile before", som.user.email);
        console.log(mobile,"mobile");
        let mobile;
        if(som.user.email){
          mobile= som.user.email;
        }else{
            mobile=som.data.userMobile;
        }
        // const mobile=  som.user.email? som.user.email : som.data.userMobile;
        console.log(mobile, "userfindddddd") ;
        try {
          // const userRef = firestore().collection('WhatsppALoginData').doc(mobile);

          const userRef = firestore().collection('WhatsppALoginData');
          let snapshot;
       
        if (som && som.data && som.data.userMobile !== null && som.data.userMobile !== undefined) {
          console.log("if");
          snapshot = await userRef.where("userMobile", "==", mobile).get();
          console.log("if", snapshot);
      } else {
          console.log("else");
          setUserEmail(som.user.email);
          setUserName(som.user.name);
          snapshot = await userRef.where("userEmail", "==", mobile).get();
          console.log("else", snapshot);
      }
      
        
        
      
        
        
           
          // const snapshot = await userRef.get();
         
            if (snapshot.size>0) {
              console.log('User data: doc data', snapshot.docs[0].data());
            // console.log('User data:  doc data',snapshot.data());
            const data = snapshot.docs[0].data();
            setUserName(data.userName);
            setUserPhone(data.userMobile);
            setWaId(data.waId);
            setUserEmail(data.userEmail);
            setTimeStamp(data.createdAt);
            setWaName(data.waName);
            setWaNumber(data.waNumber);
            setFCMToken(data.FCMToken);
            setUserAddress(data.userAddress);
          } else {
            console.log('User does not exist checkUserExists!');
            // Create new user
            // createUser(userFind, user);
            createUser(waId, som);
          }
          
        } catch (error) {
          console.error(error);
        }
      };
      
     
      
      return () => {
        // cleanup function
        console.log('Cleanup function called!');
      };
    }, []);  
    
     // Function to update user data in Firebase
    //  const updateUser = async () => {
    //   console.log("enetered pe")
    //   try {
    //     const userRef = firestore().collection('WhatsppALoginData').doc(userFind);
    
    //     await userRef.update({
    //       'userName': userName,
    //       'userEmail': userEmail,
         
    //       'userAddress':userAddress,
    //       'updatedAt': firestore.FieldValue.serverTimestamp(),
    //     });
    
    //     console.log('User updated successfully!');
    //     setAlertTitle('Success');
    //     setAlertDescription('User data updated successfully!');
    //     setAlertVisible(true);
    //     setEditMode(false);
    //   } catch (error) {
    //     console.error(error);
    //     setAlertTitle('Error');
    //     setAlertDescription('Error updating user data!');
    //     setAlertVisible(true);
    //   }
    // };

// }
// useEffect(() => {
//   userdataToFind();
// }, []);


      //         getUsetrData(data1.userMobile);
      //         getFCMToken();
      //       }
      //     } catch (error) {
      //       console.log('Error retrieving userData from AsyncStorage: ', error);
      //     }
      //   }
      //   userdataToFind();
      // }, []);
     
    
    

    useEffect(() => {{
        
    
        // getUsetrData();
        getFCMToken();
        }}, []);

        
   //get User data from Firebase 
//  async function getUsetrData(dataa){
   
//     console.log("Gettinmg data from firebase");
   
 


  

  function saveUserData(){  
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    setShowLoadingModal(true);
    if(!userEmail){
        console.log('Email nmot entered')
        setShowLoadingModal(false);
        setAlertDescription(`Email not entered`);
        setAlertTitle(`Please enter your email`);
        setAlertVisible(true)

    }else if(reg.test(userEmail) === false){
        console.log("Email is Not Correct");
        setShowLoadingModal(false);
        setAlertDescription(`Email is Not Correct`);
        setAlertTitle(`Please enter correct email`);
        setAlertVisible(true)
    }else{
        // firestore()
        // .collection('WhatsppALoginData')
        // .doc(user.uid)
        // .update({
        //     'name': userName,
        //     'email': userEmail,
        //     'address':userAddress,
        //     'FCMToken':FCMToken,
        // })


        firestore()
        .collection('WhatsppALoginData')
        .where('userMobile', '==', userFind)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            const docRef = firestore()
              .collection('WhatsppALoginData')
              .doc(documentSnapshot.id);
            docRef.update({
                'timestamp':TimeStamp,
                'userMobile':userPhone,
                'userName': userName,
                'waId':waIdData,
                'waName':waNameUser,
                'waNumber':waNumber,
              'userEmail': userEmail,
              'userAddress': userAddress,
              
            })
            .then(() => {
                console.log('User added!');
                setEditMode(false);
                setShowLoadingModal(false);
                setAlertDescription(`Your data has been updated`);
                setAlertTitle(`Data updated`);
                setAlertVisible(true)
            })
            .catch(error => {console.log(error); setShowLoadingModal(false);});
          
        });
    })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
      
    }
}

    
    
  

  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      setFCMToken(token)
      console.log(token);
    } catch (e) {
      console.log(e);
    }
  };

    

    const signOut = () =>
    Alert.alert(
      "Sign out",
      "Are you sure you want to sign out",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Sign out", onPress: () => {
            try {
                console.log("Signing out");
              auth().signOut();
            //arshad  
              AsyncStorage.clear()
              .then(() => {
                console.log('All items removed successfully from async storage');
                // props.navigation.replace('Login');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
              })
              .catch((error) => {
                console.log('Error clearing AsyncStorage: ', error);
              });
            
            //arshad
          

              console.log("Signing out after a successful");
            } catch (error) {
                console.log(error.message);
            }
        } }
      ]
    );
    return (
        <>
        <CustomeAlert visible={alertVisible} setAlertVisible={setAlertVisible} title={alertTitle} description={alertDescription}/>
        <ScrollView >
        
        <View style={styles.mainView} pl="10" pr="10" mt="10">
            <PersonRound/>
            <View style={styles.innerView} borderBottomWidth="2" borderColor="#222232" >
                    <View ml="5" mb="5" >
                        <Text style={{color:'white'}} fontSize="lg">Name</Text>
                        {editMode
                        ?<View  style={{borderBottomWidth: 1,borderStyle: 'dashed',borderColor: 'white'}}><Input variant="unstyled"  placeholder="" width='200' value={userName} onChangeText={(text)=> setUserName(text)} style={{color:'white'}}/></View>
                        :<Text style={{color:'white'}}>{userName}</Text>
                        }
                        
                    </View>
                    <View style={{height:70}}>
                    <Text></Text>
                        <TouchableOpacity onPress={()=> setEditMode(!editMode)} style={{padding:5}}>
                            <EditIcon />
                        </TouchableOpacity>
                    </View>
            </View>
        </View>

        <View style={styles.mainView} pl="10" pr="10" mt="2">
            <CallRound/>
            <View style={styles.innerView} borderBottomWidth="2" borderColor="#222232" >
                    <View ml="5"  >
                        <Text style={{color:'white'}} fontSize="lg">Phone</Text>
                        <Text style={{color:'white'}}>{userPhone}</Text>
                    </View>
                    <View style={{height:70}}>
                    <Text></Text>
                        <LockIcon />
                    </View>
            </View>
        </View>

        <View style={styles.mainView} pl="10" pr="10" mt="2"  mb="7">
            <EmailRound/>
            <View style={styles.innerView} borderBottomWidth="2" borderColor="#222232" >
                    <View ml="5" mb="5" >
                        <Text style={{color:'white'}} fontSize="lg">Email</Text>
                       {editMode
                            ? <View  style={{borderBottomWidth: 1,borderStyle: 'dashed',borderColor: 'white'}}><Input variant="unstyled"  placeholder="" width='200' value={userEmail} onChangeText={(text)=> setUserEmail(text)} style={{color:'white'}}/></View>
                            : <Text style={{color:'white'}}>{userEmail}</Text>
                        }
                    </View>
                    <View style={{height:70}}>
                    <Text></Text>
                        <TouchableOpacity onPress={()=> setEditMode(!editMode)} style={{padding:5}}>
                            <EditIcon/>
                        </TouchableOpacity>   
                    </View>
            </View>
        </View>

        {/* <View style={styles.mainView} pl="10" pr="10" mt="2" mb="5">
            <LocationRound/>
            <View style={styles.innerView} borderBottomWidth="2" borderColor="#222232" >
                    <View ml="5" mb="5" >
                        <Text style={{color:'white'}} fontSize="lg">Address</Text>
                        {editMode
                            ?<View  style={{borderBottomWidth: 1,borderStyle: 'dashed',borderColor: 'white'}}><Input variant="unstyled"  placeholder="" width='200' value={userAddress} onChangeText={(text)=> setUserAddress(text)} style={{color:'white'}}/></View>
                            :<Text style={{color:'white'}}>{userAddress}</Text>
                        }

                    </View>
                    <View style={{height:70}}>
                    <Text></Text>
                        <TouchableOpacity onPress={()=> setEditMode(!editMode)} style={{padding:5}}>
                            <EditIcon />
                        </TouchableOpacity>
                    </View>
            </View>
        </View> */}

        
            {
                editMode
                ?
                    <LinearGradient alignSelf="center"   style ={styles.colorButton} colors={['#4141E3', '#8989F5']} start={{x: 0.4, y: 1.2}} end={{x: 0.15, y: 0.0}} >
                        <Text style={styles.signOutButton} onPress={()=> saveUserData()} >Save</Text>
                    </LinearGradient>
                
                :
                    <LinearGradient alignSelf="center"   style ={styles.colorButton} colors={['#DC4444', '#EC9191']} start={{x: 0.4, y: 1.2}} end={{x: 0.15, y: 0.0}} >
                        <Text style={styles.signOutButton} onPress={ ()=> signOut()} >Sign Out</Text>
                    </LinearGradient>
                
            }
            

        </ScrollView>
        </>
    );
}

export default ProfileScreenMyPro;

const styles = StyleSheet.create({
    heading:{
        color:"white",
    },
    headingValue:{
        color:"white",
    },
    mainView:{ 
        flexDirection: 'row', 
        justifyContent: 'space-between',
    },
    innerView:{
        flex: 1, 
        flexDirection: 'row',
        justifyContent:'space-between', 
        // height:70, 
    },
    signOutButton:{
        fontSize:20,
        width:120,
        height:50,
        color:'white',
        textAlignVertical: 'center',
        textAlign: 'center',
        
    },
    colorButton:{
        borderRadius: 50,
    }
})
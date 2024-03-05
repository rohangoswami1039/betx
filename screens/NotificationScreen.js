
import React,{useState,useEffect} from 'react';
import {Text,FlatList,View,StyleSheet,Pressable,ScrollView} from 'react-native';
import{ArrowLeft} from '../assets/icons';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {CrossButton} from '../assets/icons';
function NotificationScreen({props,navigation}) {

    const [notificationList , setNotificationList] = useState([])

    useEffect(()=>{
        getNotificationFromFirebase();
    },[])

    function getNotificationFromFirebase (){
        // console.log('getNotificationFromFirebase');
        firestore()
        .collection('Notifications')
        .doc(auth().currentUser.uid)
        .collection('NotificationHistory')
        .orderBy("dateTime","desc")
        .onSnapshot(querySnapshot =>{
            const li = [];
            querySnapshot.forEach(documentSnapshot=>{
                li.push({...documentSnapshot.data() , key:documentSnapshot.id});
            })
            setNotificationList(li)
        })
    }
    return (
        <>
        <View style={{backgroundColor:'#181829',flexDirection: 'row',justifyContent:'space-between',paddingLeft:28,paddingRight:28,paddingTop:52}}>
                <ArrowLeft onPress={()=>navigation.navigate("Home")}/>
                <Text style={{fontSize:16,color:'white'}}>Notifications</Text>
                <Text>  </Text>
        </View>
        <ScrollView style={{backgroundColor:'#181829',paddingLeft:40,paddingRight:30,paddingTop:30}}>
        {
            notificationList.map((notification =>(
                <View>
                    <View style={styles.navBar}>
                        <View style={{}}>
                            <Text style={{fontSize: 14, color: 'white', }}>{notification.message}</Text>
                            <Text style={{fontSize: 9, color: 'white'}}>{moment(notification.dateTime.toDate()).format('MMMM Do, h:mm a') }</Text>
                        </View>
                        <View style={{flexDirection: 'row',justifyContent: 'flex-end',flex:1}}>
                           <CrossButton/>
                        </View>
                    </View>

                </View>
            )))
        }
            
        </ScrollView>
        </>
    );
}

const styles = {
    navBar: {
        marginTop:20,
      flexDirection: 'row',
      alignItems: 'center'
    },
  }
  
export default NotificationScreen;
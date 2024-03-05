import React,{useState,useEffect} from 'react';
import {Text,FlatList,View,StyleSheet,Pressable} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
    MatchBanner,
  
  } from '../Components';
  import{
    ArrowLeft,
    CheckCircle
  } from '../assets/icons';

function PredictionHistory(props) {
    const [matchlist,setMatchlist] = useState([]);
  
    const [loading,setLoading] = useState(true);
  
    
    useEffect(() => {{
      getMatches();
      }
    }, []);
    

    //Getting matches from database
  async  function   getMatches() {

    const matchL = [];
    const li = [];
    const result = await firestore().collection('Payment/'+auth().currentUser.uid+'/PaymentHistory');
    var allListSnapShot = await result.get();
    allListSnapShot.forEach(doc => {
        // console.log(doc.id, '=>', doc.data());
        matchL.push({key:doc.id})      
    });

    await matchL.map((id)=>{
        // console.log("match dta "+id.key)
        firestore()
        .collection('Matches')
        .doc(id.key)
        .onSnapshot(documentSnapshot => {
            // console.log('User data: ', documentSnapshot.id);
            li.push({...documentSnapshot.data(), key:documentSnapshot.id});
        });
    })
    setMatchlist(li)
    setLoading(false) 
    // await sortList(li)
}
    
    return (
        <View style={{backgroundColor:'#181829',flex : 1,paddingLeft:30,paddingRight:25}}>
            <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',marginTop:30,marginBottom:30}}>
                <ArrowLeft onPress={()=> props.navigation.navigate("MainHome")}/>
                <LinearGradient alignSelf="center"   style ={styles.colorButton} colors={['#ED6B4E',  '#F4A58A']} start={{x: 0.4, y: 1.9}} end={{x: 0.15, y: 0.0}} >
                    <Text style={styles.signOutButton} >Premium History</Text>
                </LinearGradient>
                <Text></Text>
            </View>
            <FlatList 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20}}
                data={matchlist}
                renderItem={({item}) =><MatchBanner match={item} />}
                onRefresh={()=>getMatches()}
                refreshing={loading}
            />
        </View>
    );
}

export default PredictionHistory;

const styles = StyleSheet.create({
   
    signOutButton:{
        fontSize:20,
        // fontweight:'bold',
        // width:120,
        padding:15,
        // height:50,
        color:'white',
        textAlignVertical: 'center',
        textAlign: 'center',
        
    },
    colorButton:{
        borderRadius: 50,
    }
})
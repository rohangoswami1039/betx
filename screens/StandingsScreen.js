import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {Corosel, LockButton, MatchBanner} from '../Components';
import {Button} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function StandingsScreen(props) {
  const [matchlist, setMatchlist] = useState([]);
  const [matchlistToday, setMatchlistToday] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    {
      getMatches();
      getMatchesToday();
    }
  }, []);

  //before yesterdy
  function getMatches() {
    // var tomoroDate = new Date();
    // tomoroDate.setDate(tomoroDate.getDate() + 1);
    // tomoroDate.setHours(0,0,0,0)

    var todaySatrt = new Date();
    todaySatrt.setHours(0, 0, 0, 0);

    // var todayEnd = new Date();
    // todayEnd.setHours(23,59,59,0)
    //console.log("todayEnd"+todayEnd)

    // var yesterday = new Date();
    // console.log("yesterday"+yesterday);
    // yesterday.setDate(yesterday.getDate() - 1);
    // console.log("yesterday"+yesterday);
    // yesterday.setHours(0,0,0,0)
    // console.log("yesterday"+yesterday);

    setLoading(true);
    //Empty the matchlist
    setMatchlist([]);

    firestore()
      .collection('Matches_Test')
      //.where('matchDate', 'not-in', [todaySatrt,todayEnd])
      .where('matchDate', '<', todaySatrt)
      //  .where('matchDate', '<=', yesterday)
      .orderBy('matchDate', 'desc')
      .limit(20)
      .onSnapshot(querySnapshot => {
        const li = [];
        querySnapshot.forEach(documentSnapshot => {
          //console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
          //console.log(documentSnapshot.data().matchDate.toDate() +"---"+todaySatrt)
          //console.log("documentSnapshot.id"+(documentSnapshot.data().matchDate.toDate() < todaySatrt || documentSnapshot.data().matchDate.toDate() > todayEnd))
          //include if not today
          // if(documentSnapshot.data().matchDate.toDate() < todaySatrt || documentSnapshot.data().matchDate.toDate() > todayEnd){
          //   li.push({...documentSnapshot.data() , key:documentSnapshot.id});
          // }
          li.push({...documentSnapshot.data(), key: documentSnapshot.id});
        });
        setMatchlist(li);
        setLoading(false);
      });
  }

  function getMatchesToday() {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log('today' + today);

    var nowPlus10 = new Date();
    nowPlus10.setMinutes(new Date().getMinutes() - 10);

    // var tomoroDate = new Date();
    // tomoroDate.setDate(tomoroDate.getDate() + 1);
    // tomoroDate.setHours(0,0,0,0)
    console.log('nowPlus10' + nowPlus10);
    // console.log(tomoroDate.getDate())

    setLoading(true);
    //Empty the matchlist
    setMatchlistToday([]);

    firestore()
      .collection('Matches')
      .where('matchDate', '>=', today)
      .where('matchDate', '<=', nowPlus10)
      .orderBy('matchDate', 'desc')
      .limit(4)
      .onSnapshot(querySnapshot => {
        const li = [];
        querySnapshot.forEach(documentSnapshot => {
          //console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
          li.push({...documentSnapshot.data(), key: documentSnapshot.id});
        });
        setMatchlistToday(li);
        setLoading(false);
      });
  }
const insets = useSafeAreaInsets();

    return (
      <View style={{flex: 1, backgroundColor: '#161616', paddingTop: insets.top, paddingBottom: insets.bottom}}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#161616',
          paddingTop: 20,
          paddingBottom: 20,
        }}>
        <Text
          style={{
            borderRadius: 16,
            fontSize: 20,
            width: 200,
            height: 56,
            color: 'white',
            textAlignVertical: 'center',
            textAlign: 'center',
            backgroundColor: '#1e1e1e',
          }}>
          Completed Matches
        </Text>
      </View>
      <View
        style={{
          backgroundColor: '#161616',
          paddingLeft: 30,
          paddingRight: 25,
          flex: 1,
          flexGrow: 1,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                getMatches();
                getMatchesToday();
              }}
            />
          }>
          {/* <Text style={{fontSize:20,color:'white',marginBottom:10}}>Today</Text> */}
          <FlatList
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={{ paddingBottom: 20}}
            data={matchlistToday}
            renderItem={({item}) => <MatchBanner match={item} />}
            // onRefresh={()=>getMatches()}
            // refreshing={false}
          />
          {/* <Text style={{fontSize:20,color:'white',marginBottom:10}}>Yesterday and Before</Text> */}
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 20}}
            data={matchlist}
            renderItem={({item}) => <MatchBanner match={item} />}
            // onRefresh={()=>getMatches()}
            // refreshing={false}
          />
        </ScrollView>
      </View>
    </View>
  );
}

export default StandingsScreen;

const styles = StyleSheet.create({
  colorButton: {
    borderRadius: 50,
  },
});

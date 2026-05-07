import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Button,
  TouchableOpacity,
  Linking,
  Dimensions,
  Image,
  StyleSheet,
  ProgressBarAndroid,
  Pressable,
} from 'react-native';
// import {Image} from 'native-base'
import LoadingModal from './LoadingModal.js';
import { ArrowLeft } from '../assets/icons';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function BetImageScreen({ route, navigation }) {
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [betLink, setbetLink] = useState('');
  const [vote, setVote] = useState(route.params.match.votecount);
  const [isVoted, setisVoted] = useState(false);
  const [voteCount, setVotecount] = useState(route.params.match.vote);

  const [yesTotalVote, setYesTotalVote] = useState();
  const [noTotalVote, setNoTotalVote] = useState();

  const [check, Setcheck] = useState();
  console.log(route, "galti dekho", navigation);
  const dimensions = Dimensions.get('window');
  const imageHeight = Math.round(dimensions.width);
  const imageWidth = dimensions.width - 20;
  const { match, voting, winvote, heading, description } = route.params;
  const { update, SetUpdate } = useState(false);

  const name = route.params.match.matchTitle;
  console.log(route.params.match, 'total data');

  useEffect(() => {
    //fetch beting link only if upcoming match
    firestore()
      .collection('BetLink')
      .doc('BetLink')
      .onSnapshot(documentSnapshot => {
        // console.log('Bet link : ', documentSnapshot.data().link);
        setbetLink(documentSnapshot.data().link);
      });
  }, []);
  //  console.log(route.params.match.vote, "vote");
  //  console.log(route.params.match.votecount, "votecount");

  //  const deleteAllData = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //     console.log('All data deleted from AsyncStorage');
  //   } catch (error) {
  //     console.error('Error deleting data from AsyncStorage:', error);
  //   }
  // };

  // deleteAllData();

  const saveData = async (vote, yesvote, novote) => {
    try {
      const finaldata = {
        vote: vote,
        yesvote: yesvote,
        novote: novote,
      };
      await AsyncStorage.setItem(name, JSON.stringify(finaldata));
      console.log('Data saved to AsyncStorage:', finaldata);
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  useEffect(() => {
    // const setA = (newValue) => {
    //   if (a !== newValue) {
    //    updateData();
    //    SetUpdate(true);
    //    console.log("enter 1")
    //   //  saveData();
    //   }
    //   a = newValue;
    // };

    const updateData = async () => {
      if (isVoted) {
        const yesVote = Math.floor((vote * yesPercentage) / 100);
        const noVote = vote - yesVote;
        // console.log(yesVote, noVote, 'idhar pakdo');
        if (check) {
          setYesTotalVote(yesVote);
          setNoTotalVote(noVote);
        } else {
          setYesTotalVote(yesVote);
          setNoTotalVote(noVote);
        }
        //  console.log(vote, "vote while sending")
        console.log('Vote updated:', vote);
        console.log('yesTotalVote:', yesVote);
        console.log('noTotalVote:', noVote);
        await saveData(vote, yesVote, noVote);
      }
    };
    updateData();
    //  setA(vote);
  }, [check, isVoted, vote, yesPercentage]);
  console.log(route.params.match.heading, 'headingggg');

  const voteNo = () => {
    if (!isVoted) {
      Setcheck(false);
      setisVoted(true);
    }
  };

  const voteYes = () => {
    if (!isVoted) {
      Setcheck(true);

      setisVoted(true);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const hasVoted = await AsyncStorage.getItem(name);

        if (hasVoted) {
          // setisVoted(true);
          console.log(hasVoted, 'total valuess');
          const data = JSON.parse(hasVoted);
          setisVoted(true);
          setVote(data.vote);

          const yesVote = data.yesvote;
          const noVote = data.novote;
          setVote(Number(vote) + 1);
          if (check) {
            setYesTotalVote(yesVote + 1);
            setNoTotalVote(noVote);
          } else {
            setNoTotalVote(noVote + 1);
            setYesTotalVote(yesVote);
          }
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };

    loadData();
  }, [isVoted, check]);

  const yesPercentage = route.params.match.vote;
  const noPercentage = 100 - yesPercentage;
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      backgroundColor: '#161616',
      flex: 1
    }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          paddingBottom: 20,
          backgroundColor: '#161616',
        }}>
        <LoadingModal show={showLoadingModal} />

        <ScrollView style={{ backgroundColor: '#161616' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingTop: 20,
              marginBottom: 10,
            }}
          >
            {/* Back Button */}
            <ArrowLeft onPress={() => navigation.goBack()} />

            {/* Title */}
            <Text
              style={{
                color: '#fff',
                fontSize: 20,
                fontFamily: 'SourceSansPro',
                fontWeight: '600',
              }}
            >
              Place a Bet
            </Text>

            {/* Payment Button */}
            <TouchableOpacity
              // onPress={() => navigation.navigate('Payment')}
              style={{
                // backgroundColor: '#F63D68',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                width: '20%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: '700',
                  top: -2,
                  letterSpacing: 1
                }}
              >
                Pay
              </Text> */}
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              borderRadius: 12,
              // overflow: 'hidden',
            }}
          >
            <Image
              source={{ uri: route.params.match.predictionImage }}
              style={{
                height: imageHeight,
                width: imageWidth,
                resizeMode: 'contain',
                borderRadius: 12,
                overflow: 'hidden',
              }}
              onLoadStart={() => setShowLoadingModal(true)}
              onLoadEnd={() => setShowLoadingModal(false)}
            />
          </View>


        </ScrollView>
        {/* <View> */}
        <View
          style={{
            elevation: 10,
            backgroundColor: '#242323',
            margin: 10,
            borderRadius: 10,
            marginTop: -80,
            height: 120,
            justifyContent: 'center',
          }}>
          <View style={{ margin: 10, padding: 5 }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                marginBottom: 10,
                fontFamily: 'Segoe UI',
                fontWeight: 'bold',
              }}>
              {route.params.match.heading}
            </Text>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 13,
                marginBottom: 10,
                fontFamily: 'Segoe UI',
              }}>
              {route.params.match.description}
            </Text>
          </View>
        </View>

        <View
          style={{
            elevation: 10,
            backgroundColor: '#292929',
            marginBottom: 40,
            margin: 10,
            borderRadius: 10,
          }}>
          <View style={{ margin: 10, padding: 5, }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 10,
                marginBottom: 10,
                fontFamily: 'Segoe UI',
              }}>
              WILL THIS PREDICTION COME TRUE?
            </Text>
            {/* </View> */}
            {!isVoted ? (
              <>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 9,
                    marginBottom: 8,
                    fontFamily: 'Segoe UI',
                  }}>
                  Vote to see the result
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={voteYes}
                    style={{
                      backgroundColor: '#76A963',
                      padding: 8,
                      flex: 1,
                      marginRight: 10,
                      borderRadius: 8
                    }}>
                    <Text style={{ color: '#FFFFFF', fontFamily: 'Segoe UI' }}>
                      YES
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={voteNo}
                    style={{ backgroundColor: '#F14C45', padding: 8, flex: 1, borderRadius: 8 }}>
                    <Text style={{ color: '#FFFFFF', fontFamily: 'Segoe UI' }}>
                      No
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    color: '#FFFFFF',
                    marginTop: 7,
                    fontFamily: 'Segoe UI',
                  }}>
                  Total votes : {vote}
                </Text>
              </>
            ) : (
              <View>
                <View style={styles.rowContainer}>
                  <Text style={styles.label}>Yes</Text>
                  <Text style={styles.percentage}>{yesPercentage}% </Text>
                  <ProgressBarAndroid
                    styleAttr="Horizontal"
                    indeterminate={false}
                    color="#76A963"
                    progress={yesPercentage / 100}
                    style={styles.progressBar}
                    progressTintColor="#76A963"
                    trackTintColor="#FFFFFF"
                  />
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: 'white' }}>{yesTotalVote} votes</Text>
                </View>

                <View style={styles.rowContainer}>
                  <Text style={styles.label}>No </Text>
                  <Text style={{ ...styles.percentage, color: '#F14C45' }}>
                    {noPercentage}%{' '}
                  </Text>
                  <ProgressBarAndroid
                    styleAttr="Horizontal"
                    indeterminate={false}
                    color="#F14C45"
                    progress={noPercentage / 100}
                    style={styles.progressBar}
                    progressTintColor="#F14C45"
                    trackTintColor="#FFFFFF"
                  />
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: 'white' }}>{noTotalVote} votes</Text>
                </View>

                <View>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      marginTop: 7,
                      fontFamily: 'Segoe UI',
                    }}>
                    Total votes : {vote}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View
          style={{
            marginLeft: 30,
            marginRight: 30,
          }}>
          <Text>{route.params.match.matchDate.toDate() < new Date()}</Text>
          {
            route.params.match.matchDate.toDate() <
              new Date().setMinutes(new Date().getMinutes() - 10) ? null : (
              // <View style={{flexDirection: 'row', justifyContent: 'center' }}>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('VideoAd');
                }}
                // style={{
                //   height: 44,
                //   marginTop: 10,
                //   borderRadius: 22,
                //   backgroundColor: '#EE775A',
                //   justifyContent: 'center',
                //
                // }}
                style={{
                  borderRadius: 22,
                  justifyContent: 'center',
                  marginTop: 10,
                  fontSize: 16,
                  borderWidth: 2,
                  borderColor: '#F63D68',
                  marginRight: 10,
                  height: 44,
                  color: 'white',
                  textAlignVertical: 'center',
                  textAlign: 'center',
                  backgroundColor: '#1e1e1e',
                }}>
                <Text style={{ textAlign: 'center', fontSize: 16, color: 'white' }}>
                  How to place a bet ?
                </Text>
              </TouchableOpacity>
            )

            // {/* <TouchableOpacity
            //     onPress={ ()=>{ Linking.openURL(betLink)}}
            //     style={{flex: 1, height: 44, marginTop: 10,borderRadius:22 ,backgroundColor: '#C8524F' ,justifyContent: 'center', marginLeft:10}}>
            //     <Text style={{textAlign: 'center',fontSize:16,color: 'white'}}>Place a Bet</Text>

            // </TouchableOpacity> */}

            // </View>
          }
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: 'white',
    marginRight: 10,
  },
  percentage: {
    color: '#76A963',
  },
  progressBar: {
    width: '83%',
    height: 10,
  },
});

export default BetImageScreen;

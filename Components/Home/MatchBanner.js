import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, ToastAndroid} from 'react-native';

import {Image, View} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import RazorpayCheckout from 'react-native-razorpay';
import moment from 'moment';

import {LockIcon, Star, CheckCircle, CrossCircle} from '../../assets/icons';

import {LockButton, CustomeAlert} from '../../Components';

function MatchBanner(props) {
  //  console.log("Image "+props.match)
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  const [unlockTime, setUnlockTime] = useState();

  const navigation = useNavigation();

  async function accessPrediction(match) {
    // console.log("match data "+match.predictionImage)
    calculateUnlockTime(props.match.betDate);

    if (match.betType == 'Premium') {
      //Check from firebase account
      firestore()
        .collection('Payment')
        .doc(auth().currentUser.uid)
        .collection('PaymentHistory')
        .doc(match.key)
        .get()
        .then(documentSnapshot => {
          //console.log('document  exists: ', documentSnapshot.exists);

          if (documentSnapshot.exists) {
            if (documentSnapshot.data().status_code == 200) {
              // navigation.navigate("BetImageScreen",{match:props.match});
              navigation.navigate('BetImageScreen', {
                match: props.match,
                voting: match.vote,
                winvote: match.votecount,
              });
            } else {
              // alert('Invalid Payment details')
              setAlertDescription(
                `Transaction declined: invalid payment method.`,
              );
              setAlertTitle(`Request Failed`);
              setAlertVisible(true);
            }
          } else if (match.matchDate.toDate() < new Date()) {
            //if Match is over
            navigation.navigate('BetImageScreen', {
              match: props.match,
              voting: match.vote,
              winvote: match.votecount,
            });
          } else {
            //Check if Usernamer is Available or not
            firestore()
              .collection('Users')
              .doc(auth().currentUser.uid)
              .onSnapshot(documentSnapshot => {
                if (documentSnapshot.exists) {
                  //If name not available then redirect to add username
                  if (!documentSnapshot.data().email) {
                    // console.log("navigate to profile s");
                    //  alert('Redirecting to profile');

                    ToastAndroid.showWithGravityAndOffset(
                      'Your profile is incomplete please update your profile',
                      ToastAndroid.LONG,
                      ToastAndroid.BOTTOM,
                      25,
                      80,
                    );

                    navigation.navigate('Profile');
                  }
                  //If name is available do payment
                  else {
                    /*
                        // Add payment if not already done
                        //////razorpay////////////////////////////////
                        var options = {
                          description: 'Credits towards consultation',
                          image: 'https://betxapp.in/img/bet-light-logo.svg',
                          currency: 'INR',
                          key: 'rzp_test_tWWOF5qzrsxmCB',
                          amount: '100',
                          name: 'BetX',
                          prefill: {
                            email: 'test@test.com',
                            contact: auth().currentUser.phoneNumber,
                            name: auth().currentUser.uid
                          },
                          theme: {color: '#F37254'}
                        }
                        RazorpayCheckout.open(options).then((data) => {
                          // handle success
                          console.log(`Success payment details : ${JSON.stringify(data)}`);
                          firestore()
                          .collection('Payment')
                          .doc(auth().currentUser.uid)
                          .collection("PaymentHistory")
                          .doc(match.key)
                          .set({
                            ...data ,
                            "paymentDate": new Date(),
                            "matchID":match.key
                          }).then(()=>{
                            // alert('Payment successful')
                            // setAlertTitle(`Your payment has been processed!`);
                            // setAlertDescription(`You have successfully done payment for match title : ${match.title}`);
                            // setAlertVisible(true)
                            //Notification save to firebase
                            firestore()
                            .collection('Notifications')
                            .doc(auth().currentUser.uid)
                            .collection('NotificationHistory')
                            .add({
                              'dateTime': new Date(),
                              'matchID':match.key,
                              'read':false,
                              'message':'You have purchased prediction for '+match.matchTitle
                            }).then(() => {
                              // console.log('Notification Added Success');
                            });
                            navigation.navigate("BetImageScreen",{match:props.match});
                          })
                        }).catch((error) => {
                          // handle failure
                          //alert(`Error: ${error.code} | ${error.description}`);
                          // alert("Payment process failed")
                          
                          
                          setAlertDescription(`You have canceled or error while processing`);
                          setAlertTitle(`Payment process failed`);
                          setAlertVisible(true)
                        });
                        //////razorpay////////////////////////////////
                          */
                  }
                }
              });
          }
        });
    } else if (match.betType == 'Free-High' || match.betType == 'Free') {
      if (unlockTime < 0) {
        navigation.navigate('BetImageScreen', {
          match: props.match,
          voting: match.vote,
          winvote: match.votecount,
        });
      } else {
        //console.log('bet is locked');
        setAlertDescription(
          `Unlock in : ${
            Math.floor(unlockTime / 60) +
            ':' +
            (parseInt(unlockTime) % 60) +
            ' hr'
          }`,
        );
        setAlertTitle(`Prediction is Locked`);
        setAlertVisible(true);
      }
    }
  }

  async function calculateUnlockTime(date) {
    if (date) {
      console.log('date' + date.toDate());
      //props.match.betDate ? moment.duration(moment(moment(props.match.betDate.toDate())).diff(new Date())).asHours() : ''
      var duration = await moment.duration(
        moment(moment(props.match.betDate.toDate())).diff(new Date()),
      );
      // console.log("duration  hour "+parseInt(duration.asHours()))
      // console.log("duration  minuts "+parseInt(duration.asMinutes())  % 60)
      if (parseInt(duration.asMinutes()) % 60 < 0) {
        //setMatchStarted(true);

        // return"Started";
        // setUnlockTime('Started');
        setUnlockTime(duration.asMinutes());
      } else {
        // return parseInt(duration.asHours())+':'+parseInt(duration.asMinutes())  % 60+' hr';
        // setUnlockTime(parseInt(duration.asHours())+':'+parseInt(duration.asMinutes())  % 60+' hr');
        setUnlockTime(duration.asMinutes());
      }
    } else {
      // return"";
      setUnlockTime('');
    }
  }

  useEffect(() => {
    {
      calculateUnlockTime(props.match.betDate);
      // console.log('calling update')
    }
  }, []);

  return (
    <>
      <CustomeAlert
        visible={alertVisible}
        setAlertVisible={setAlertVisible}
        title={alertTitle}
        description={alertDescription}
      />
      <TouchableOpacity
        onPress={() => {
          accessPrediction(props.match);
        }}
        style={{marginTop: 32, marginLeft: 5, marginRight: 5}}>
        {props.match.betType == 'Premium' ||
        props.match.betType == 'Free-High' ? (
          <View
            style={{
              justifyContent: 'flex-start',
              flexDirection: 'row',
              marginLeft: 17,
              marginTop: -20,
            }}>
            <View
              style={{backgroundColor: '#2B2B3D', flexDirection: 'row'}}
              borderTopLeftRadius="8"
              borderTopRightRadius="8">
              <View style={{marginTop: 5, marginLeft: 5}}>
                <Star />
              </View>
              <View style={{justifyContent: 'flex-end'}}>
                <Text
                  style={{
                    flexShrink: 1,
                    color: 'white',
                    fontSize: 10,
                    bottom: 0,
                  }}>
                  {' '}
                  {props.match.betType == 'Premium'
                    ? ' Premium '
                    : ' Free-High '}{' '}
                </Text>
              </View>
            </View>
          </View>
        ) : null}
        <View
          style={{flexDirection: 'row', height: 78}}
          onClick={() => {
            console.warn('Clicked on flat list');
          }}>
          <View
            style={{width: '80%', backgroundColor: '#2B2B3D'}}
            borderLeftRadius="16">
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  height: 78,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    width: 37,
                    height: 40,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: '#2B2B3D',
                    backgroundColor: '#222232',
                    zIndex: 2,
                  }}>
                  <Image
                    style={{
                      alignSelf: 'center',
                      height: 22,
                      width: 22,
                    }}
                    source={{uri: props.match.team1Image}}
                    resizeMode="cover"
                    alt="."
                    height="25"
                    width="25"
                  />
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    width: 37,
                    height: 40,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: '#2B2B3D',
                    backgroundColor: '#222232',
                    marginLeft: -5,
                  }}>
                  <Image
                    style={{
                      alignSelf: 'center',
                      height: 22,
                      width: 22,
                    }}
                    source={{uri: props.match.team2Image}}
                    alt="."
                    size="xl"
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 2,
                  justifyContent: 'space-between',
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                <Text style={{fontSize: 11, color: 'white'}}>
                  {props.match.matchType}
                </Text>
                <Text style={{fontSize: 13, fontWeight: '400', color: 'white'}}>
                  {props.match.matchTitle}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View>
                    <Text style={{fontSize: 9, color: 'white', bottom: 0}}>
                      {props.match.matchDate
                        ? moment(props.match.matchDate.toDate()).format(
                            'MMMM Do, h:mm a',
                          )
                        : ''}
                    </Text>
                  </View>
                  {props.match.betType != 'Premium' &&
                  props.match.matchDate.toDate() > new Date() ? (
                    <View>
                      {/* <Text style={{fontSize:7,color:'white',marginLeft:5,position: 'absolute',bottom: 0,}}>
                              {
                                unlockTime < 0 
                                ? 'Unlock In : Started'
                                :`Unlock In : ${Math.floor(unlockTime / 60)+':'+parseInt(unlockTime)  % 60+' hr'}`
                              }
                            </Text> */}
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              width: '20%',
              backgroundColor: '#222232',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            borderRightRadius="16">
            <Text style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>
              {' '}
              {props.match.odd}
            </Text>
            <Text style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>
              {' '}
              ODD
            </Text>

            {(props.match.betType == 'Free' ||
              props.match.betType == 'Free-High') &&
            unlockTime > 0 ? (
              <LockButton />
            ) : null}

            {props.match.matchDate.toDate() < new Date() &&
            props.match.status == 'Win' ? (
              <View style={{position: 'absolute', right: 0, top: -5}}>
                <CheckCircle />
              </View>
            ) : null}
            {props.match.matchDate.toDate() < new Date() &&
            props.match.status == 'Lose' ? (
              <View style={{position: 'absolute', right: 0, top: -5}}>
                <CrossCircle />
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}

export default MatchBanner;

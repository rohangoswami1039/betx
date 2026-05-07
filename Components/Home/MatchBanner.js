import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, ToastAndroid, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '../../firebaseConfig';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import { LockIcon, Star, CheckCircle, CrossCircle } from '../../assets/icons';
import { LockButton, CustomeAlert } from '../../Components';
import GoogleInterstitialAd from '../../Components/GoogleAdds/GoogleAdBanner';

function MatchBanner(props) {
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [unlockTime, setUnlockTime] = useState();
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);

  const navigation = useNavigation();
  const adRef = useRef(null);

  const checkPremiumAccess = async (match) => {
    if (match.betType !== 'Premium') return;

    try {
      const doc = await firestore()
        .collection('Payment')
        .doc(auth().currentUser.uid)
        .collection('PaymentHistory')
        .doc(match.key)
        .get();

      if (doc.exists && doc.data().status_code === 200) {
        setIsPremiumUnlocked(true);
      } else {
        setIsPremiumUnlocked(false);
      }
    } catch (e) {
      setIsPremiumUnlocked(false);
    }
  };

  // Unlock Timer
  async function calculateUnlockTime(date) {
    if (date) {
      var duration = moment.duration(
        moment(props.match.betDate.toDate()).diff(new Date())
      );
      setUnlockTime(duration.asMinutes());
    } else {
      setUnlockTime('');
    }
  }

  useEffect(() => {
    calculateUnlockTime(props.match.betDate);
    checkPremiumAccess(props.match);
  }, []);

  // Access Logic
  async function accessPrediction(match) {
    if (adRef.current) {
      adRef.current.showAd();
    }

    calculateUnlockTime(props.match.betDate);

    // 🔒 Block Premium if not paid
    if (match.betType === 'Premium' && !isPremiumUnlocked) {
      setAlertTitle('Premium Locked');
      setAlertDescription('Please purchase this prediction to unlock.');
      setAlertVisible(true);
      return;
    }

    // Premium Access
    if (match.betType === 'Premium') {
      navigation.navigate('BetImageScreen', {
        match: props.match,
        voting: match.vote,
        winvote: match.votecount,
      });
    }

    // Free Bets
    else if (match.betType === 'Free-High' || match.betType === 'Free') {
      if (unlockTime < 0) {
        navigation.navigate('BetImageScreen', {
          match: props.match,
          voting: match.vote,
          winvote: match.votecount,
        });
      } else {
        setAlertDescription(
          `Unlock in : ${Math.floor(unlockTime / 60)}:${parseInt(unlockTime) % 60} hr`
        );
        setAlertTitle('Prediction is Locked');
        setAlertVisible(true);
      }
    }
  }

  return (
    <>
      <CustomeAlert
        visible={alertVisible}
        setAlertVisible={setAlertVisible}
        title={alertTitle}
        description={alertDescription}
      />

      <GoogleInterstitialAd ref={adRef} />

      <TouchableOpacity
        onPress={() => accessPrediction(props.match)}
        style={{ marginTop: 32, marginHorizontal: 10 }}
      >
        {/* Premium / Free-High Tag */}
        {(props.match.betType === 'Premium' ||
          props.match.betType === 'Free-High') && (
          <View style={{ flexDirection: 'row', marginLeft: 17, marginTop: -20 }}>
            <View style={{ backgroundColor: '#1c1c1c', flexDirection: 'row', gap: 4 }}>
              <View style={{ marginTop: 5, marginLeft: 5 }}>
                <Star />
              </View>
              <Text style={{ color: 'white', fontSize: 10, marginTop: 4, letterSpacing: 0.5 }}>
                {props.match.betType === 'Premium' ? ' Premium ' : ' Free-High '}
              </Text>
            </View>
          </View>
        )}

        <View style={{ flexDirection: 'row', height: 78 }}>
          {/* LEFT SIDE */}
          <View
            style={{
              width: '80%',
              backgroundColor: '#313131',
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: 12,
              opacity:
                props.match.betType === 'Premium' && !isPremiumUnlocked
                  ? 0.5
                  : 1,
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              {/* TEAM IMAGES */}
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  style={{ height: 22, width: 22 }}
                  source={{ uri: props.match.team1Image }}
                />
                <Image
                  style={{ height: 22, width: 22, marginLeft: -5 }}
                  source={{ uri: props.match.team2Image }}
                />
              </View>

              {/* TEXT DATA */}
              <View style={{ flex: 2, justifyContent: 'space-between', marginVertical: 10 }}>
                {props.match.betType === 'Premium' && !isPremiumUnlocked ? (
                  <Text style={{ color: '#aaa', fontSize: 12 }}>
                    🔒 Premium Prediction Locked
                  </Text>
                ) : (
                  <>
                    <Text style={{ fontSize: 11, color: 'white' }}>
                      {props.match.matchType}
                    </Text>
                    <Text style={{ fontSize: 13, color: 'white' }}>
                      {props.match.matchTitle}
                    </Text>
                  </>
                )}

                <Text style={{ fontSize: 9, color: 'white' }}>
                  {props.match.matchDate
                    ? moment(props.match.matchDate.toDate()).format(
                        'MMMM Do, h:mm a'
                      )
                    : ''}
                </Text>
              </View>
            </View>
          </View>

          {/* RIGHT SIDE */}
        <View
  style={{
    width: '20%',
    backgroundColor: '#5D5C64',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  }}
>
  {/*  Hide everything if Premium & not unlocked */}
  {!(props.match.betType === 'Premium' && !isPremiumUnlocked) && (
    <>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        {props.match.odd}
      </Text>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        ODD
      </Text>
    </>
  )}

  {/* Lock Icon */}
  {(
    (props.match.betType === 'Free' ||
      props.match.betType === 'Free-High') &&
    unlockTime > 0
  ) ||
  (props.match.betType === 'Premium' && !isPremiumUnlocked) ? (
    <LockButton />
  ) : null}

  {/* Result Icons */}
  {props.match.matchDate.toDate() < new Date() &&
    props.match.status === 'Win' && <CheckCircle />}

  {props.match.matchDate.toDate() < new Date() &&
    props.match.status === 'Lose' && <CrossCircle />}
</View>
        </View>
      </TouchableOpacity>
    </>
  );
}

export default MatchBanner;

// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   Text,
//   TouchableOpacity,
//   ToastAndroid,
//   View,
//   Image,
//   Alert,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { firestore } from '../../firebaseConfig';
// import auth from '@react-native-firebase/auth';
// import moment from 'moment';

// import { LockIcon, Star, CheckCircle, CrossCircle } from '../../assets/icons';
// import { LockButton, CustomeAlert } from '../../Components';

// function MatchBanner(props) {
//   const navigation = useNavigation();

//   const [alertTitle, setAlertTitle] = useState('');
//   const [alertDescription, setAlertDescription] = useState('');
//   const [alertVisible, setAlertVisible] = useState(false);
//   const [unlockTime, setUnlockTime] = useState(0);

//   /**
//    * Subscription object expected shape:
//    * {
//    *   subscribed: true,
//    *   status: "active"
//    * }
//    */
//   const mySubscription = props.mySubscription;

//   const isPremiumUser = useMemo(
//     () =>
//       mySubscription?.subscribed === true &&
//       mySubscription?.status === 'active',
//     [mySubscription],
//   );


//   async function calculateUnlockTime(date) {
//     if (!date) {
//       setUnlockTime(0);
//       return;
//     }

//     const duration = moment
//       .duration(moment(date.toDate()).diff(new Date()))
//       .asMinutes();

//     setUnlockTime(duration);
//   }


//   async function handlePremiumFlow(match) {
//     try {
//       // Match already finished → open free
//       if (match.matchDate.toDate() < new Date()) {
//         navigation.navigate('BetImageScreen', {
//           match: props.match,
//           voting: match.vote,
//           winvote: match.votecount,
//         });
//         return;
//       }

//       // Profile check
//       const userDoc = await firestore()
//         .collection('Users')
//         .doc(auth().currentUser.uid)
//         .get();

//       if (!userDoc.exists || !userDoc.data()?.email) {
//         ToastAndroid.showWithGravity(
//           'Please complete your profile first',
//           ToastAndroid.LONG,
//           ToastAndroid.BOTTOM,
//         );
//         navigation.navigate('Profile');
//         return;
//       }

//       // Navigate to payment
//       navigation.navigate('Payment', { match });
//     } catch (error) {
//       console.error('Premium flow error:', error);
//       setAlertTitle('Error');
//       setAlertDescription('Something went wrong. Try again.');
//       setAlertVisible(true);
//     }
//   }

//   /* ------------------ ACCESS LOGIC ------------------ */

//   async function accessPrediction(match) {
//     await calculateUnlockTime(match.betDate);

//     // 🔐 PREMIUM MATCH
//     if (match.betType === 'Premium') {
//       // ✅ Subscribed → OPEN DIRECTLY
//       if (isPremiumUser) {
//         navigation.navigate('BetImageScreen', {
//           match: props.match,
//           voting: match.vote,
//           winvote: match.votecount,
//         });
//         return;
//       }

//       // ❌ Not subscribed → payment
//       Alert.alert(
//         'Premium Prediction',
//         'This is a premium prediction. Please subscribe to unlock.',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { text: 'Subscribe', onPress: () => handlePremiumFlow(match) },
//         ],
//       );
//       return;
//     }

//     // 🆓 FREE / FREE-HIGH
//     if (match.betType === 'Free' || match.betType === 'Free-High') {
//       if (unlockTime < 0) {
//         navigation.navigate('BetImageScreen', {
//           match: props.match,
//           voting: match.vote,
//           winvote: match.votecount,
//         });
//       } else {
//         setAlertTitle('Prediction Locked');
//         setAlertDescription(
//           `Unlock in ${Math.floor(unlockTime / 60)}:${parseInt(unlockTime) % 60}`,
//         );
//         setAlertVisible(true);
//       }
//     }
//   }

//   useEffect(() => {
//     calculateUnlockTime(props.match.betDate);
//   }, []);

//   /* ------------------ UI ------------------ */

//   return (
//     <>
//       <CustomeAlert
//         visible={alertVisible}
//         setAlertVisible={setAlertVisible}
//         title={alertTitle}
//         description={alertDescription}
//       />

//       <TouchableOpacity
//         style={{ marginTop: 32, marginHorizontal: 10 }}
//         onPress={() => accessPrediction(props.match)}>

//         {/* TAG */}
//         {(props.match.betType === 'Premium' ||
//           props.match.betType === 'Free-High') && (
//           <View style={{ flexDirection: 'row', marginLeft: 17, marginTop: -20 }}>
//             <View
//               style={{
//                 backgroundColor: '#1c1c1c',
//                 flexDirection: 'row',
//                 borderTopLeftRadius: 8,
//                 borderTopRightRadius: 8,
//                 paddingHorizontal: 6,
//                 paddingVertical: 3,
//               }}>
//               <Star />
//               <Text style={{ color: 'white', fontSize: 10, marginLeft: 4 }}>
//                 {props.match.betType === 'Premium'
//                   ? 'Premium'
//                   : 'Free-High'}
//               </Text>
//             </View>
//           </View>
//         )}

//         {/* CARD */}
//         <View style={{ flexDirection: 'row', height: 78 }}>
//           {/* LEFT */}
//           <View
//             style={{
//               width: '80%',
//               backgroundColor: '#313131',
//               borderTopLeftRadius: 12,
//               borderBottomLeftRadius: 12,
//             }}>
//             <View style={{ flexDirection: 'row' }}>
//               <View
//                 style={{
//                   height: 78,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   flex: 1,
//                   flexDirection: 'row',
//                 }}>
//                 <Image
//                   source={{ uri: props.match.team1Image }}
//                   style={{ width: 22, height: 22, marginRight: -5 }}
//                 />
//                 <Image
//                   source={{ uri: props.match.team2Image }}
//                   style={{ width: 22, height: 22 }}
//                 />
//               </View>

//               <View
//                 style={{
//                   flex: 2,
//                   justifyContent: 'space-between',
//                   marginVertical: 10,
//                 }}>
//                 <Text style={{ color: 'white', fontSize: 11 }}>
//                   {props.match.matchType}
//                 </Text>
//                 <Text style={{ color: 'white', fontSize: 13 }}>
//                   {props.match.matchTitle}
//                 </Text>
//                 <Text style={{ color: 'white', fontSize: 9 }}>
//                   {moment(props.match.matchDate.toDate()).format(
//                     'MMMM Do, h:mm a',
//                   )}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* RIGHT */}
//           <View
//             style={{
//               width: '20%',
//               backgroundColor: '#5D5C64',
//               justifyContent: 'center',
//               alignItems: 'center',
//               borderTopRightRadius: 12,
//               borderBottomRightRadius: 12,
//             }}>
//             {/* ODDS */}
//             {props.match.betType !== 'Premium' || isPremiumUser ? (
//               <>
//                 <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
//                   {props.match.odd}
//                 </Text>
//                 <Text style={{ color: 'white', fontSize: 14 }}>ODD</Text>
//               </>
//             ) : (
//               <LockButton />
//             )}

//             {/* RESULT ICON */}
//             {props.match.matchDate.toDate() < new Date() &&
//               props.match.status === 'Win' && (
//                 <CheckCircle style={{ position: 'absolute', top: -5, right: 0 }} />
//               )}

//             {props.match.matchDate.toDate() < new Date() &&
//               props.match.status === 'Lose' && (
//                 <CrossCircle style={{ position: 'absolute', top: -5, right: 0 }} />
//               )}
//           </View>
//         </View>
//       </TouchableOpacity>
//     </>
//   );
// }

// export default MatchBanner;

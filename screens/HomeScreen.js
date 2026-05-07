import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SceneMap, TabBar } from 'react-native-tab-view';
import {
  BetexLogo,
} from '../assets/icons';
import { Corosel, MatchBanner } from '../Components';
import { firestore } from '../firebaseConfig'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AdVideo from '../Components/Common/AdVideo';
import AdBanner from '../Components/Common/AdBanner';
import PredictionNotification from '../Components/Common/PredictionNotification';
import auth from "@react-native-firebase/auth";
import Icons from '@react-native-vector-icons/material-design-icons';
import GoogleInterstitialAd from '../Components/GoogleAdds/GoogleAdBanner';


function HomeScreen(props) {
  const [matchlist, setMatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const [progres, setProgress] = useState(0);
  const [routes, set_routes] = useState([]);
  const [showAd, setShowAd] = useState(false);
  const [posterData, setPosterData] = useState(null);
  const [isVideoAd, setIsVideoAd] = useState(false);
  const [videoAddData, setVideoAddData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [mySubscription, setMySubscription] = useState({});

  const [IPL, set_IPL] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);
  const initialRef = useRef(null);
  const [refercode, set_refercode] = useState('');
  const finalRef = useRef(null);

  const interstitialRef = useRef(null);

  useEffect(() => {
    const unsubscribe = getUserData();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userDetails?.uid) {
      checkPremiumUser();
    }
  }, [userDetails?.uid]);

  useEffect(() => {
    // Show Google Interstitial Ad when the screen loads
    if (finalRef.current) {
      finalRef.current.showAd();
    }
  }, [122000]);


  useEffect(() => {
    {
      getMatches();
    }
  }, []);
  useEffect(() => {
    {
      getPosterAddData();
    }
  }, []);

  useEffect(() => {
    {
      getVideoAddData();
    }
  }, []);

  function getPosterAddData() {
    setLoading(true);
    setPosterData(null);

    const unsubscribe = firestore()
      .collection('PopupAds')
      .onSnapshot(querySnapshot => {
        const posteradd = [];
        querySnapshot.forEach(doc => posteradd.push(doc.data()));
        if (posteradd.length > 0 && posteradd[0]?.['active']) {
          setShowAd(true)
          setPosterData(posteradd[0]);
          setIsVideoAd(false);
        } else {
          setPosterData(null);
        }

        setLoading(false);
      });

    return () => {
      unsubscribe();
    };
  };

  function getVideoAddData() {
    setLoading(true);
    setVideoAddData(null);

    const unsubscribe = firestore()
      .collection('Video_Add')
      .onSnapshot(querySnapshot => {
        const videoadd = [];
        querySnapshot.forEach(doc => videoadd.push(doc.data()));
        console.log("Handle Refer Clicked---1", videoadd.length);

        if (videoadd.length > 0 && videoadd[0]?.show) {
          setIsVideoAd(true)
          setVideoAddData(videoadd);
          setShowAd(false);
        } else {
          setVideoAddData(null);
        }

        setLoading(false);
      });

    return () => {
      unsubscribe();
    };
  };

  const checkPremiumUser = async () => {
    try {
      const userID = userDetails?.uid;

      const response = await fetch(
        `https://us-central1-betx-ad052.cloudfunctions.net/getSubscriptionStatus?uid=${userID}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      //  Important: parse response
      const data = await response.json();
      console.log('Subscription API data:', data);
      setMySubscription(data)
    } catch (error) {
      console.log('Subscription check error:', error);
    }
  };



  useEffect(() => {
    const unsubscribe = firestore()
      .collection("PopupAds")
      .orderBy("createdAt", "desc")
      .limit(1)
      .onSnapshot(async (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const latestPrediction = { id: doc.id, ...doc.data() };
          console.log("In My use effect----1", latestPrediction);

          // Only proceed if latestPrediction.show === true
          if (latestPrediction.active) {
            const user = auth().currentUser;
            if (user) {
              const responseSnap = await firestore()
                .collection("user_responses")
                .where("userId", "==", user.uid)
                .where("predictionId", "==", latestPrediction.id)
                .where("action", "==", "viewed")
                .get();
              console.log("In My use effect----", responseSnap);

              if (responseSnap.empty) {
                // User has NOT viewed → show notification
                setPrediction(latestPrediction);
              } else {
                // Already viewed → don't show again
                setPrediction(null);
              }
            } else {
              setPrediction(null);
            }
          } else {
            // show is false → don't display
            setPrediction(null);
          }
        }
      });

    return () => unsubscribe();
  }, []);


  function getMatches() {
    const nowPlus10 = new Date();
    nowPlus10.setMinutes(new Date().getMinutes() - 10);


    setLoading(true);
    setMatchlist([]);

    const unsubscribe = firestore()
      .collection('Matches_Test')
      .where('matchDate', '>=', nowPlus10)
      .orderBy('matchDate')
      .onSnapshot(querySnapshot => {
        console.log(querySnapshot);
        const matches = [];
        querySnapshot.forEach(doc => {
          console.log(doc);
          matches.push({ ...doc.data(), key: doc.id });
        });
        setMatchlist(matches);
      });

    return () => {
      unsubscribe();
    };
  }

  useEffect(() => {
    if (matchlist.length > 0) {
      setProgress(Number(matchlist[0].vote));
    }
  }, [matchlist]);

  const FirstRoute = () => (
    <FlatList
      style={{ flex: 1 }}
      data={matchlist}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <MatchBanner match={item} />}
      ListEmptyComponent={() => (
        <Text
          style={{
            color: 'red',
            fontSize: 20,
            marginTop: 30,
            textAlign: 'center',
          }}>
          No Prediction Available
        </Text>
      )}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );

  const SecondRoute = () => <View style={{ flex: 1 }}></View>;

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const set_Handle_IPL = () => {
      if (IPL) {
        return set_routes([
          { key: 'first', title: 'Prediction' },
          { key: 'second', title: 'IPL Sessions' },
        ]);
      } else {
        set_routes([{ key: 'first', title: ' ' }]);
      }
    };
    set_Handle_IPL();
  }, []);

  const layout = useWindowDimensions();

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
      style={{ backgroundColor: 'rgba(0,0,0,0)' }}
      renderLabel={({ route, focused, color }) => (
        <Text
          style={{
            color: focused ? '#FFFFFF' : '#777777',
            margin: 8,
            fontWeight: 'bold',
            textShadowColor: focused ? '#fff' : '',
            textShadowOffset: focused
              ? { width: 0, height: 0 }
              : { width: 0, height: 0 },
            textShadowRadius: focused ? 10 : 0,
          }}>
          {route.title}
        </Text>
      )}
    />
  );

  const handle_refer = () => {
    console.log('Handle Refer Clicked');
    console.log(refercode);
  };
  const insets = useSafeAreaInsets();

  const userId = auth().currentUser?.uid;

  function getUserData() {

    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      return null;
    }

    const unsubscribe = firestore()
      .collection('Users')
      .doc(userId)
      .onSnapshot(
        (docSnapshot) => {
          if (docSnapshot.exists) {
            const userData = {
              uid: docSnapshot.id,
              ...docSnapshot.data(),
            };
            setUserDetails(userData)
          } else {
            Alert.alert(
              'User Not Found',
              'User record does not exist in database'
            );
          }
        },
        (error) => {
          console.log('Firestore error:', error);
          Alert.alert('Error', 'Failed to fetch user data');
        }
      );
    return unsubscribe;
  };
  
const matchLists = [
  {
    matchTitle: "IK Start VS Tromso",
    team1Image: "https://firebasestorage.googleapis.com/v0/b/betx-ad052.appspot.com/o/TeamImages%2FSun%20May%2003%202026%2016%3A30%3A12%20GMT%2B0530%20(India%20Standard%20Time)image-36.png?alt=media&token=df730a18-4fc5-4baa-b8ad-26bb76e4c6e1",
    vote: "56",
    betType: "Free",
    description: "Total, Over 2.0",
    team2Image: "https://firebasestorage.googleapis.com/v0/b/betx-ad052.appspot.com/o/TeamImages%2FSun%20May%2003%202026%2016%3A30%3A19%20GMT%2B0530%20(India%20Standard%20Time)image-37.png?alt=media&token=c9ec4172-a3ba-43fa-a557-0b6363e0663b",
    votecount_limit: 999999999,
    predictionImage: "https://firebasestorage.googleapis.com/v0/b/betx-ad052.appspot.com/o/PedictionImage%2FSun%20May%2003%202026%2016%3A30%3A33%20GMT%2B0530%20(India%20Standard%20Time)Screenshot%202026-05-03%20at%204.30.28%E2%80%AFPM.png?alt=media&token=881d7403-e699-4d46-a9f4-5f60ad40488c",
    heading: "Odds: 1.49",

    // ✅ FIX
    matchDate: firestore.Timestamp.fromMillis(1777824000 * 1000),
    betDate: firestore.Timestamp.fromMillis(1777805940 * 1000),

    votecount: 14678,
    odd: "1.49",
    matchType: "Football",
    key: "cPhBJMSWARSRuQDsanfR"
  },

  {
    matchTitle: "Juventus VS Hellas Verona",
    team1Image: "https://firebasestorage.googleapis.com/v0/b/betx-ad052.appspot.com/o/TeamImages%2FSun%20May%2003%202026%2016%3A34%3A38%20GMT%2B0530%20(India%20Standard%20Time)Unknown-135.png?alt=media&token=c7653165-b950-49f7-9390-58812c2ae826",
    vote: "68",
    betType: "Free-High",
    description: "Full time result, Juventus",
    team2Image: "https://firebasestorage.googleapis.com/v0/b/betx-ad052.appspot.com/o/TeamImages%2FSun%20May%2003%202026%2016%3A34%3A43%20GMT%2B0530%20(India%20Standard%20Time)Unknown-136.png?alt=media&token=86e29561-5a94-4605-84c6-caa00dfba547",
    votecount_limit: 99999999999,
    predictionImage: "https://firebasestorage.googleapis.com/v0/b/betx-ad052.appspot.com/o/PedictionImage%2FSun%20May%2003%202026%2016%3A34%3A58%20GMT%2B0530%20(India%20Standard%20Time)Screenshot%202026-05-03%20at%204.34.54%E2%80%AFPM.png?alt=media&token=220d1480-21f5-4ddb-ac38-31592126e7bc",
    odd: "1.21",

    // ✅ FIX
    matchDate: firestore.Timestamp.fromMillis(1777827600 * 1000),
    betDate: firestore.Timestamp.fromMillis(1777806180 * 1000),

    heading: "odds: 1.21",
    matchType: "Football",
    votecount: 14653,
    key: "tK6hPpqz6u2mvvzdot5m"
  },

  {
    matchTitle: "Viking VS Rosenborg",
    team1Image: "https://firebasestorage.googleapis.com/v0/b/betx-ad052.appspot.com/o/TeamImages%2FFri%20May%2001%202026%2012%3A20%3A32%20GMT%2B0530%20(India%20Standard%20Time)image-35.png?alt=media&token=310c7b11-abb9-4b12-9bf7-76059ee201f1",
    vote: "67",
    betType: "Premium",
    description: "Viking total, Over 1.5",
    team2Image: "https://firebasestorage.googleapis.com/v0/b/betx-ad052.appspot.com/o/TeamImages%2FFri%20May%2001%202026%2012%3A20%3A38%20GMT%2B0530%20(India%20Standard%20Time)image-3.webp?alt=media&token=6a7801d8-fc4c-4f1d-8532-386b7ff839a6",
    votecount_limit: 9999999999,
    predictionImage: "https://firebasestorage.googleapis.com/v0/b/betx-ad052.appspot.com/o/PedictionImage%2FFri%20May%2001%202026%2012%3A20%3A51%20GMT%2B0530%20(India%20Standard%20Time)Screenshot%202026-05-01%20at%2012.20.47%E2%80%AFPM.png?alt=media&token=d1a35393-7af0-4229-871f-1cf2f083a4ff",
    heading: "Odds: 1.38",

    // ✅ FIX
    matchDate: firestore.Timestamp.fromMillis(1778086800 * 1000),
    betDate: firestore.Timestamp.fromMillis(1777618140 * 1000),

    votecount: 14757,
    odd: "1.38",
    matchType: "Football",
    key: "2pxHFbGkgReaCVzBzjer"
  }
];


  return (
    <View style={{ flex: 1, backgroundColor: '#161616', paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            alignSelf: 'center'
          }}>
          <BetexLogo
            style={{ marginLeft: 15, marginTop: 15, width: 50, height: 50 }}
          />
        </View>

        <View style={{ marginBottom: 30 }}>
          <Corosel />
        </View>

        <FlatList
          style={{ flex: 1, marginLeft: 10, marginRight: 10 }}
          data={matchlist}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <MatchBanner 
          match={item} 
          // mySubscription={mySubscription}
          />}
          ListEmptyComponent={() => (
            <Text
              style={{
                color: 'red',
                fontSize: 20,
                marginTop: 30,
                textAlign: 'center',
              }}>
              No Prediction Available
            </Text>
          )}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {!showAd && isVideoAd && videoAddData?.length > 0 && videoAddData[0].show ? (
          <AdVideo
            source={{ uri: videoAddData[0].video }}
            initialMuted={true}
            autoPlay
            onClose={() => setVideoAddData([])}
          />
        ) : showAd && !isVideoAd ? (
          <AdBanner
            imageUri={posterData?.image}
            description={posterData?.description}
            redirectUrl={posterData?.link}
            onClose={() => setShowAd(false)}
            style={{
              position: 'absolute',
              bottom: 60,
              zIndex: 999,
            }}
          />
        ) : null}
      </View>
      {prediction && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <PredictionNotification
            prediction={prediction}
            onClose={() => setPrediction(null)}
          />
        </View>
      )}

      <GoogleInterstitialAd ref={interstitialRef} />

      { <TouchableOpacity style={{
        position: 'absolute',
        bottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 10,
        borderRadius: 30,
        backgroundColor: '#FFD700',
        flexDirection: 'row',
      }}
        onPress={() => props.navigation.navigate('Payment')}
      >
        <Icons name="crown" size={20} color="#000" style={{ marginRight: 5 }} />
        <Text style={{ color: '#000', fontWeight: 'bold' }}>Go Premium</Text>
      </TouchableOpacity> 
      }
    </View>
  );
}

export default HomeScreen;

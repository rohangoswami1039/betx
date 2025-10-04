import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  FlatList,
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

  const [IPL, set_IPL] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);
  const initialRef = useRef(null);
  const [refercode, set_refercode] = useState('');
  const finalRef = useRef(null);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
      .collection('Poster_Add')
      .onSnapshot(querySnapshot => {
        const posteradd = [];
        querySnapshot.forEach(doc => posteradd.push(doc.data()));
        if (posteradd.length > 0 && posteradd[0]?.['show ']) {
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


  useEffect(() => {
    const unsubscribe = firestore()
      .collection("PopUp_Predictions")
      .orderBy("createdAt", "desc")
      .limit(1)
      .onSnapshot(async (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const latestPrediction = { id: doc.id, ...doc.data() };

          const user = auth().currentUser;
          if (user) {
            const responseSnap = await firestore()
              .collection("user_responses")
              .where("userId", "==", user.uid)
              .where("predictionId", "==", latestPrediction.id)
              .where("action", "==", "viewed")
              .get();

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
  console.log(matchlist);

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

  console.log(showAd, isVideoAd, 'Handle Refer Clicked', videoAddData);

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
      </View>
      <View style={{}}>
        {!showAd && isVideoAd && videoAddData?.length > 0 && videoAddData[0].show ? (
          <AdVideo
            source={{ uri: videoAddData[0].video }}
            initialMuted={true}
            autoPlay
            onClose={() => setVideoAddData([])}
          />
        ) : showAd && !isVideoAd ? (
          <AdBanner
            imageUri={posterData?.add}
            redirectUrl={posterData?.linkTo_open}
            onClose={() => setShowAd(false)}
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



    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({});

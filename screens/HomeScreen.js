import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, ImageBackground, useWindowDimensions, FlatList } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { BetexLogo, Wallet, Notification } from '../assets/icons';
import { Corosel, MatchBanner } from '../Components';
import firestore from '@react-native-firebase/firestore'; 
function HomeScreen(props) {
  const [matchlist, setMatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true); // Ref to track component mount state
  const[progres, setProgress] = useState(0);
  const [routes,set_routes]=useState([])

  const [IPL,set_IPL]=useState(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false; // Set mounted to false when component unmounts
    };
  }, []);

  useEffect(() => {
    {
      getMatches();
    }
  }, []);

  function getMatches() {
    const nowPlus10 = new Date();
    nowPlus10.setMinutes(new Date().getMinutes() - 10);
    console.log("Match Date check >>> ",nowPlus10);
  
    setLoading(true);
    setMatchlist([]);
  
    const unsubscribe = firestore()
      .collection('Matches')
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
  console.log(matchlist)


  const FirstRoute = () => (
    <FlatList
    style={{flex:1}}
    data={matchlist}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => <MatchBanner match={item} />}
    ListEmptyComponent={() => (
      <Text style={{ color: 'red', fontSize: 20, marginTop: 30, textAlign: 'center' }}>
        No Prediction Available
      </Text>
    )}
    contentContainerStyle={{ flexGrow: 1 }}
  />
  );

  const SecondRoute = () => (
    <View style={{ flex: 1}}>
    </View>
  );

  const ThirdRoute = () => (
    <View style={{ flex: 1 }}>
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute
  });

  const [index, setIndex] = useState(0);

  useEffect(()=>{
    const set_Handle_IPL=()=> {
      if(IPL){
        return(
          set_routes([
            { key: 'first', title: 'Prediction' },
            { key: 'second', title: 'IPL Sessions' },
            { key: 'third', title: 'Fantasy' }
          ])
        )
      }
      else {
        set_routes([
          { key: 'first', title: ' ' },
        ])
      }
    }
    set_Handle_IPL()
  },[])



  const layout = useWindowDimensions();

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'rgba(0,0,0,0)'}}
      style={{ backgroundColor: 'rgba(0,0,0,0)' }}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color: focused ? '#FFFFFF' : '#777777', 
                       margin: 8,
                       fontWeight:'bold' ,
                       textShadowColor:focused ? '#fff' : '',
                       textShadowOffset:focused ? { width: 0, height: 0 }:{ width: 0, height: 0 },
                       textShadowRadius:focused ? 10:0, 
                      }}>{route.title}</Text>
      )}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#101010' }}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={{ flex: 1, resizeMode: 'cover' }}
      >
        <View style={{flex:1}}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
            <BetexLogo style={{ margin:10, width: 40, height: 50 }} />
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={()=>{props.navigation.navigate("Wallet")}} style={{ marginHorizontal: 10 }}>
                <Wallet />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => props.navigation.navigate("Notification")} style={{ marginHorizontal: 10 }}>
                <Notification />
              </TouchableOpacity>
            </View>
          </View>


          <View style={{ paddingHorizontal: 20 }}>
            <Corosel />
          </View>

          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            style={{marginBottom:70}}
          />
        </View>
        
      </ImageBackground>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({

})

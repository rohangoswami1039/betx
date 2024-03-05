import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import LoadingModal from './LoadingModal.js';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import { TrendingNews, TrendingNewsBanner } from '../Components';
import {
  Cricket,
  Basketball,
  Football,
  BaseBall,
  Tennis,
  VollyBall,
  IceHockey,
  Handball,
  Rugby
} from '../assets/icons'
function ExploreScreen(props) {
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showGame, setShowScreen] = useState('Cricket');
  const [newsList, setNewsList] = useState([]);
  const [newsListTrending, setNewsListTrending] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const [news, SetNews]= useState();
  // useEffect(() => {
  //   getMatchesFromDatabase(showGame);
  // }, [showGame]);
  // useEffect(() => {
  //   getTrendingNews();
  // }, []);

  // function getTrendingNews() {
  //   setNewsListTrending([]);
  //   //console.log('getTrendingNews')
  //   firestore()
  //     .collection('News')
  //     .where('trending', '==', true)
  //     .orderBy("dateTime", "desc")
  //     .onSnapshot(querySnapshot => {
  //       const li = [];
  //       // console.log("dataaaaa "+querySnapshot);
  //       try {
  //         querySnapshot.forEach(documentSnapshot => {
  //           li.push({ ...documentSnapshot.data(), key: documentSnapshot.id });
  //         });
  //         setNewsListTrending(li)
  //       } catch (error) {
  //         console.log('Error while getting trending news ' + error);
  //       }
  //       // console.log("newsList"+newsList)
  //     })
  // }

  // function getMatchesFromDatabase(gamename) {
  //   setNewsList([]);
    //console.log('getMatchesFromDatabase')
    // console.log("Game name = "+gamename)
    // firestore()
    //       .collection('News')
    //       .where('matchType','==',gamename)
    //       .orderBy("dateTime")
    //       .onSnapshot(querySnapshot => {
    //         console.log("querySnapshot"+querySnapshot);
    //         const li = [];
    //         if(querySnapshot){
    //           querySnapshot.forEach(documentSnapshot => {
    //             li.push({...documentSnapshot.data() , key:documentSnapshot.id});
    //             });
    //         }

    //         setNewsList(li)
    //         // console.log("newsList"+newsList)
    //       })

  //   firestore()
  //     .collection('News')
  //     // Order results
  //     .where('matchType', '==', gamename)
  //     // .orderBy('dateTime', 'desc')
  //     .orderBy("dateTime", "desc")
  //     .get()
  //     .then(querySnapshot => {
  //       const li = [];
  //       // console.log("query data: " + querySnapshot.exists);
  //       querySnapshot.forEach(documentSnapshot => {
  //         // console.log("datab  sss")
  //         li.push({ ...documentSnapshot.data(), key: documentSnapshot.id });
  //       });
  //       setNewsList(li)
  //     }).catch(err => {
  //       console.log("Error: " + err)
  //     });
  // }



  

  
    useEffect(() => {
      // Get the current date
      const currentDate = new Date();
  
      // Add 24 hours to the current date
      // const futureDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
  
      // // Format the future date in the required format (YYYY-MM-DD)
      // const formattedDate = futureDate.toISOString().split('T')[0];

      // Get the current date


// Get the date one month before today
var oneMonthBefore = new Date(currentDate);
oneMonthBefore.setMonth(currentDate.getMonth() - 1);

// Set the day to 0 to get the last day of the previous month
oneMonthBefore.setDate(0);

// Format the date as "YYYY-MM-DD"
var formattedDate = oneMonthBefore.toISOString().slice(0, 10);

console.log(formattedDate); // Example output: "2023-06-30"

  
      // Construct the API URL with the future date
      // const url = `https://newsapi.org/v2/everything?q=sports+${showGame}+&from=${formattedDate}&language=en&sortBy=publishedAt&apiKey=c52ee09edeee4a23aabf000dbafbd599`;
       const url= `https://api.worldnewsapi.com/search-news?api-key=93fa3cc5bf914aa283b09366a7ee0375&text=${showGame}&earliest-publish-date=${formattedDate}&language=eng&sort=publish-time`
      // Make the HTTP request
      fetch(url)
        .then(response => response.json())
        .then(data => {
          // Process the response (e.g., log the articles)
          // console.log(data.articles, "dataa fetch news");
          console.log(formattedDate, "formatted date");
          const articles = data.news;
          SetNews(articles);
          console.log(articles, "articleskjhkjh")
          articles.forEach(article => {
            console.log(article.title);
          });
        })
        .catch(error => {
          console.error(error);
        });
    }, [showGame]);
  
   
  
  
 
  











  return (
    <>
      <LoadingModal show={showLoadingModal} />
      <View style={{ height: 150, paddingTop: 50, backgroundColor: '#181829' }} >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: '#181829', height: 10, marginLeft: 20 }}
          horizontal={true}
        >
          {
            (showGame == 'Cricket') ?
              <LinearGradient style={styles.RoundButtonName} colors={['#ED6B4E', '#F4A58A']} start={{ x: 0.4, y: 1.9 }} end={{ x: 0.15, y: 0.0 }}>
                <Cricket />
                <Text style={{ fontWeight: 'bold', color: 'white' }}>Cricket</Text>
              </LinearGradient>
              :
              <TouchableOpacity style={styles.RoundButton} onPress={() => setShowScreen('Cricket')}>
                <Cricket />
              </TouchableOpacity>
          }
          {
            (showGame == 'Basketball') ?
              <LinearGradient style={styles.RoundButtonName} colors={['#F4A58A', '#ED6B4E']} start={{ x: 0.35, y: 0.35 }} end={{ x: 0.8, y: 1.0 }}>
                <Basketball />
                <Text style={{ fontWeight: 'bold', color: 'white' }}>Basketball</Text>
              </LinearGradient>
              :
              <TouchableOpacity style={styles.RoundButton} onPress={() => setShowScreen('Basketball')}>
                <Basketball />
              </TouchableOpacity>
          }
          {
            showGame == 'Football' ?
              <LinearGradient style={styles.RoundButtonName} colors={['#F4A58A', '#ED6B4E']} start={{ x: 0.35, y: 0.35 }} end={{ x: 0.8, y: 1.0 }}>
                <Football />
                <Text style={{ fontWeight: 'bold', color: 'white' }}>Football</Text>
              </LinearGradient>
              :
              <TouchableOpacity style={styles.RoundButton} onPress={() => setShowScreen('Football')}>
                <Football />
              </TouchableOpacity>
          }
          {
            showGame == 'Baseball' ?
              <LinearGradient style={styles.RoundButtonName} colors={['#F4A58A', '#ED6B4E']} start={{ x: 0.35, y: 0.35 }} end={{ x: 0.8, y: 1.0 }}>
                <BaseBall />
                <Text style={{ fontWeight: 'bold', color: 'white', marginLeft: 7 }}>Baseball</Text>
              </LinearGradient>
              :
              <TouchableOpacity style={styles.RoundButton} onPress={() => setShowScreen('Baseball')}>
                <BaseBall />
              </TouchableOpacity>
          }
          {
            showGame == 'Tennis' ?
              <LinearGradient style={styles.RoundButtonName} colors={['#F4A58A', '#ED6B4E']} start={{ x: 0.35, y: 0.35 }} end={{ x: 0.8, y: 1.0 }}>
                <Tennis />
                <Text style={{ fontWeight: 'bold', color: 'white' }}>Tennis</Text>
              </LinearGradient>
              :
              <TouchableOpacity style={styles.RoundButton} onPress={() => setShowScreen('Tennis')}>
                <Tennis />
              </TouchableOpacity>
          }
          {
            showGame == 'Volleyball' ?
              <LinearGradient style={styles.RoundButtonName} colors={['#F4A58A', '#ED6B4E']} start={{ x: 0.35, y: 0.35 }} end={{ x: 0.8, y: 1.0 }}>
                <VollyBall />
                <Text style={{ fontWeight: 'bold', color: 'white' }}>Volleyball</Text>
              </LinearGradient>
              :
              <TouchableOpacity style={styles.RoundButton} onPress={() => setShowScreen('Volleyball')}>
                <VollyBall />
              </TouchableOpacity>
          }
          {
            showGame == 'Ice Hockey' ?
              <LinearGradient style={styles.RoundButtonName} colors={['#F4A58A', '#ED6B4E']} start={{ x: 0.35, y: 0.35 }} end={{ x: 0.8, y: 1.0 }}>
                <IceHockey />
                <Text style={{ fontWeight: 'bold', color: 'white' }}>Ice Hockey</Text>
              </LinearGradient>
              :
              <TouchableOpacity style={styles.RoundButton} onPress={() => setShowScreen('Ice Hockey')}>
                <IceHockey />
              </TouchableOpacity>
          }
          {
            showGame == 'Handball' ?
              <LinearGradient style={styles.RoundButtonName} colors={['#F4A58A', '#ED6B4E']} start={{ x: 0.35, y: 0.35 }} end={{ x: 0.8, y: 1.0 }}>
                <Handball />
                <Text style={{ fontWeight: 'bold', color: 'white' }}>Handball</Text>
              </LinearGradient>
              :
              <TouchableOpacity style={styles.RoundButton} onPress={() => setShowScreen('Handball')}>
                <Handball />
              </TouchableOpacity>
          }
          {
            showGame == 'Rugby' ?
              <LinearGradient style={styles.RoundButtonName} colors={['#F4A58A', '#ED6B4E']} start={{ x: 0.35, y: 0.35 }} end={{ x: 0.8, y: 1.0 }}>
                <Rugby />
                <Text style={{ fontWeight: 'bold', color: 'white' }}>Rugby</Text>
              </LinearGradient>
              :
              <TouchableOpacity style={styles.RoundButton} onPress={() => setShowScreen('Rugby')}>
                <Rugby />
              </TouchableOpacity>
          }

        </ScrollView>
      </View>

      <ScrollView
        style={{ backgroundColor: '#181829', paddingLeft: 20, paddingRight: 20 }}
        showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={() => { getMatchesFromDatabase(showGame); }} />
        // }
        >
        {
          news?.map((fnews, index) => (<TrendingNews news={fnews} key={index} />))
        }
        {newsList.length < 0 && <Text style={{ fontSize: 20, color: 'white' }}>No news found for {showGame}</Text>}
      </ScrollView>
      <View style={{ backgroundColor: '#181829', height: 250, paddingTop: 15 }}>
        <Text style={{ paddingLeft: 20, color: 'white', marginBottom: 10, fontSize: 20 }}>Trending News</Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={() => { getTrendingNews(); }} />
          // }
          >
          {
            news?.map((news, index) => (<TrendingNewsBanner news={news} key={index} />))
          }
        </ScrollView>

      </View>

    </>
  );
}

export default ExploreScreen;

const styles = StyleSheet.create({

  RoundButtonName: {
    marginLeft: 20,
    padding: 12,
    height: 70,
    borderRadius: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  RoundButton: {
    marginLeft: 20,
    height: 70,
    width: 70,
    borderRadius: 36,
    backgroundColor: '#222232',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
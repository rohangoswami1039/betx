import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import LoadingModal from './LoadingModal.js';
import {WebView} from 'react-native-webview';
import {ArrowBackIcon} from 'native-base';

function ExploreScreen(props) {
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async () => {
    try {
      setShowLoadingModal(true);
      const url = `https://newsapi.org/v2/top-headlines?apiKey=930a6f37257d41cd9dcb935bc2225c45&category=sports&language=en`;
      const response = await axios.get(url);
      setNews(response.data.articles);
      console.log('News Data', response.data.articles);
      setShowLoadingModal(false);
    } catch (error) {
      console.error(error);
      setShowLoadingModal(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  };

  if (selectedNews) {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity>
            <ArrowBackIcon
              onPress={() => setSelectedNews(null)}
              color="white"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trending News</Text>
        </View>
        <WebView source={{uri: selectedNews.url}} />
      </View>
    );
  }

  return (
    <>
      <LoadingModal show={showLoadingModal} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
          />
        }>
        <Text style={styles.pageTitle}>Trending News</Text>
        {news.length > 0 ? (
          news.map((article, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedNews(article)}>
              <View style={styles.newsItem}>
                <Text style={styles.newsTitle}>{article.title}</Text>
                {article.urlToImage && (
                  <View style={styles.imageContainer}>
                    {imageLoading && (
                      <ActivityIndicator
                        size="large"
                        color="#ffffff"
                        style={styles.loader}
                      />
                    )}
                    <Image
                      source={{uri: article.urlToImage}}
                      style={styles.newsImage}
                      onLoadEnd={() => setImageLoading(false)}
                    />
                  </View>
                )}
                <View style={styles.newsDetails}>
                  <Text style={styles.newsDate}>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.newsSource}>{article.source.name}</Text>
                </View>
                <Text style={styles.newsDescription}>
                  {article.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noNewsText}>No news found.</Text>
        )}
      </ScrollView>
    </>
  );
}

export default ExploreScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#222232',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
    flex: 1,
  },
  scrollView: {
    backgroundColor: '#181829',
    paddingLeft: 20,
    paddingRight: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 20,
    textAlign: 'left',
  },
  newsItem: {
    backgroundColor: '#222232',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  imageContainer: {
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -12}, {translateY: -12}],
  },
  newsImage: {
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  newsDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  newsDate: {
    fontSize: 14,
    color: 'grey',
  },
  newsSource: {
    fontSize: 14,
    color: 'grey',
  },
  newsDescription: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
  },
  newsContent: {
    fontSize: 14,
    color: 'white',
    marginTop: 10,
  },
  noNewsText: {
    fontSize: 20,
    color: 'white',
  },
});

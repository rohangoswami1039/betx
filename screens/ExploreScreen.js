import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl} from 'react-native';
import FastImage from 'react-native-fast-image';
import {FlatList} from 'react-native-gesture-handler'; // or from 'react-native'
import axios from 'axios';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

const PAGE_SIZE = 20; 

const NewsItem = React.memo(({article, onPress}) => {
  const [imgLoading, setImgLoading] = useState(true);
  return (
    <TouchableOpacity onPress={() => onPress(article)}>
      <View style={styles.newsItem}>
        <Text style={styles.newsTitle}>{article.title}</Text>
        {!!article.urlToImage && (
          <View style={styles.imageContainer}>
            {imgLoading && <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />}
            <FastImage
              style={styles.newsImage}
              source={{ uri: article.urlToImage, priority: FastImage.priority.normal }}
              onLoadEnd={() => setImgLoading(false)}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        )}
        <View style={styles.newsDetails}>
          <Text style={styles.newsDate}>{new Date(article.publishedAt).toLocaleDateString()}</Text>
          <Text style={styles.newsSource}>{article.source?.name}</Text>
        </View>
        <Text style={styles.newsDescription}>{article.description}</Text>
      </View>
    </TouchableOpacity>
  );
});

function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);
  const endReachedRef = useRef(false);

  const fetchNews = useCallback(async (page = 1, append = false) => {
    const url = `https://newsapi.org/v2/top-headlines?category=sports&language=en&pageSize=${PAGE_SIZE}&page=${page}`;
    // Move key to server in production; this is only for demonstration.
    const headers = { 'X-Api-Key': '930a6f37257d41cd9dcb935bc2225c45' };
    const res = await axios.get(url, { headers });
    const items = res.data?.articles ?? [];
    setNews(prev => append ? [...prev, ...items] : items);
    if (items.length < PAGE_SIZE) endReachedRef.current = true;
  }, []);

  useEffect(() => {
    fetchNews().catch(() => {});
  }, [fetchNews]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    pageRef.current = 1;
    endReachedRef.current = false;
    try { await fetchNews(1, false); } finally { setRefreshing(false); }
  }, [fetchNews]);

  const onEndReached = useCallback(async () => {
    if (loadingMore || endReachedRef.current) return;
    setLoadingMore(true);
    try {
      pageRef.current += 1;
      await fetchNews(pageRef.current, true);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchNews, loadingMore]);

  const keyExtractor = useCallback((item, index) => item.url || `${index}`, []);
  const renderItem = useCallback(({item}) => (
    <NewsItem article={item} onPress={setSelectedNews} />
  ), []);

  if (selectedNews) {
    return (
      <View style={{flex: 1, backgroundColor: '#161616', paddingTop: insets.top, paddingBottom: insets.bottom}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedNews(null)}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trending News</Text>
        </View>
        {/* Keep WebView as-is */}
      </View>
    );
  }

  return (
    <View style={{paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#161616', flex: 1}}>
      <Text style={styles.pageTitle}>Trending News</Text>
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{paddingHorizontal: 20}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffffff" />}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        windowSize={7}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        removeClippedSubviews
        ListFooterComponent={loadingMore ? <ActivityIndicator color="#fff" style={{marginVertical: 16}} /> : null}
        ListEmptyComponent={<Text style={styles.noNewsText}>Loading…</Text>}
      />
    </View>
  );
}

export default ExploreScreen;


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#1c1c1c',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
    flex: 1,
  },
  scrollView: {
    backgroundColor: '#161616',
    paddingLeft: 20,
    paddingRight: 20,
  },
  pageTitle: {
    margin: 20,
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#161616',
    textAlign: 'left',
  },
  newsItem: {
    backgroundColor: '#1c1c1c',
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

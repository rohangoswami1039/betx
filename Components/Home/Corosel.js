import React, { useState, useEffect } from 'react';
import { View, Dimensions, Image, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { firestore } from '../../firebaseConfig';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width;
const ITEM_HIEGHT = height;

function CarouselComponent() {
  const [bannerList, setBannerList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('BannerImages')
      .orderBy('dateTime', 'desc')
      .onSnapshot(querySnapshot => {
        const banners = [];
        querySnapshot.forEach(doc => {
          banners.push({ ...doc.data(), key: doc.id });
        });
        setBannerList(banners);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
  

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={ITEM_WIDTH}
        height={200}
        autoPlay={true}
        data={bannerList}
        onSnapToItem={setCurrentIndex}
        renderItem={renderItem}
        style={{ width: ITEM_WIDTH - 12, marginHorizontal: 6 }}
        autoPlayInterval={1500}
        scrollAnimationDuration={1200}
      />
      <View style={styles.paginationContainer}>
        {bannerList.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
    right: 4,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: ITEM_WIDTH - 24,
    height: ITEM_HIEGHT / 4.5,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    alignSelf: 'center',
    // marginVertical: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    resizeMode: 'cover',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#007FFF',
  },
  inactiveDot: {
    backgroundColor: '#D9D9D9',
    opacity: 0.4,
  },
});

export default CarouselComponent;

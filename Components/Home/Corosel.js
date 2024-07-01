import React, {useState, useRef, useEffect} from 'react';
import {View, Dimensions, Image, StyleSheet} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import firestore from '@react-native-firebase/firestore';

export const SLIDER_WIDTH = Dimensions.get('window').width - 55;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH);

const {width, height} = Dimensions.get('window');

function CarouselComponent(props) {
  const [index, setIndex] = useState(0);
  const [bannerList, setBannerList] = useState([]);
  const isCarousel = useRef(null);

  useEffect(() => {
    getBanners();
  }, []);

  function getBanners() {
    firestore()
      .collection('BannerImages')
      .orderBy('dateTime', 'desc')
      .onSnapshot(querySnapshot => {
        const li = [];
        querySnapshot.forEach(documentSnapshot => {
          li.push({...documentSnapshot.data(), key: documentSnapshot.id});
        });
        setBannerList(li);
      });
  }

  const renderItem = ({item}) => {
    return (
      <View style={styles.imageContainer}>
        <Image
          resizeMode="contain"
          source={{uri: item.image}}
          style={styles.image}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={isCarousel}
        data={bannerList}
        renderItem={renderItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={setIndex}
        decelerationRate={0.25}
        autoplay={true}
        loop={true}
      />

      <Pagination
        dotsLength={bannerList.length}
        activeDotIndex={index}
        carouselRef={isCarousel}
        dotStyle={styles.activeDot}
        tappableDots={true}
        inactiveDotStyle={styles.inactiveDot}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        containerStyle={styles.paginationContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
  },
  paginationContainer: {
    position: 'absolute',
    top: 200,
    paddingVertical: 8,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007FFF',
  },
  inactiveDot: {
    backgroundColor: '#D9D9D9',
  },
});

export default CarouselComponent;

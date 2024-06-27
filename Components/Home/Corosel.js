import React, {useState, useRef, useEffect} from 'react';
import {Text, View, Dimensions, Image} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import firestore from '@react-native-firebase/firestore';

export const SLIDER_WIDTH = Dimensions.get('window').width - 55;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH);

const {width, height} = Dimensions.get('window');

function Corosel(props) {
  const [index, setIndex] = useState(0);
  const [bannerList, setBannerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const isCarousel = useRef(null);

  useEffect(() => {
    {
      getBanners();
    }
  }, []);
  function getBanners() {
    firestore()
      .collection('BannerImages')
      .orderBy('dateTime', 'desc')
      .onSnapshot(querySnapshot => {
        const li = [];
        querySnapshot.forEach(documentSnapshot => {
          //console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
          li.push({...documentSnapshot.data(), key: documentSnapshot.id});
        });
        setBannerList(li);
        setLoading(false);
      });
  }

  //new comment

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          //borderWidth: 1,
          justifyContent: 'center',
          //padding: 20,
          // borderRadius: 20,
          alignItems: 'center',
          // backgroundColor: 'white',
        }}>
        <Image
          resizeMode="contain"
          source={{uri: item.image}}
          style={{width: '100%', height: 200}}
        />
        {/* <Text style={{marginVertical: 10, fontSize: 20, fontWeight: 'bold'}}>
              {item.name}
            </Text> */}
      </View>
    );
  };

  return (
    <>
      <View style={{marginTop: 10}}>
        <Carousel
          ref={isCarousel}
          data={bannerList}
          renderItem={renderItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          onSnapToItem={index => {
            setIndex(index);
          }}
          decelerationRate={0.25}
          autoplay={true}
          loop={true}
        />

        <Pagination
          dotsLength={bannerList.length}
          activeDotIndex={index}
          carouselRef={isCarousel}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: -5,
            backgroundColor: '#D9D9D9',
          }}
          tappableDots={true}
          inactiveDotStyle={{
            backgroundColor: '#D9D9D9',
            // Define styles for inactive dots here
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          dotContainerStyle={{
            marginTop: -40,
            marginBottom: 0,
          }}
          containerStyle={{marginBottom: -40}}
        />
      </View>
    </>
  );
}

export default Corosel;

// const styles = StyleSheet.create({

// })

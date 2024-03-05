import React from 'react';
import {Text,View,Image,StyleSheet,TouchableOpacity } from 'react-native';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

function TrendingNews(props) {
    const navigation = useNavigation();
    console.log(props,"pprops")
    // console.log('trending news inside  '+props.news.title)
    return (
        <TouchableOpacity  style={{flexDirection:'row', marginBottom:20}} onPress={() => {navigation.navigate("ExploreArticleDetails",{news:props.news}) }}>
            <View>
                <Image
                    style={styles.newsImage}
                    source={{
                        uri: props.news.image,
                    }}
                />
            </View>
            <View style={{marginLeft: 20,}}>
                <Text numberOfLines={3} style={{color:'white', flexDirection: 'row',width: 250}}>{props.news.title}</Text>
                {/* <Text style={{color:'white'}}>{( new Date(props.news.publish_date).toLocaleString())}</Text> */}
            </View>
            
        </TouchableOpacity>
    );
}

export default TrendingNews;
const styles = StyleSheet.create({
   
    newsImage: {
      width: 80,
      height: 80,
      borderRadius:10
    },
  });
import React from 'react';
import {Text,View,Image,StyleSheet,TouchableOpacity } from 'react-native';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

function TrendingNewsBanner(props) {
    const navigation = useNavigation();
    // console.log('trending news inside  '+props.news.title)
    return (
        <TouchableOpacity  style={{flexDirection:'row', marginLeft:20}} onPress={() => {navigation.navigate("ExploreArticleDetails",{news:props.news}) }}>
           
            <View >
                <Image
                    style={styles.newsImage}
                    source={{
                        uri: props.news.urlToImage,
                    }}
                />
                <View style={{}}>
                    <View style={{}}>
                        <Text numberOfLines={3} style={{paddingLeft:10,marginBottom:40,position:'absolute',bottom:0,color:'white',width: 200}}>{props.news.title}</Text>
                    </View>
                    <View>
                        {/* <Text  style={{paddingLeft:10,marginBottom:10,position:'absolute',bottom:0,color:'white', flexDirection: 'row',width: 200}}>{moment(props.news.dateTime.toDate()).format('MMM DD, yyyy')}</Text> */}
                    </View>
                </View>
                
            </View>
            
            {/* <View style={{position:'absolute',padding:10,flex: 1}}>
                <Text  style={{color:'white', flexDirection: 'row',width: 250}}>{props.news.title}</Text>
                <Text style={{color:'white',bottom:0}}>{moment(props.news.dateTime.toDate()).format('DD MMM yyyy, HH:mm')}</Text>
            </View> */}
            
        </TouchableOpacity>
    );
}

export default TrendingNewsBanner;
const styles = StyleSheet.create({
   
    newsImage: {
      width: 200,
      height: 150,
      borderRadius:10
    },
  });
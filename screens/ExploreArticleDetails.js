import React from 'react';
import {View,Text,ScrollView,StyleSheet,Image} from 'react-native'
import{ArrowLeft} from '../assets/icons';
import { useNavigation } from '@react-navigation/native';
import HTML from 'react-native-render-html';

function ExploreArticleDetails(props) {
    const navigation = useNavigation();
    // console.log('news in article details screen ',props.route.params)
    // console.log(props.route.params.news.content,"newsss")
    return (
        
        <ScrollView style={{backgroundColor:'#2B2B3D'}}>
           
            <Image
            style={styles.newsImage}
            source={{
                uri: props.route.params.news.image,
            }}
            />
            <View style={{position:'absolute',marginTop:40,marginLeft:20}}>
                <ArrowLeft onPress={()=>navigation.navigate("Home")}/>
            </View>
            <View style={{padding:30}}>
               

                
                <Text style={{fontSize:20,color:'white'}}>{props.route.params.news.title}</Text>
                
                {/* <Text>jwhcblsjbcbcljbjn lnan ddc</Text> */}
                <Text style={{color:'white'}}>
                        <Text style={{fontSize:60}}>{props.route.params.news.title.charAt(0).toUpperCase()}</Text>
                        {props.route.params.news.title.slice(1)}
                </Text>
                <Text style={{color:'white'}}>
                        <Text style={{fontSize:16}}>{props.route.params.news.text}</Text> 
                         {/* {props.route.params.news.content}  */}
                </Text> 
                     
   
            </View>
            
        </ScrollView>
    );
}

export default ExploreArticleDetails;
const styles = StyleSheet.create({
   
    newsImage: {
      width: '100%',
      height: undefined,
      aspectRatio: 1,
    //   borderBottomLeftRadius:50,
    //   borderBottomRightRadius:50
    },
    // container: {
    //     flex: 1,
    //     justifyContent: 'flex-start',
    //     alignItems: 'flex-start',
    //     flexDirection: 'row'
    //   },
    //   textCommon: {
    //   },
    //   firstLetter: {
    //     fontSize: 23,
    //   }
  });
import React,{useState} from 'react';
import {ScrollView,TouchableOpacity ,Linking} from 'react-native'
import {Text, View,Button,Pressable } from 'native-base';

import { useNavigation } from '@react-navigation/native';

import{
    ArrawDown,
    ArrawRight
}from '../assets/icons';

function ProfileScreenSupport(props) {
    const navigation = useNavigation();
    const [expandFaq , setExpandFaq] = useState(false);
    return (
        <ScrollView >
            {/* <TouchableOpacity onPress={() => { navigation.navigate("PredictionHistory");}}>
            <View ml="12" mr="12" mt="10"  pb="5" style={{flexDirection: 'row',justifyContent:'space-between'}} borderBottomWidth="2" borderColor="#222232">
                <View>
                    <Text style={{color: 'white'}}>Prediction History </Text>
                    </View>
                <ArrawRight/>
            </View>
            </TouchableOpacity>  */}
            <TouchableOpacity onPress={() => { setExpandFaq(!expandFaq)}}>
                <View ml="12" mr="12" mt="5"  pb="5" style={{flexDirection: 'row',justifyContent:'space-between'}} borderBottomWidth="2" borderColor="#222232" >
                    <View>
                        <Text style={{color: 'white'}}>FAQ’s </Text>
                    </View>
                    {expandFaq?<ArrawDown/>:<ArrawRight/>}
                </View>
            </TouchableOpacity>
            {expandFaq?
            <View>
                <View ml="16" mr="12"  mt="5" pb="5" borderBottomWidth="2" borderColor="#222232">
                    <Text style={{color: 'white',fontSize:18}}>What is betX?</Text>
                    <Text mt="2" style={{color: 'white'}}>betX is an innovative sports prediction app powered by AI. It uses advanced machine learning algorithms to analyze historical data, team/player statistics, and other factors to provide accurate predictions for sports events.</Text>
                </View>
                <View ml="16" mr="12"  mt="5" pb="5" borderBottomWidth="2" borderColor="#222232">
                    <Text style={{color: 'white',fontSize:18}}>How does betX work? </Text>
                    <Text mt="2" style={{color: 'white'}}>betX gathers vast amounts of data, such as team/player performance, match results, weather conditions, injuries, and lot more. Using cutting-edge AI algorithms, this data is processed to generate predictions for upcoming sports events, helping users make well-informed betting decisions.</Text>
                </View>
                <View ml="16" mr="12"  mt="5" pb="5" borderBottomWidth="2" borderColor="#222232">
                    <Text style={{color: 'white',fontSize:18}}>Can I trust the predictions provided by betX?</Text>
                    <Text mt="2" style={{color: 'white'}}>While betX utilizes state-of-the-art AI algorithms and extensive data analysis, it's important to note that sports predictions are never 100% accurate. However, betX aims to provide users with the most reliable and informed predictions available, increasing the chances of making successful bets.</Text>
                </View>
                <View ml="16" mr="12"  mt="5" pb="5" borderBottomWidth="2" borderColor="#222232">
                    <Text style={{color: 'white',fontSize:18}}>Can I use betX to place bets directly through the platform? </Text>
                    <Text mt="2" style={{color: 'white'}}>No, betX is a sports prediction platform and does not facilitate direct betting. It aims to provide accurate predictions to assist users in making informed betting decisions. You can use the predictions provided by betX to guide your betting strategy and place bets through your preferred bookmaker or sports betting platform.
                       </Text>
                </View>
                <View ml="16" mr="12"  mt="5" pb="5" borderBottomWidth="2" borderColor="#222232">
                    <Text style={{color: 'white',fontSize:18}}>What is Free-High?</Text>
                    <Text mt="2" style={{color: 'white'}}>Free-High offers premium-like predictions with returns ranging from 70% to 150% on your investments. This means odds falling between 1.7 to 2.5+.</Text>
                </View>

                <View ml="16" mr="12"  mt="5" pb="5" borderBottomWidth="2" borderColor="#222232">
                    <Text style={{color: 'white',fontSize:18}}>Which sports does betX cover?</Text>
                    <Text mt="2" style={{color: 'white'}}>betX covers a wide range of popular sports, including football (soccer), basketball, tennis, baseball, American football, cricket, ice hockey, and more. The platform continually expands its coverage based on user demand.</Text>
                </View>
            </View>
            :null}
            <TouchableOpacity onPress={() => { Linking.openURL('mailto:support@betxapp.in')}}>
                <View ml="12" mr="12" mt="5"  pb="5" borderBottomWidth="2" borderColor="#222232">
                        <Text style={{color: 'white'}}>Email </Text>
                        <Text style={{color: 'white'}}>support@betxapp.in</Text>
                </View>
            </TouchableOpacity>
            {/* <View ml="12" mr="12" mt="5"  pb="5" borderBottomWidth="2" borderColor="#222232">
                    <Text style={{color: 'white'}}>Contact</Text>
                    <Text style={{color: 'white'}}>+91 0123456789</Text>
            </View>
            <TouchableOpacity onPress={() => { Linking.openURL('https://goo.gl/maps/H2Ar8PAZSzzSgz1h6')}}>
                <View ml="12" mr="12" mt="5"  pb="5" mb="5" borderBottomWidth="2" borderColor="#222232">
                        <Text style={{color: 'white'}}>Address </Text>
                        <Text style={{color: 'white'}}>Pune, Maharashtra </Text>
                </View>
            </TouchableOpacity> */}
        </ScrollView>    
    );
}

export default ProfileScreenSupport;
// import {View, TouchableOpacity, Text} from 'react-native'
// // import { useState } from 'react';
import React, { useRef } from 'react';
import { Button, TouchableOpacity, View, Text, Image , StyleSheet, Pressable, ScrollView} from 'react-native';
import{ArrowLeft} from '../assets/icons';
import { WebView } from 'react-native-webview';
import YouTubeIframe from 'react-native-youtube-iframe';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GoogleInterstitialAd from '../Components/GoogleAdds/GoogleAdBanner';
function getYouTubeVideoId(url) {
  const regExp = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
  const match = url.match(regExp);
  

  if (match && match[1]) {
    return match[1];
  }

  return null;
}

const VideoAd=(props)=>{

const adRef = useRef(null);

const videoLink="https://www.youtube.com/watch?v=kEXBhyUoai8";

const videoId = getYouTubeVideoId(videoLink);
const youtubePlayerRef = useRef(null);

const handlePlay = () => {
  youtubePlayerRef.current?.play(); // Start playing the video
};

const handlePause = () => {
  youtubePlayerRef.current?.pause(); // Pause the video
};

const insets = useSafeAreaInsets();

    return (
      <ScrollView style={{flex: 1, backgroundColor: '#000000', paddingTop: insets.top, paddingBottom: insets.bottom}}>
        <GoogleInterstitialAd ref={adRef} />
        <View style={{flex: 1, paddingBottom: 20, backgroundColor: '#000000'}}>
          {/* <Text>hello </Text> */}
          <View style={{flexDirection: 'row', marginLeft: 28, marginRight: 28}}>
            <ArrowLeft
              style={{marginTop: 30}}
              onPress={() => props.navigation.goBack()}
            />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#ffff',
                  marginTop: 30,
                  fontSize: 20,
                  fontFamily: 'SourceSansPro',
                  marginLeft: '25%',
                }}>
                {' '}
                How to place a bet{' '}
              </Text>
              {/* <Pressable onPress={() => props.navigation.navigate('VideoAd')}>
                  <Text style={{ color: '#ffff', fontSize: 23, marginLeft: 10, marginTop:30, marginLeft:"37%"}}>ⓘ</Text>
                 </Pressable> */}
            </View>
          </View>

          <View style={styles.container}>
            {/* <YouTubeIframe
              ref={youtubePlayerRef}
              videoId={videoId}
              webViewStyle={styles.webView}
              volume={100}
              height={270} // Adjust the height as needed
            /> */}
          </View>
          <View
            style={{
              padding: 18,
              justifyContent: 'center',
              alignContent: 'center'
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                fontFamily: 'SourceSansPro',
              }}>
              Please note that EdgePX is not a bookmaker and does not accept bets
              on sports events. Instead, our platform empowers you to make
              informed decisions for your bets.
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                fontFamily: 'SourceSansPro',
                marginTop: 8,
              }}>
              To get started with betting on our predictions, follow these
              simple steps:{' '}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                margin: 5,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontFamily: 'SourceSansPro',
                }}>
                1.{' '}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontFamily: 'SourceSansPro',
                }}>
                Sign up for an account with any bookmaker of your choice. Once
                registered, proceed to add a payment method to fund your betting
                account.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                margin: 5,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontFamily: 'SourceSansPro',
                }}>
                2.{' '}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontFamily: 'SourceSansPro',
                }}>
                On the bookmaker's website, search for the event mentioned in
                our prediction. Each prediction includes the names of the teams,
                the sport, and the league to help you find the right event
                easily.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                margin: 5,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontFamily: 'SourceSansPro',
                }}>
                3.{' '}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontFamily: 'SourceSansPro',
                }}>
                Place your bet on the chosen event. You have the freedom to
                decide the bet amount according to your preferences. However, we
                strongly recommend betting responsibly and not wagering your
                entire bank amount at once.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                margin: 5,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontFamily: 'SourceSansPro',
                }}>
                4.{' '}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontFamily: 'SourceSansPro',
                }}>
                If your bet is successful, you have the option to withdraw your
                winnings to your payment card or keep them in your betting
                account for future bets. Please be aware that bookmakers may
                have rules and limitations regarding deposits and withdrawals.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                margin: 5,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontFamily: 'SourceSansPro',
                }}>
                5.{' '}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontFamily: 'SourceSansPro',
                }}>
                Remember, sports prediction and betting should be an enjoyable
                experience, and EdgePX is here to provide informed insights to
                enhance your betting strategy. Always gamble responsibly and
                make informed decisions.
              </Text>
            </View>
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                fontFamily: 'SourceSansPro',
              }}>
              At EdgePX, we value responsible gambling and want our users to enjoy
              their betting experience. Should you have any questions or need
              assistance, feel free to reach out to us at help@edgepx.com
            </Text>
          </View>
        </View>
      </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
      marginTop:20,
    },
    webView: {
        alignSelf: 'stretch',
    },
  });

export default VideoAd;


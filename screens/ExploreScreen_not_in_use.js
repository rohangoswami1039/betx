import React,{useState}from 'react';
import {View,Text,StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import LoadingModal from './LoadingModal.js'
function ExploreScreenCopy(props) {
  const [showLoadingModal, setShowLoadingModal] = useState(false);
    return (
        <>
        <LoadingModal show={showLoadingModal}/>
        <WebView source={{ uri: 'http://blog.betxapp.in/' }} 
        onLoadStart={() => setShowLoadingModal(true)}
        onLoadEnd={() => setShowLoadingModal(false)}
        />
    
      </>
    );
}

export default ExploreScreenCopy;

const styles = StyleSheet.create({
   
  });
import React,{useState,useEffect} from 'react';
import { Text,StyleSheet, View,Modal,Animated,Easing} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  HStack,
  Spinner,
  Heading,
  Button,
  Handball,
} from 'native-base';
import{Loader
} from '../assets/icons'

export default function LoadingModal(props) {
    const [showLoadingModal, setShowLoadingModal] = useState(props.show);
    const spinValue = new Animated.Value(0);
    
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin());
    };

    useEffect(() => {
      spin();
      setShowLoadingModal(props.show);
    }, [props.show,spin])

    const rotate = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return (
      <>
      <Modal
        // animationType="slide"
        transparent={true}
        visible={showLoadingModal}
        onRequestClose={() => {
          // console.log('Modal will not close')
        }}
      >
        <View style={styles.container}>
          <Animated.View style={{transform: [{rotate}]}}>
            <Loader /> 
          </Animated.View>
        </View>
        </Modal>
        
       </>   
    );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
});
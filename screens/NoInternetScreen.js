import React, { useState } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NetInfo from "@react-native-community/netinfo";
import {
    NoInternet,
} from '../assets/icons';

import {
    CustomeAlert
} from '../Components';


function NoInternetScreen({ props, navigation }) {
    const [alertVisible, setAlertVisible] = useState(false);

    function checkInternet() {
        console.log('Checking Internet');
        NetInfo.addEventListener(networkState => {
            if (networkState.isConnected) {
                //   console.log("internet donnection connected");
                //redirect to login if internet is available
                navigation.navigate("Login");
            } else {
                // console.log('internet donnection dissssconnected')
                setAlertVisible(true)
            }
        });
    }

    return (
        <>
            <CustomeAlert visible={alertVisible} setAlertVisible={setAlertVisible} title={'No Internet connection'} description={'Please check internet connection'} />
            <View style={{ backgroundColor: '#181829', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <NoInternet />
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: "bold", marginTop: 50 }}>OOPS!</Text>
                    <Text style={{ color: '#FFFFFF' }}>{`No internet connection found`}</Text>
                    <Text style={{ color: 'white' }}>{`Check your connection`}</Text>


                    <TouchableOpacity onPress={() => { checkInternet() }} style={{ marginTop: 50, borderRadius: 50, width: 30 }}>
                        <LinearGradient alignSelf="center" style={styles.colorButton} colors={['#ED6B4E', '#F4A58A']} start={{ x: 0.2, y: 2.7 }} end={{ x: 0.0, y: 0.0 }} >
                            <Text style={styles.signOutButton} >Try Again</Text>
                        </LinearGradient>
                    </TouchableOpacity>




                </View>
            </View>


        </>
    );
}

export default NoInternetScreen;
const styles = StyleSheet.create({

    signOutButton: {
        fontSize: 20,
        // fontweight:'bold',
        width: 300,
        padding: 10,
        height: 50,
        color: 'white',
        textAlignVertical: 'center',
        textAlign: 'center',

    },
    colorButton: {
        borderRadius: 10,

    }
})
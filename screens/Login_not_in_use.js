

import React, { useState,useEffect } from 'react';
import {  TextInput,Text,View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button,  Box, useDisclose,Center,Actionsheet } from 'native-base';



function Login(props) {
    
        // If null, no SMS has been sent
        const [confirm, setConfirm] = useState(null);

        const [code, setCode] = useState('');
        const [user, setUser] = useState();

        //For Action sheet
        const {
          isOpen,
          onOpen,
          onClose
        } = useDisclose();

        useEffect( () => {
            auth().onAuthStateChanged( (user) => {
                if (user) {
                    console.log("logged in user"+user);
                    setUser(user);
                    // Obviously, you can add more statements here, 
                    //       e.g. call an action creator if you use Redux. 
        
                    // navigate the user away from the login screens: 
                    //props.navigation.navigate("PermissionsScreen");
                } 
                else 
                {
                    console.log("Not logged in");
                    // reset state if you need to  
                   // dispatch({ type: "reset_user" });
                }
            });
        }, []); 

        // Handle the button press
        async function signInWithPhoneNumber(phoneNo) {
            
            try {
              const confirmation = await auth().signInWithPhoneNumber(phoneNo);
              setConfirm(confirmation);
            } catch (err) {
              
              console.log(err.message);
            }
          }
        
          async function confirmCode() {
            try {
              
              await confirm.confirm(code);
              
            } catch (err) {
              
              console.log(err.message);
            }
          }

          async function signOut(){
              try {
                  console.log("Signing out");
                auth().signOut();
                console.log("Signing out after a successful");
              } catch (error) {
                  console.log(error.message);
              }
          }

     if (!user) {
        if (!confirm) {
            return (
            
            <Button
                onPress={() => signInWithPhoneNumber('+918169842392')}
            >Phone Number Sign In</Button> 
            
            );
        }

        return (
            <>
              <TextInput value={code} onChangeText={text => setCode(text)} />
              <Button  onPress={() => confirmCode()} >Confirm Code</Button>
            </>
        );
        }
        else{
            return (
                <SafeAreaView>
                    <Text>
                      Welcome! {user.phoneNumber} 
                    </Text>
                    <Button  onPress={() => signOut()}>Sign out</Button>

                    <Center>
                      <Button onPress={onOpen}>Actionsheet</Button>
                      <Actionsheet isOpen={isOpen} onClose={onClose}>
                        <Actionsheet.Content>
                          <Box w="100%" h={60} px={4} justifyContent="center">
                            <Text fontSize="16" color="gray.500" _dark={{
                            color: "gray.300"
                          }}>
                              Albums
                            </Text>
                          </Box>
                          <Actionsheet.Item>Delete</Actionsheet.Item>
                          <Actionsheet.Item>Share</Actionsheet.Item>
                          <Actionsheet.Item>Play</Actionsheet.Item>
                          <Actionsheet.Item>Favourite</Actionsheet.Item>
                          <Actionsheet.Item>Cancel</Actionsheet.Item>
                        </Actionsheet.Content>
                      </Actionsheet>
                    </Center>

                </SafeAreaView>    
              );
        }
}

export default Login;
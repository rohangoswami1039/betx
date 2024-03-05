import React, { useState, useEffect } from 'react';
import {  TextInput,StyleSheet, } from 'react-native';
import auth from '@react-native-firebase/auth';
import OTPTextView from 'react-native-otp-textinput';
import { Button, 
  Text, 
  Box, 
  useDisclose,
  Center,
  Actionsheet,
  Input,
  Stack,
  Icon,
  TouchableOpacity,
  HStack,
  Spinner,
  Heading,Modal,
  View,
  Flex,
  Pressable,
  useToast,  
} from 'native-base';
  
  import{
    HomeIcon,
    ExploreIcon,
    StandingsIcon,
    ProfileIcon
  } from '../assets/icons';

  import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {ServerContainer} from '@react-navigation/native';

import CountryPicker from 'react-native-country-picker-modal'



export default function LoginScreen(props) {

  //For Action sheet
 

  const [isPhoneNumModelOpen, setPhoneNumModel] = useState(false);
  const [isVerifCodeModelOpen, setVerifCodeModel] = useState(false);

  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const [confirm, setConfirm] = useState(null);
  const [phonenumber, setPhonenumber] = useState();
  const [otpCode, setOTPCode] = useState();

  //Country code
  const [countryCode, setCountryCode] = useState('IN')
  const [callingCode,setCallingCode] = useState('91')
  const [country, setCountry] = useState(null)
  const [visible, setVisible] = useState(false);

  const [user, setUser] = useState();

  //for show toast
  const toast = useToast();


  
 

  useEffect(() => { 
    auth().onAuthStateChanged( (user) => {
      if (user) {
          console.log("logged in user"+user);
          setUser(user);
          // Obviously, you can add more statements here, 
          //       e.g. call an action creator if you use Redux. 

          // navigate the user away from the login screens: 
          props.navigation.navigate("MainHome");
      } 
      else 
      {
          console.log("Not logged in");
          // reset state if you need to  
         // dispatch({ type: "reset_user" });
         props.navigation.navigate("Login");
      }
  });

  //Timer
 

  },[user]);

  async function signInWithPhoneNumber() {
            
    try {
      
      setShowLoadingModal(true)
      console.log('+'+callingCode+phonenumber)
      const confirmation = await auth().signInWithPhoneNumber('+'+callingCode+phonenumber);  
      setShowLoadingModal(false)    
      setVerifCodeModel(true)
      setConfirm(confirmation);
      
    } catch (err) {
      setShowLoadingModal(false)  
      toast.show({
        description: "Error in sign in  with phone number +"+callingCode+phonenumber
      })
      console.log(err.message);
    }
  }
  async function confirmCode() {
    try {
      
      await confirm.confirm(otpCode);
      
    } catch (err) {
      toast.show({
        description: "Error verifying code"
      })
      console.log("otp = "+otpCode + err.message);
    }
  }
  
    return (
      <Center>

    <Input w={{ base: "75%", md: "25%" }} InputLeftElement={
     <Pressable  onPress={() =>{console.log("Confirm Code");setVisible(true)}}>
      
    </Pressable>
    } placeholder="Country code"
    
    />
    
    
     


      <Button onPress={() => setShowLoadingModal(true)}>Show loading</Button>
      <Modal isOpen={showLoadingModal} >
        <Modal.Content maxWidth="400px">
          <Modal.Body >
          <HStack space={2} justifyContent="center">
            <Spinner accessibilityLabel="Loading posts" />
            <Heading color="primary.500" fontSize="md">
              Loading
              <Button onPress={() => setShowLoadingModal(false)}>Hide loading</Button>
            </Heading>
          </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>

        
        
       <MaterialIcon name="email" size={30} color="#900" />
     
       <Input w={{
      base: "75%",
      md: "25%"
    }} InputLeftElement={<MaterialIcon name="email" size={25} color="#900" />} placeholder="Name" />
    <Input w={{
      base: "75%",
      md: "25%"
    }} InputLeftElement={<Icon as={<HomeIcon/>} size={5} ml="2" color="muted.400" />} placeholder="Name" />
    





    {/* Action sheet for pfone number */}
    <Button onPress={() => {setPhoneNumModel(true)}}>Phone Number </Button>
      <Actionsheet isOpen={isPhoneNumModelOpen}  >
        <Actionsheet.Content bg={styles.ActionSheet.bgColor}>
        <Button onPress={() => {setPhoneNumModel(false)}}>Close </Button>
          <Box w="100%" h={60} px={4} justifyContent="center">
              <Text fontSize="25" color={styles.ActionSheet.HeadingColor}>
              Sign in
              </Text>
          </Box>
          <Input  placeholder="Mobile Number" w="95%" onChangeText={(number)=> setPhonenumber(number)}   bg={styles.ActionSheet.InputBackgroundColor} 
          borderWidth="0" 
          height="16"
          borderRadius="15"
          keyboardType="numeric"
          size="2xl"
          maxLength={10}
          style={{color:"white"}}
             InputLeftElement={
              <Pressable  onPress={() =>{setVisible(true)}}  >
               <Flex direction="row" mx="5">
                 <CountryPicker
                   {...{
                     countryCode,
                   }}
                   
                   onSelect={cont => {
                   console.log('onSelect: ',cont);
                   const{cca2,callingCode} = cont;
                   setCountryCode(cca2);
                   setCallingCode(callingCode);
                 }}
                 />
                 <Text style={{color:"white"}} fontSize="17" >+{callingCode}</Text>
               </Flex>
             </Pressable>
             }
          />
         <Text style={{color:"white"}} mt="5">You will receive an SMS verification that may apply message and data rates.</Text>
          <Button  w="95%" mt="5" borderRadius="20"  height="16" onPress={()=>{setPhoneNumModel(false); signInWithPhoneNumber();}}><Text fontSize="2xl" style={{color:"white"}}>Sign in</Text></Button>
         
        </Actionsheet.Content>
      </Actionsheet>

    {/* Action sheet for OTP */}
      <Button onPress={() => {setVerifCodeModel(true)}}>Code </Button>
      <Actionsheet isOpen={isVerifCodeModelOpen} >
        <Actionsheet.Content bg={styles.ActionSheet.bgColor}>
        <Button onPress={() => {setVerifCodeModel(false); console.log(setOTPCode);}}>Close </Button>
          <Box w="100%"  px={4} justifyContent="center">
              <Text fontSize="25" mt="2"color={styles.ActionSheet.HeadingColor}>
              OTP verify
              </Text>
              <Text fontSize="20" mt="5" color={styles.ActionSheet.HeadingColor}>
              Enter your OTP
              </Text>
          </Box>
          <Box mt="10">
            <OTPTextView
            // ref={(e) => ("d"+console.log(e))}
            // containerStyle={styles.textInputContainer}
            handleTextChange={(text) => setOTPCode(text)}
            inputCount={6}
            textInputStyle={styles.roundedTextInput}
            keyboardType="numeric"
            tintColor="#6B4EFF"
            />
            <Text style={{color:"#828284"}} mb="5">Enter the Otp That we have sent you via SMS</Text>
          </Box>
          
        <Button mb="5"  w="95%" marginTop="5" borderRadius="20"  height="16" onPress={()=>{ confirmCode();}}><Text fontSize="2xl" style={{color:"white"}}>Submit</Text></Button>
        <Pressable mb="5" p="1" onPress={()=>{ signInWithPhoneNumber()}}>
             <Text style={{color:"#828284"}}>Resend OTP</Text>
        </Pressable>
        </Actionsheet.Content>
      </Actionsheet>



     
      

      </Center>
    );
  
}

const styles = StyleSheet.create({
  ActionSheet:{
    bgColor : "#222232",
    HeadingColor : "#FFFFFF",
    InputBackgroundColor : "#181829",
  },
  roundedTextInput: {
    borderRadius: 100,
    borderWidth: 2,
    color: "#0E0F0F",
    backgroundColor: '#F5FCFF',
  }

})


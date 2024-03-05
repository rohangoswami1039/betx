import React,{useState,useEffect} from 'react';
import {View,Text,Modal,TouchableOpacity } from 'react-native';
function CustomeAlert(props) {
    
    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={props.visible}
                onRequestClose={() => {
                console.log('alert will not close')
                }}
            >
                <View style={{flex: 1,justifyContent: "center", alignItems: "center",}}>
                    <View style={{backgroundColor :'#F2F2F7',width:'80%',borderRadius:20}}>
                        <View style={{padding :20}}>
                            <Text style={{fontWeight: 'bold',color:'black'}}>{props.title}</Text>
                            <Text style={{color:'black'}}>{props.description}</Text>
                        </View>
                        <View style={{height: 0.5, backgroundColor: 'black',}} />
                        <View style={{alignItems: "center"}}>
                            <TouchableOpacity onPress={()=>{props.setAlertVisible(false)}} style={{width:'100%',alignItems: "center",padding:5}}>
                             <Text style={{color:'#0A7AFF',padding:5}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                        
                    
                    
                </View>
            </Modal>
        </View>
    );
}
CustomeAlert.defaultProps  = {
    title: 'Title',
    description: 'Description',
    visible:false
  };

export default CustomeAlert;
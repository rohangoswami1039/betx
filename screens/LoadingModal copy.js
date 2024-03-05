import React,{useState,useEffect} from 'react';
import { Text, View } from 'react-native';
import {Modal,
  HStack,
  Spinner,
  Heading,
  Button,

} from 'native-base';

export default function LoadingModal(props) {
    const [showLoadingModal, setShowLoadingModal] = useState(props.show);
    
    useEffect(() => {
      setShowLoadingModal(props.show);
    }, [props.show])

    return (
      <>
        <Modal isOpen={showLoadingModal} >
            <Modal.Content maxWidth="400px">
              <Modal.Body >
              <HStack space={2} justifyContent="center">
                <Spinner accessibilityLabel="Loading posts" />
                <Heading color="primary.500" fontSize="md">
                  Loading
                  {/* <Button onPress={() => setShowLoadingModal(false)}>Hide loading</Button> */}
                </Heading>
              </HStack>
              </Modal.Body>
            </Modal.Content>
          </Modal>
       </>   
    );
}

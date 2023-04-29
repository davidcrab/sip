import React, { useState } from 'react';
import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import AddProductForm from './AddProductForm';
import { useFirestore } from 'reactfire';
import { getFirestore, setDoc, collection, doc } from 'firebase/firestore';


const FloatingAddButton = ({ deckId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const addProductToFirestore = async (productData) => {
    try {
      const firestoreInstance = getFirestore();
      const productRef = doc(collection(firestoreInstance, 'showcaseProduct'));
      console.log("product data", productData);
      await setDoc(productRef, productData);
      console.log('Product added successfully');
    } catch (error) {
      console.error('Error adding product to Firestore:', error);
    }
  };
  

  const handleAdd = async (values) => {
    console.log('HELLO WORLD');
    setIsLoading(true);
    await addProductToFirestore(values);
    setIsLoading(false);
    onClose();
  };

  return (
    <>
      <Button
        aria-label="Add button"
        leftIcon={<AddIcon />}
        position="fixed"
        bottom="2rem"
        right="2rem"
        zIndex="99"
        onClick={onOpen}
      >Add Product</Button>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddProductForm
              deckId={deckId}
              onSubmit={values => {
                console.log('Form values:', values);
                handleAdd(values);
              }}
              onAdd={handleAdd}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FloatingAddButton;

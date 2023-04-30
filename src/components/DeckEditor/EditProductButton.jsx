// FloatingEditButton.js
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
  Box,
  Icon,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import EditProductForm from './EditProductForm';
import { useFirestore } from 'reactfire';
import {
  getFirestore,
  setDoc,
  collection,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';

const EditProductButton = ({ productId }) => {
  // ...useState and useDisclosure
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const updateProductInFirestore = async productData => {
    try {
      const firestoreInstance = getFirestore();
      const productRef = doc(
        collection(firestoreInstance, 'showcaseProduct'),
        productId
      );
      await updateDoc(productRef, productData);
      console.log('Product updated successfully');
    } catch (error) {
      console.error('Error updating product in Firestore:', error);
    }
  };

  const handleEdit = async values => {
    setIsLoading(true);
    await updateProductInFirestore(values);
    setIsLoading(false);
    onClose();
  };

  return (
    <>
      <Box
        aria-label="Add button"
        leftIcon={<EditIcon />}
        onClick={onOpen}
        w="full"
      >
        <Icon as={EditIcon} mr="2" />
        Edit Product
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditProductForm
              productId={productId}
              onSubmit={values => {
                console.log('Form values:', values);
                handleEdit(values);
              }}
              onEdit={handleEdit}
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

export default EditProductButton;

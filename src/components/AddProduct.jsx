/*
Move this into here
*/
import React, { useState } from 'react'
import { 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  useDisclosure, 
  Center,
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack
} from '@chakra-ui/react'
import { getFirestore, doc, updateDoc } from "firebase/firestore";
// import { FirestoreProvider, useFirebaseApp } from "reactfire";

const AddProductModal = (deckId) => {
  // const firestoreInstance = getFirestore(useFirebaseApp());
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen}>Add Product</Button>
      <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddProduct deckId={deckId} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

// TODO: we hide the product id if its in the name. So we should create our own id for the product 
const AddProduct = ({ deckId }) => {
  const [product, setProduct] = useState({
    descriptions: "",
    id: "",
    image: "",
    name: "",
    notes: [""],
    pricing: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const db = getFirestore();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // generate a random id for the product
    product.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    console.log("deckid", deckId.deckId)
    console.log(product.id)
    const docRef = doc(db, 'decks', deckId.deckId);
    let field = "products." + product.id;
    updateDoc(docRef, {
      [field]: product
    }).then(() => {
      setLoading(false);
      setProduct({
        descriptions: "",
        id: "",
        image: "",
        name: "",
        notes: [""],
        pricing: ""
        // pricingTable: "",
      });
      // TODO: close the modal
      // refresh the page
      window.location.reload();
    }).catch((error) => {
      setError(error.message);
      setLoading(false);
    });
  };

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Center>
      <Box textAlign={"center"} align="center">
        <form onSubmit={handleSubmit}>
          <VStack>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={product.name} onChange={handleChange} />
            </FormControl>
            {/* <FormControl id="id" isRequired>
              <FormLabel>Product ID</FormLabel>
              <Input type="text" name="id" value={product.id} onChange={handleChange} />
            </FormControl> */}
            <FormControl id="image" isRequired>
              <FormLabel>Image URL</FormLabel>
              <Input type="text" name="image" value={product.image} onChange={handleChange} />
            </FormControl>
            <FormControl id="descriptions">
              <FormLabel>Descriptions (Each bullet point must start with a dash: -)</FormLabel>
              <Textarea type="text" name="descriptions" value={product.descriptions} onChange={handleChange} />
            </FormControl>
            <FormControl id="pricing">
              <FormLabel>Pricing (Each bullet point must start with a dash: -)</FormLabel>
              <Input type="text" name="pricing" value={product.pricing} onChange={handleChange} />
            </FormControl>
            {/* <FormControl id="pricingTable" isRequired>
              <FormLabel>Pricing Table</FormLabel>
              <Textarea type="text" name="pricingTable" value={product.pricingTable} onChange={handleChange} />
            </FormControl> */}
            {/* <FormControl id="notes" isRequired>
              <FormLabel>Notes</FormLabel>
              <Textarea type="text" name="notes" value={[product.notes]} onChange={handleChange} />
            </FormControl> */}
            <Button type="submit" colorScheme="blue" isLoading={loading}>Add Product</Button>
            {error && <p>{error}</p>}
          </VStack>
        </form>
      </Box>

    </Center>
  );
};

export default AddProductModal;
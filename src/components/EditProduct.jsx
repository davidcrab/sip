/*
TODO: Move the code into this file
this is going to be for the version 1.1 showcases
*/
import { 
  Image,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Center,
  Heading,
  UnorderedList,
  Button,
  Editable,
  EditablePreview,
  EditableInput,
  EditableTextarea,
  Tooltip,
  Text,
 } from '@chakra-ui/react';
import { useState } from 'react';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { doc, updateDoc, getFirestore  } from 'firebase/firestore';
import Mockup from '../Pages/ProductEditor'

const EditProduct = ({product, deckId, productId}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  // set a state for the product
  const [productName, setProductName] = useState(product.name)
  const [productDescription, setProductDescription] = useState(product.descriptions)
  const [productPricing, setProductPricing] = useState(product.pricing)
  const handleDescriptionChange = (event, index) => {
    console.log(event.target.value)
    console.log(index)
    const newDescription = [...productDescription]
    newDescription[index] = event.target.value
    setProductDescription(newDescription)
  }
  const handleChange = (event) => setProductName(event.target.value)
  const handlePricingChange = (event) => setProductPricing(event.target.value)

  async function save() {

    const db = getFirestore();
    const docRef = doc(db, "showcaseProduct", productId);
    await updateDoc(docRef, {
      "name": productName,
      "descriptions": productDescription,
      "pricing": productPricing,
    });
    onClose()
  }

  return (
    <>
    <Button onClick={onOpen} w="full">Edit</Button>
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Editable defaultValue={productName}>
            <EditablePreview />
            <EditableTextarea onChange={handleChange} />
          </Editable>  
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center>
            <Mockup src={product.image} deckId={deckId} productId={productId} 
              // if product.customImage is not null, use that, otherwise use product.image
              customImage={product.customImage ? product.customImage : ""}/>
          </Center>
            <Heading as="h2" size="lg">About</Heading>
            {/* map descriptions in eidtable text areas */}
            <UnorderedList>
              {product.descriptions.map((description, index) => (
                <Editable defaultValue={description} key={index}>
                  <EditablePreview />
                  <EditableTextarea onChange={(event) => handleDescriptionChange(event, index)} />
                </Editable>
              ))}
            </UnorderedList>
            <Heading as="h2" size="lg">Pricing</Heading>
            <Editable defaultValue={product.pricing} placeholder="Add your pricing seperated by '-'">
              <EditablePreview />
              <EditableTextarea onChange={handlePricingChange} />
            </Editable>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={save}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  );
}

export default EditProduct;
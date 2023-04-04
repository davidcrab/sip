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
 } from '@chakra-ui/react';

const EditProduct = ({product, deckId, productId}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  console.log(product)
  return (
    <>
    <Button onClick={onOpen} w="full">Edit</Button>

    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{product.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center>
            <Image src={product.image} />
          </Center>
            <Heading as="h2" size="lg">About</Heading>
            <UnorderedList>
            </UnorderedList>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  );
}

export default EditProduct;
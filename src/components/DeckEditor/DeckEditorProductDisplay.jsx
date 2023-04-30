import React from 'react';
import {
  Box,
  Button,
  Divider,
  HStack,
  Image,
  Spacer,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  UnorderedList,
  ListItem,
  VStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Center,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  ExternalLinkIcon,
  DeleteIcon,
} from '@chakra-ui/icons';
import EditProductButton from './EditProductButton';
import { useFirestore } from 'reactfire';
import {
  getFirestore,
  setDoc,
  collection,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import Mockup from '../../Pages/ProductEditor';

// TODO: Move this to a more appropriate place
const CustomizeProductImageModal = ({ product }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
        <Box onClick={onOpen} w="full" h="full">Personalize Product Image</Box>
        <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Upload, position, and resize a transparent logo</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Center>
            <Mockup src={product.image} deckId={product.deckId} productId={product.id} 
              // if product.customImage is not null, use that, otherwise use product.image
              customImage={product.customImage ? product.customImage : ""}/>
          </Center>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  }


const DeckEditorProductDisplay = ({ product }) => {
  let displayArray = [];
  for (let i = 0; i < product.images.length; i++) {
    if (
      product.images[i].includes('show/50') ||
      product.images[i].includes('show/100')
    ) {
    } else {
      displayArray.push(product.images[i]);
    }
  }

  /*
  Set the product's status to inactive
  */
  const handleDelete = async () => {
    try {
      const firestoreInstance = getFirestore();
      const productRef = doc(
        collection(firestoreInstance, 'showcaseProduct'),
        product.id
      );
      await updateDoc(productRef, { status: 'inactive' });
      console.log('Product updated successfully');
    } catch (error) {
      console.error('Error updating product in Firestore:', error);
    }
  };

  return (
    <Box
      w="85%"
      ml="8%"
      mr="8%"
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      mb="20"
    >
      <Flex justifyContent="space-between">
        <Box>
          <Heading size="lg">{product.name}</Heading>
        </Box>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Actions
          </MenuButton>
          <MenuList>
            <MenuItem minH="48px">
              <EditProductButton productId={product.id} />
            </MenuItem>
            <MenuItem minH="48px"><CustomizeProductImageModal product={product}/></MenuItem>
            <MenuItem
              icon={<DeleteIcon boxSize={4} />}
              onClick={handleDelete}
              minH="48px"
            >
              Delete
            </MenuItem>
            <MenuItem
              icon={<ExternalLinkIcon boxSize={4} />}
              as="a"
              href={product.url}
              target="_blank"
              minH="48px"
            >
              View on Supplier Website
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Divider mt="4" mb="4" />
      <HStack spacing="24px">
        <Image
          h="300px"
          src={product.customImage ? product.customImage : product.image}
          rounded="2xl"
        />
        <Flex w="full" justifyContent="space-evenly">
          <VStack>
            <Heading size="md">Description</Heading>
            <UnorderedList pl="10px">
              {product.descriptions && product.descriptions.map(description => {
                return (
                  <div>
                    <ListItem>{description}</ListItem>
                  </div>
                );
              })}
            </UnorderedList>
          </VStack>
          <VStack>
            <Heading size="md">Pricing</Heading>
            <UnorderedList pl="10px">
              {product.pricing && Array.isArray(product.pricing) &&
                product.pricing.map(price => {
                  return (
                    <div>
                      <ListItem>{price}</ListItem>
                    </div>
                  );
                })}
            </UnorderedList>
          </VStack>
        </Flex>
        {/* Map the product details and notes in a way that sets them apart from the rest of the product details */}
        {/* map the images array and display each image */}
      </HStack>
      <Divider />
      <Box m="4" p="8" bg="gray.100" rounded={'md'}>
        <Heading size="md">Details</Heading>
        {product.details && product.details &&
          product.details.map((detail, index) => {
            return (
              <Box key={index} textAlign="left">
                {detail}
              </Box>
            );
          })}
        <Heading size="md">Notes</Heading>
        {product.notes && product.notes &&
          product.notes.map((note, index) => {
            return (
              <Box key={index} textAlign="left">
                {note}
              </Box>
            );
          })}
        <Heading size="md">Supplier Pricing</Heading>
        {product.pricingTable && product.pricingTable && (
          <div>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: product.pricingTable }}
            ></div>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default DeckEditorProductDisplay;

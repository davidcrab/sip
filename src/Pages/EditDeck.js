import {
  Heading,
  ChakraProvider,
  theme,
  Box,
  Card,
  CardHeader,
  HStack,
  Grid,
  GridItem,
  Image,
  CardFooter,
  CardBody,
  Text,
  UnorderedList,
  ListItem,
  useEditableControls,
  ButtonGroup,
  IconButton,
  Editable,
  Tooltip,
  EditablePreview,
  Input,
  EditableInput,
  useColorModeValue,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  EditableTextarea,
  VStack,
  Spacer,
  Button,
  Link
} from "@chakra-ui/react"
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { FirestoreProvider, useFirebaseApp, useFirestore, useFirestoreDocData } from "reactfire";
import { useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {CheckIcon, CloseIcon, ExternalLinkIcon} from '@chakra-ui/icons'
import { Field } from "formik";

/*
 
for this to work i need the 
deck id 
product index
for top level fields i need the field name and the value
for nest fields, i need the field name, the nest index, and the nest field and the nest value
- see the example below 
 "products.0.pricing.0.price": "100,000"

 name = field

*/



async function UpdateDoc(field, value, productId) {
  /*
  if the field is 
  */
  console.log(productId)
  const db = getFirestore();
  const docRef = doc(db, "decks", "updated pricing");
  await updateDoc(docRef, {
    [field]: value
  });
  // update this to map in the field so like 
  // let test = "products." + productId + ".name"
  // // console.log(test)
  // await updateDoc(docRef, {
  //   [test]: value,
  //   "products.0.pricing.0.price": "100,000"
  // });
}

async function UpdatePricing() {

}

const EditField = ({ field, value, productIndex }) => {
  /*
    Update the document with the new value
    
  */

    // To update age and favorite color:
    /*
    await updateDoc(frankDocRef, {
      "age": 13,
      "favorites.color": "Red"
    });
    */

  const testChange = (event) => {
    if (productIndex || productIndex === 0) {
      console.log(productIndex)
      UpdateDoc(field, event, productIndex)
    } else {
      console.log(field)
      console.log("prod id", productIndex)
      UpdateDoc(field, event)
    }
  }

  /* Here's a custom control */
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps
    } = useEditableControls();
    return isEditing ? (
      <ButtonGroup justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
        <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
        <IconButton
          icon={<CloseIcon boxSize={3} />}
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : null;
  }

  let fontSize = 'md'
  let fontWeight = 'normal'

  if (field === 'name') {
    fontSize = '3xl'
    fontWeight = 'bold'
  } else if (field === 'title') {
    fontSize = '5xl'
    fontWeight = 'bold'
  }

  return (
      <Editable
        defaultValue={value}
        isPreviewFocusable={true}
        selectAllOnFocus={false}
        onSubmit={testChange}
        fontSize={fontSize}
        fontWeight={fontWeight}
      >
        <Tooltip label="Click to edit">
          <EditablePreview
            py={2}
            px={4}
            _hover={{
              background: useColorModeValue("gray.100", "gray.700")
            }}
          />
        </Tooltip>
        <Input py={2} px={4} as={EditableInput} size='lg'/>
        <EditableControls />
      </Editable>
  );
}

const EditProduct = ({ product, productIndex }) => {

  console.log("key", productIndex)

  return (
    <Card size="lg" minHeight="200px" m="10">
      <CardHeader>
          <EditField field="name" value={product.name} productIndex={productIndex}/>
      </CardHeader>
      <CardBody minHeight="200px" pt="0">
      <Grid templateColumns='repeat(3, 1fr)' gap={6} align="center" justify="center">
            <GridItem w='100%' h='10' >
              <Image src={product.image} />
            </GridItem>
            <GridItem w='100%' h='10'>
              <Heading size={"sm"}>Description</Heading>
              <UnorderedList textAlign={"left"} spacing={1}>
                {product.descriptions.map(description => (
                  // <ListItem>{description}</ListItem>
                  // <ListItem><EditField field="description" value={description}></EditField></ListItem>
                  <ListItem>
                    <Editable defaultValue={description}>
                      <EditablePreview />
                      <EditableTextarea/>
                    </Editable>
                  </ListItem>
                ))}
              </UnorderedList>
            </GridItem>
            <GridItem w='60%' h='10'>
              <Heading size={"sm"}>Price</Heading>
              <TableContainer>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>Quantity</Th>
                    <Th isNumeric>Price</Th>
                  </Tr>
                </Thead>
                <Tbody>
                {Object.values(product.pricing).map((price, index) => (
                  <Tr>
                    <Td><EditField field="price" value={price.quantity} productId={productIndex} priceId={index}/></Td>
                    <Td isNumeric>{price.price}</Td>
                  </Tr>
                ))}
                  {/* {product.price.map(price => (
                  <Tr>
                    <Td><EditField field="price" value={price.quantity}/></Td>
                    <Td isNumeric>{price.price}</Td>
                  </Tr>
                  ))} */}
                </Tbody>
              </Table>
            </TableContainer>
            </GridItem>
          </Grid>
      </CardBody>
      <CardFooter>

      </CardFooter>
    </Card>
  )

}



const Deck = () => {
  const { id: deckId } = useParams();

  // easily access the Firestore library
  const deckRef = doc(useFirestore(), 'decks', deckId);

  // subscribe to a document for realtime updates. just one line!
  const { status, data: deck } = useFirestoreDocData(deckRef);

  // easily check the loading status
  if (status === 'loading') {
    return <p>Fetching deck...</p>;
  }

  return (
    <Box>
      <EditField field="name" value={deck.name} />
      <Link m="5" target="_blank" href={"/view/" + deckId}>
          <Button colorScheme='gray'>View <ExternalLinkIcon mx='2px'/></Button>
      </Link>
      {Object.values(deck.products).map((productMap, index) => (
        <EditProduct product={productMap} productIndex={index} />
      ))}
      {/* {deck.products.map( (product, index) => (
        <EditProduct product={product} key={index}/>
      ))} */}
    </Box>
  )
}


const EditDeck = () => {
  const firestoreInstance = getFirestore(useFirebaseApp());
  const navigate = useNavigate();
  const onClick = () => {
    navigate('/demo')
  }




  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <ChakraProvider theme={theme}>
        <HStack m="5">
          <Text>Edit Deck Page</Text>
          <Spacer />
          <Button onClick={onClick}>My Decks</Button>
        </HStack>
        <Deck />
      </ChakraProvider>
    </FirestoreProvider>
  )
}

export default EditDeck;
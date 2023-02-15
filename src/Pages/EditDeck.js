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
  Link,
  Divider,
  TableCaption
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

const AddPricing = ({ pricing, productIndex, deckId }) => {
  const db = getFirestore();
  const docRef = doc(db, "decks", deckId);

  const ChangePrice = async (event, priceIndex) => {
    console.log(event)
    let field = "products." + productIndex + ".pricing." + priceIndex + ".price"
    await updateDoc(docRef, {
      [field]: event
    });
  }

  const ChangeQuantity = async (event, priceIndex) => {
    console.log(event)
    let field = "products." + productIndex + ".pricing." + priceIndex + ".quantity"
    await updateDoc(docRef, {
      [field]: event
    });
  }

  return (
    <Box>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Quantity</Th>
              <Th>Price</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.values(pricing).map((price, index) => {
              return (
                <Tr>
                  <Td>
                    <Editable defaultValue={price.quantity} onSubmit={(event) => ChangeQuantity(event, index)}>
                      <EditablePreview />
                      <EditableInput />
                    </Editable></Td>
                  <Td>
                    <Editable defaultValue={price.price} onSubmit={(event) => ChangePrice(event, index)}>
                      <EditablePreview />
                      <EditableInput />
                    </Editable>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )

}


async function UpdateName(field, value, deckId) {
  /*
  if the field is 
  */
  console.log(deckId)
  const db = getFirestore();
  const docRef = doc(db, "decks", deckId);
  await updateDoc(docRef, {
    [field]: value
  });
}

async function UpdateProductName(field, value, deckId, productIndex) {
  const db = getFirestore();
  const docRef = doc(db, "decks", deckId);
  // update this to map in the field so like 
  let test = "products." + productIndex + ".name"
  await updateDoc(docRef, {
    [test]: value,
  });
}

const EditField = ({ field, value, productIndex, deckId }) => {
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
  console.log()
  const testChange = (event) => {
    if (productIndex || productIndex === 0) {
      console.log(productIndex)
      UpdateProductName(field, event, deckId, productIndex)
    } else {
      console.log(field)
      console.log("prod id", productIndex, deckId)
      UpdateName(field, event, deckId)
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

const EditProduct = ({ product, productIndex, deckId }) => {

  console.log("key", productIndex)

  return (
    <Card size="lg" minHeight="200px" m="10">
      <CardHeader>
          <EditField field="name" value={product.name} productIndex={productIndex} deckId={deckId}/>
      </CardHeader>
      <CardBody minHeight="200px" pt="0">
        <VStack>
          <HStack>
            <Image src={product.image} />
            <Spacer />
            <VStack>
              <Heading size={"sm"}>Description</Heading>
              <UnorderedList textAlign={"left"} spacing={1}>
                {product.descriptions.map(description => (
                  <ListItem>
                    <Editable defaultValue={description}>
                      <EditablePreview />
                      <EditableTextarea/>
                    </Editable>
                  </ListItem>
                ))}
              </UnorderedList>
            </VStack>
            <Spacer />
            <VStack>
              <Heading size="sm">Vendor Lowest Price: {product.lowest_price}</Heading>
              <AddPricing pricing={product.pricing} productIndex={productIndex} deckId={deckId}/>
            </VStack>
          </HStack>
        </VStack>
      </CardBody>
      <CardFooter mt="10">
      <Spacer />
        <VStack textAlign={"start"}>
        <Divider w="full" />
          <Heading size={"sm"}>Notes</Heading>
          {product.product_notes.map(note => (
            <Text w="full">{note}</Text>
          ))}
        </VStack>
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
      <EditField field="name" value={deck.name} deckId={deckId}/>
      <Link m="5" target="_blank" href={"/view/" + deckId}>
          <Button colorScheme='gray'>View <ExternalLinkIcon mx='2px'/></Button>
      </Link>
      {Object.values(deck.products).map((productMap, index) => (
        <EditProduct product={productMap} productIndex={index} deckId={deckId}/>
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
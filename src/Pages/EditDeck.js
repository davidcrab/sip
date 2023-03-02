import {
  Heading,
  ChakraProvider,
  theme,
  Box,
  Card,
  CardHeader,
  HStack,
  Image,
  CardFooter,
  CardBody,
  Text,
  useEditableControls,
  ButtonGroup,
  IconButton,
  Editable,
  Tooltip,
  EditablePreview,
  Input,
  EditableInput,
  useColorModeValue,
  EditableTextarea,
  VStack,
  Spacer,
  Button,
  Link,
  Divider,
  Textarea,
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumb
} from "@chakra-ui/react"
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { FirestoreProvider, useFirebaseApp, useFirestore, useFirestoreDocData } from "reactfire";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import {CheckIcon, CloseIcon, ExternalLinkIcon} from '@chakra-ui/icons'
import { Field } from "formik";
import trackPathForAnalytics from '../TrackPathForAnalytics';

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
  let test = "products." + productIndex + "." + field
  console.log(test)
  await updateDoc(docRef, {
    [test]: value,
  });
}

const EditField = ({ field, value, productIndex, deckId }) => {

  console.log()
  const testChange = (event) => {
    if (productIndex || productIndex === 0) {
      console.log(productIndex)
      console.log("field", field)
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
            py={10}
            px={20}
            _hover={{
              background: useColorModeValue("gray.100", "gray.700")
            }}
          />
        </Tooltip>
        <Textarea py={2} px={4} as={EditableTextarea} size='lg'/>
        <EditableControls />
      </Editable>
  );
}

const EditProduct = ({ product, productIndex, deckId }) => {

  console.log("key", productIndex)
  console.log("product id", product.id)

  // if the product id is in the product name string, remove it
  if (product.name.includes(product.id)) {
    product.name = product.name.replace(product.id, "")
  }


  return (
    <Card size="lg" minHeight="200px" m="10">
      <CardHeader>
          <EditField field="name" value={product.name} productIndex={product.id} deckId={deckId}/>
      </CardHeader>
      <CardBody minHeight="200px" pt="0">
        <VStack>
          <VStack>
            <Image src={product.image} />
            <Spacer />
            <VStack>
              <Heading size={"sm"}>Description</Heading>
              <EditField field="descriptions" value={product.descriptions} productIndex={product.id} deckId={deckId}/>
            </VStack>
            <Spacer />
            <VStack>
              <Heading size="sm">Price</Heading>
              <EditField field="pricing" value={product.pricing} productIndex={product.id} deckId={deckId}/>
            </VStack>
          </VStack>
        </VStack>
      </CardBody>
      <CardFooter mt="10">
      <Spacer />
        <VStack textAlign={"start"}>
        <Divider w="full" />
          <Heading size={"sm"}>Notes</Heading>
          {product.notes.map(note => (
            <Text w="full">{note}</Text>
          ))}
        </VStack>
      </CardFooter>
    </Card>
  )

}

const Deck = () => {
  const { id: deckId } = useParams();
  // add firestore

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const db = getFirestore();

  useEffect(() => {
    const docRef = doc(db, 'decks', deckId);
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        setData(doc.data());
      } else {
        setError('Document not found');
      }
      setLoading(false);
    }).catch((error) => {
      setError(error.message);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>Error: {error}</p>;
  } else {
    const deck = data;
    return (
      <Box>
        <HStack m="5" mt={"0"}>
          <EditField field="name" value={deck.name} deckId={deckId}/>
          <Spacer />
          <Button onClick={() => window.location.reload()} colorScheme={"blue"}>Refresh Products</Button>
          <Link m="5" target="_blank" href={"/view/" + deckId}>
              <Button colorScheme='gray'>Preview<ExternalLinkIcon mx='2px'/></Button>
          </Link>
        </HStack>
        <Divider />
      {Object.values(deck.products).map((productMap, index) => (
        <EditProduct product={productMap} productIndex={productMap.id} deckId={deckId}/>
      ))}
      {/* {deck.products.map( (product, index) => (
        <EditProduct product={product} key={index}/>
      ))} */}
    </Box>
    );
  }
};

const EditDeck = () => {
  const firestoreInstance = getFirestore(useFirebaseApp());

  const navigate = useNavigate();
  const onClick = () => {
    navigate('/demo')
  }

  const { pathname, search } = useLocation();

  const analytics = useCallback(() => {
      trackPathForAnalytics({ path: pathname, search: search, title: pathname.split("/")[1] });
  }, [pathname, search]);

  useEffect(() => {
      analytics();
  }, [analytics]);


  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <ChakraProvider theme={theme}>
        <HStack m="5">
          <Breadcrumb ml="5">
            <BreadcrumbItem>
              <BreadcrumbLink onClick={onClick}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>Edit Deck
            </BreadcrumbItem>
          </Breadcrumb>
          <Text>Edit Deck Page</Text>
          <Spacer />
        </HStack>
        <Deck />
      </ChakraProvider>
    </FirestoreProvider>
  )
}

export default EditDeck;
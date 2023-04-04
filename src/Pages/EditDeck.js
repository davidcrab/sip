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
  Wrap,
  WrapItem,
  Textarea,
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumb,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
  AccordionButton,
  FormControl,
  FormLabel,
  Center
} from "@chakra-ui/react"
import { getFirestore, doc, updateDoc, getDoc, deleteField, query, collection, where } from "firebase/firestore";
import { FirestoreProvider, useFirebaseApp, useFirestore, useFirestoreCollectionData } from "reactfire";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import {CheckIcon, CloseIcon, ExternalLinkIcon} from '@chakra-ui/icons'
import trackPathForAnalytics from '../TrackPathForAnalytics';
import Mockup from "./ProductEditor";
import AddProductModal from "../components/AddProduct";
import EditContactCard from "../components/EditContactCard";
import EditProduct from "../components/EditProduct";
import PreviewProduct from "../components/PreviewProduct";

async function UpdateName(field, value, deckId) {
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
            py={5}
            px={10}
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

// this code should be removed and then we should say this deck is no longer editable...
const EditProductOld = ({ product, productIndex, deckId }) => {
  // if the product id is in the product name string, remove it
  if (product.name.includes(product.id)) {
    product.name = product.name.replace(product.id, "")
  }
  
  async function removeProduct() {
    const db = getFirestore();
    const docRef = doc(db, "decks", deckId);
    let productField = "products." + productIndex
    console.log(productField)
    await updateDoc(docRef, {
      [productField]: deleteField()
    });
    window.location.reload();
  }

  return (
    <Card size="lg" minHeight="200px" m="10">
      <CardHeader>
        <HStack>
          <VStack>
            <EditField field="name" value={product.name} productIndex={product.id} deckId={deckId}/>
            <Text>{product.id}</Text>
          </VStack>
          <Spacer />
          <strong>Sort #</strong>
          <EditField field="index" value={product.index} productIndex={product.id} deckId={deckId}/>
          <Button colorScheme={"red"} onClick={removeProduct}>Remove</Button>
        </HStack>
      </CardHeader>
      <CardBody minHeight="200px" pt="0">
        <VStack>
          <VStack>
            <Mockup src={product.image} deckId={deckId} productId={product.id} 
            // if product.customImage is not null, use that, otherwise use product.image
            customImage={product.customImage ? product.customImage : ""}/>
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
      <CardFooter>
        <VStack w="full">
          <Spacer />
          <div>
            <div className="content" dangerouslySetInnerHTML={{__html: product.pricingTable}}></div>
          </div>
          <Spacer />
            <VStack textAlign={"start"}>
              <Accordion allowMultiple w="full">
                <AccordionItem>
                  <h2>
                    <AccordionButton >
                      <Box as="span" textAlign='center'>
                        <Heading size={"lg"}>Notes</Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {product.notes.map(note => (
                      <Text w="full">{note}</Text>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>
        </VStack>
      </CardFooter>
    </Card>
  )
}

const Deck = () => {
  const { id: deckId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const db = getFirestore();

  let productsQuery = query(collection(useFirestore(), "showcaseProduct"), where("deckId", "==", deckId));
  const { status: productsStatus, data: products } = useFirestoreCollectionData(productsQuery, { idField: "fsId" })

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
    // sort the products based on their index. products is a map, so we need to convert it to an array first
    
    let productsArray = []
    if (products.length > 0) {
      console.log("within the if", products)
      productsArray = products
    } else {
      productsArray = Object.values(deck.products)
      productsArray.sort((a, b) => (a.index > b.index) ? 1 : -1)
    }

    return (
      <Box>
        <HStack m="5" mt={"0"}>
          <EditField field="name" value={deck.name} deckId={deckId}/>
          <Spacer />
          <AddProductModal deckId={deckId}/>
          <Button onClick={() => window.location.reload()} colorScheme={"blue"}>Refresh Products</Button>
          <Link m="5" target="_blank" href={"/view/" + deckId}>
              <Button colorScheme='gray'>Preview<ExternalLinkIcon mx='2px'/></Button>
          </Link>
        </HStack>
        <EditContactCard deckId={deckId} props={data.userId} personalNote={data.personalNote}/>
        <Spacer />
        <Wrap spacing="30px" justify="center" align="center" p="10">
          {productsArray.map((product, index) => (
            <>
            <WrapItem>
            {data.version === "1.1" ? <PreviewProduct product={product} deckId={deckId} productId={product.fsId} /> : <EditProductOld product={product} deckId={deckId} productIndex={index}/>}
            </WrapItem>
            </>
          ))}
        </Wrap>
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
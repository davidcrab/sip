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
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { FirestoreProvider, useFirebaseApp } from "reactfire";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import {CheckIcon, CloseIcon, ExternalLinkIcon} from '@chakra-ui/icons'
import trackPathForAnalytics from '../TrackPathForAnalytics';
import Mockup from "./ProductEditor";

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

const EditProduct = ({ product, productIndex, deckId }) => {
  // if the product id is in the product name string, remove it
  if (product.name.includes(product.id)) {
    product.name = product.name.replace(product.id, "")
  }
  return (
    <Card size="lg" minHeight="200px" m="10">
      <CardHeader>
        <HStack>
          <EditField field="name" value={product.name} productIndex={product.id} deckId={deckId}/>
          <Spacer />
          <strong>Sort #</strong>
          <EditField field="index" value={product.index} productIndex={product.id} deckId={deckId}/>
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
    let productsArray = Object.values(deck.products)
    productsArray.sort((a, b) => (a.index > b.index) ? 1 : -1)

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
        <AddProduct deckId={deckId}/>
        <Divider />
        {productsArray.map((product, index) => (
          <EditProduct product={product} productIndex={product.id} deckId={deckId}/>
        ))}
    </Box>
    );
  }
};

/* 
Add a product to the deck
Products = [ 
  id: {
      descriptions: ""
      id: ""
      image: ""
      name: ""
      notes: []
      pricing: ""
  }
]
*/


// TODO: we hide the product id if its in the name. So we should create our own id for the product 
const AddProduct = ({ deckId }) => {
  const [product, setProduct] = useState({
    descriptions: "",
    id: "",
    image: "",
    name: "",
    notes: [""],
    pricing: ""
   // pricingTable: "",
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

    const docRef = doc(db, 'decks', deckId);
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
      <Box w="60%" textAlign={"center"} align="center">
        <form onSubmit={handleSubmit}>
          <VStack>
            <Heading size="lg">Add Product</Heading>
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
            <FormControl id="descriptions" isRequired>
              <FormLabel>Descriptions (Each bullet point must start with a dash: -)</FormLabel>
              <Textarea type="text" name="descriptions" value={product.descriptions} onChange={handleChange} />
            </FormControl>
            <FormControl id="pricing" isRequired>
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
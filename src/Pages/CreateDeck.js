import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  theme,
  Card,
  CardBody,
  Heading,
  SimpleGrid,
  Button,
  Input,
  FormLabel,
  Textarea,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useToast,
  Image,
  HStack,
  Spacer,
  IconButton,
  Stack,
  CardFooter,
  FormControl,
  FormErrorMessage,
  Link
} from '@chakra-ui/react';
import useSWR from 'swr'
import { HamburgerIcon, AddIcon, CloseIcon } from '@chakra-ui/icons'
import { FirestoreProvider, useFirestore, useFirebaseApp, useFirestoreCollectionData } from 'reactfire';
import { doc, getFirestore, namedQuery, setDoc, query, collection, where  } from 'firebase/firestore';
import { IoShirtOutline, IoShirtSharp } from "react-icons/io5";
import { useNavigate } from 'react-router';
import { Field, Form, Formik } from 'formik';
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import { InstantSearch, SearchBox, Hits, Stats } from "react-instantsearch-dom"


const trademarkSymbol = '®';

// const fetcher = url => fetch(url, { headers: { 'x-requested-with': 'XMLHttpRequest' } } ).then(r => r.json())
const fetcher = url => fetch(url).then(r => r.json())
// const temp_url = "https://www.hitpromo.net/search/data?query=ceramic_mugs&domain=category&limit=24&showFilters=1"
const temp_url = "https://www.sanmar.com/Brands/Gildan/c/bra-gildan/getProducts.json?as=&categorySearchTerm=&screenSize=large"

/* I need to store items in local storage !!!! */
let items = []

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "xMWj0zSONVTnMzxmfGLsAd5yz1cZiHQ6", // Be sure to use an API key that only allows search operations
    nodes: [
      {
        host: "mke80ni3q2z1f5bap-1.a1.typesense.net",
        port: "443",
        path: "", // Optional. Example: If you have your typesense mounted in localhost:8108/typesense, path should be equal to '/typesense'
        protocol: "https",
      },
    ],
    cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  query_by is required.
  additionalSearchParameters: {
    query_by: "name",
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

// const App = () => (
//   <InstantSearch indexName="products" searchClient={searchClient}>
//     <SearchBox />
//     <Hits />
//   </InstantSearch>
// );


function DrawerExample() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const firstField = React.useRef()
  const [ tempItems, setTempItems ] = React.useState(items)
  const navigate = useNavigate()

  const onClick = () => {
    navigate(`/demo`)
  }

  console.log("Items: ", items)
  if (tempItems.length !== items.length) {
    setTempItems(items)
  }

  const removeItem = (name) => {
    items = items.filter(item => item.name !== name)
    setTempItems(items)
  }

  async function createDeck(name) {
    const db = getFirestore();
    // i want to map an array of objects into a map of objects
    // const products = items.map(item => {
    //   return {
    //     name: item.name,
    //     price: item.price,
    //     image: item.image,
    //     descriptions: item.descriptions
    //   }
    // })
    let products = {}
    items.forEach((item, index) => {
      products[index] = {
        name: item.name,
        pricing: item.pricing,
        image: item.image,
        descriptions: item.descriptions,
        product_notes: item.product_notes,
        lowest_price: item.lowest_price,
      }
    })
    
    console.log("products", products)


    await setDoc(doc(db, "decks", name), {
      name: name,
      date: new Date().toLocaleDateString(),
      products: products
    });
    window.open(`/edit/${name}`, "_blank")
  }

  /* 
  Get the deck name and date from the form...
  */
  return (
    <>
      <Button onClick={onClick}>My Decks</Button>
      <Button leftIcon={<HamburgerIcon />} colorScheme='green' variant="outline" onClick={onOpen}>
        My Items
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        initialFocusRef={firstField}
        onClose={onClose}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>
            New Deck
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing='24px'>
              <Box>
                <Formik
                  initialValues={{ name: '' }}
                  onSubmit={(values, actions) => {
                    createDeck(values.name)
                    setTimeout(() => {
                      // alert(JSON.stringify(values, null, 2));
                      actions.setSubmitting(false);
                    }, 500);
                  }}
                >
                  {props => (
                    <Form>
                      <Field name="name">
                        {({ field, form }) => (
                          <FormControl isInvalid={form.errors.name && form.touched.name}>
                            <FormLabel>Deck Name</FormLabel>
                            <Input {...field} id="name" placeholder="Enter Name" />
                            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      {tempItems.map(item => (
                        <Box align="center" justify="center" mt="10">
                          <HStack align={"left"}><Text>{item.name}</Text> <Spacer /><IconButton size="xs" colorScheme="red" icon={<CloseIcon />} onClick={() => removeItem(item.name)}/></HStack>
                          <Image src={item.image} />
                        </Box>
                      ))}
                      <DrawerFooter borderTopWidth='1px' mt={4}>
                      <Button mt={4} colorScheme="green" isLoading={props.isSubmitting} type="submit">
                        Submit
                      </Button>
                      </DrawerFooter>
                    </Form>
                  )}
                </Formik>
              {/* <Box>
                <FormLabel htmlFor='desc'>Add notes</FormLabel>
                <Textarea id='desc' />
              </Box> */}
              </Box>
            </Stack>
          </DrawerBody>
          {/* <DrawerFooter borderTopWidth='1px'>
            <Button variant='outline' mr={3} onClick={onClose}>
              Continue Sourcing
            </Button>
            <Button colorScheme='green' onClick={() => createDeck()}>Create</Button>
          </DrawerFooter> */}
        </DrawerContent>
      </Drawer>
    </>
  )
}

const Items = (products) => {
  const toast = useToast()

  console.log(products)

  const AddItem = (name, image, price, descriptions, product_notes, lowest_price) => {
    if (price === undefined || price === null) {
      price = "0.00"
    }
    let pricing = 
    {
      "0": {
        price: price,
        quantity: "-"
      },
      "1": {
        price: "-",
        quantity: "-"
      },
      "2": {
        price: "-",
        quantity: "-"
      }
    }
    items.push({name, image, pricing, descriptions, product_notes, lowest_price})

    toast({
      title: 'Item added.',
      description: "We've added this to your items.",
      status: 'success',
      duration: 6000,
      isClosable: true,
    })
  }

  /*
  I can either have the drawer pop out when added or show a lil toast
  */
  /*
  I want to map t
  */
  return (
    <SimpleGrid spacing={10} templateColumns='repeat(auto-fill, minmax(250px, 1fr))' margin="20" mt="10">
        {products.products.map(product => (
          <Card align="center" justify="center">
            <CardBody key={product.name} align="center" justify="center">
              <HStack align="right" justify="right">
                <Image src={product.image_url} />
                {/* <IconButton colorScheme="green" size="xs" icon={<AddIcon />} onClick={() => AddItem(product.name.replace(/<sup>&#174;<\/sup>/g, trademarkSymbol).replace(/<sup>&#153;<\/sup>/g, "").replace(/&#153;/g, ""), product.images[0].url, product.displayPriceText, product.description)}></IconButton> */}
                <IconButton colorScheme="green" size="xs" icon={<AddIcon />} onClick={() => AddItem(product.name, product.image_url, product.lowest_price, product.descriptions, product.product_notes, product.lowest_price)}></IconButton>
              </HStack>
              <Heading size="md">{product.name}</Heading>
              <Text size="md">${product.lowest_price}</Text>
            </CardBody>
            <CardFooter>
            <Link href={product.url} isExternal>View Product Site</Link>
            </CardFooter>
          </Card>
        ))}
    </SimpleGrid>
  )
}

const Header = () => {
  return (
    <Box margin="5">
      <HStack>
        <Heading>Browse</Heading>
        <Spacer />
        <DrawerExample /> 
      </HStack>
    </Box>
  )
}

function CreateDeck() {
  const firestoreInstance = getFirestore(useFirebaseApp());
  const [ url, setUrl ] = React.useState(temp_url)
  const [ index, setIndex ] = React.useState(0)
  const [ search, setSearch ] = React.useState("")


  const productQuery = query(
    collection(firestoreInstance, "products"), 
    where("name", ">=", search),
    // TODO: pagination... but how do we even handle this w/ respect to the deals display...
  )
  console.log(productQuery)
  const { status: productStatus, data: product } = useFirestoreCollectionData(productQuery, { idField: "id" })

  if(productStatus === "loading") {
    // TODO: add skeleton display instead of this text
    return (
      <Heading>Loading ...</Heading>
    )
  }

  console.log("data: ", product)

  const Hit = ({ hit }) => (
    <p>
      {hit.name} - {hit.description}
    </p>
  )

  const testSubmit = (e) => {
    console.log("Search value", search)

  }


  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <ChakraProvider theme={theme}>
        <Header />
        <HStack justify={"center"}>
          <Input placeholder="Search" onChange={(event) => setSearch(event.target.value)}/>
          <Button colorScheme="green" onClick={() => testSubmit()}>Search</Button>
        </HStack>
        <InstantSearch searchClient={searchClient} indexName="products">
          <SearchBox />
          <Stats />
          <Hits hitComponent={Hit} />
        </InstantSearch>
        {/* <HStack justify={"center"}>
          <Button onClick={() => ChangeItems("shirts")} colorScheme={index === 1 ? "green" :  "gray"}>Shirts</Button>
          <Button onClick={() => ChangeItems("sweatshirts")} colorScheme={index === 2 ? "green" :  "gray"}>Sweatshirts</Button>
          <Button onClick={() => ChangeItems("activewear")} colorScheme={index === 3 ? "green" :  "gray"}>Activewear</Button>
          <Button onClick={() => ChangeItems("polos")} colorScheme={index === 4 ? "green" :  "gray"}>Polos</Button>
          <Button onClick={() => ChangeItems("all")} colorScheme={index === 0 ? "green" :  "gray"}>Top</Button>
        </HStack> */}
        <Box textAlign="center" fontSize="xl">
          <Items products={product} />
        </Box>
      </ChakraProvider>
    </FirestoreProvider>
  );
}

export default CreateDeck;
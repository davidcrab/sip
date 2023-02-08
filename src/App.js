import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Card,
  CardBody,
  CardHeader,
  Center,
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
  Divider,
  UnorderedList,
  ListItem,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import Draggable,  {DraggableCore}  from 'react-draggable'; // Both at the same time
import useSWR from 'swr'
import { HamburgerIcon, AddIcon, CloseIcon } from '@chakra-ui/icons'
import ExampleProductImage from './unnamed.jpg'
import { FirestoreProvider, useFirestoreDocData, useFirestore, useFirebaseApp } from 'reactfire';
import { doc, getFirestore } from 'firebase/firestore';

/*
=====================================================================
  This is the items part of the app
=====================================================================
*/

const trademarkSymbol = '®';

const fetcher = url => fetch(url).then(r => r.json())
const temp_url = "https://www.sanmar.com/Brands/Gildan/c/bra-gildan/getProducts.json?as=&categorySearchTerm=&screenSize=large"

/* I need to store items in local storage !!!! */
let items = []



function DrawerExample() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const firstField = React.useRef()
  const [ tempItems, setTempItems ] = React.useState(items)

  if (tempItems.length !== items.length) {
    setTempItems(items)
  }
  console.log(tempItems)
  console.log(items)

  const removeItem = (name) => {
    items = items.filter(item => item.name !== name)
    setTempItems(items)
  }

  return (
    <>
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
            Request Quote
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing='24px'>
              <Box>
                <FormLabel htmlFor='name'>Name</FormLabel>
                <Input
                  ref={firstField}
                  id='name'
                  placeholder='Please enter full name'
                />
                <FormLabel htmlFor='email'>Email</FormLabel>
                <Input
                  id='email'
                  placeholder='Please enter your email'
                />
              </Box>
              {tempItems.map(item => (
                <Box align="center" justify="center">
                  <HStack align={"left"}><Text>{item.name}</Text> <Spacer /><IconButton size="xs" colorScheme="red" icon={<CloseIcon />} onClick={() => removeItem(item.name)}/></HStack>
                  <Image src={item.image} />
                </Box>
              ))}

              <Box>
                <FormLabel htmlFor='desc'>Add notes</FormLabel>
                <Textarea id='desc' />
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
            <Button variant='outline' mr={3} onClick={onClose}>
              Continue Browsing
            </Button>
            <Button colorScheme='green'>Send Request</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}


const Items = (url) => {
  console.log(url)
  console.log(temp_url)
  const { data, error } = useSWR(url.url, fetcher);
  const toast = useToast()
  if (error) {
    console.log(error)
    return <div>failed to load</div>
  }
  if (!data) return <div>loading...</div>

  return (
      <SimpleGrid spacing={10} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' margin="20" mt="10">
          {data.results.map(product => (
            <Draggable>
              <Card maxW='sm' align="center" justify="center">
                <CardBody key={product.name.replace(/&#174;/g, trademarkSymbol)} align="center" justify="center">
                  <HStack align="right" justify="right">
                    <Image src={product.images[0].url} />
                  </HStack>
                  {product.name.replace(/<sup>&#174;<\/sup>/g, trademarkSymbol).replace(/<sup>&#153;<\/sup>/g, "").replace(/&#153;/g, "")}
                </CardBody>
                <CardFooter>
                </CardFooter>
              </Card>
            </Draggable>
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



function Explorer() {

  const [ url, setUrl ] = React.useState(temp_url)
  const [ index, setIndex ] = React.useState(0)

  const ChangeItems = (e) => {

    if (e === "shirts") {
      setUrl("https://www.sanmar.com/Brands/Gildan/c/bra-gildan/getProducts.json?screenSize=large&sort=relevance&text=:relevance:category:tshirts")
      setIndex(1)
    } else if (e === "sweatshirts") {
      setUrl("https://www.sanmar.com/Brands/Gildan/c/bra-gildan/getProducts.json?screenSize=large&sort=relevance&text=:relevance:category:sweatshirtsfleece")
      setIndex(2)
    } else if (e === "activewear") {
      setUrl("https://www.sanmar.com/Brands/Gildan/c/bra-gildan/getProducts.json?screenSize=large&sort=relevance&text=:relevance:category:activewear")
      setIndex(3)
    } else if (e === "polos") {
      setUrl("https://www.sanmar.com/Brands/Gildan/c/bra-gildan/getProducts.json?screenSize=large&sort=relevance&text=:relevance:category:polosknits")
      setIndex(4)
    } else {
      setUrl("https://www.sanmar.com/Brands/Gildan/c/bra-gildan/getProducts.json?as=&categorySearchTerm=&screenSize=large")
      setIndex(0)
    }
  }
  return (
    <Box mt="10" textAlign="center" fontSize="xl">
      <HStack justify={"center"}>
        <Button onClick={() => ChangeItems("shirts")} colorScheme={index === 1 ? "green" :  "gray"}>Shirts</Button>
        <Button onClick={() => ChangeItems("sweatshirts")} colorScheme={index === 2 ? "green" :  "gray"}>Sweatshirts</Button>
        <Button onClick={() => ChangeItems("activewear")} colorScheme={index === 3 ? "green" :  "gray"}>Activewear</Button>
        <Button onClick={() => ChangeItems("polos")} colorScheme={index === 4 ? "green" :  "gray"}>Polos</Button>
        <Button onClick={() => ChangeItems("all")} colorScheme={index === 0 ? "green" :  "gray"}>Top</Button>
      </HStack>
      <Box textAlign="center" fontSize="xl">
        <Items url={url} />
      </Box>
    </Box>
  );
}


/*
=====================================================================
  This is the main part of the app
=====================================================================
*/

const Canvas = () => {

  return (
    <Center>
      <Box mt="10" w="90%" bg="red.50" h="800px">

      </Box>
    </Center>
  )
}

const DeckHeader = (data) => {
  console.log("Header", data)
  return (
    <Box h="200" mt="20">
      <VStack justify="center">
        <Heading size="3xl">{data.data}</Heading>
        <Heading size="sm">Prepared by</Heading>
        <Spacer />
        <Heading size="lg">G&G Outfitters, Inc</Heading>
        <Heading size="xs">{data.date}</Heading>
      </VStack>
    </Box>
  )
}

const Product = (product) => {

  console.log("Product", product)

  return (
    <Card h="600" mt="20" variant={"outline"}>
      <CardHeader>
        <Heading>{product.product.name}</Heading>
      </CardHeader>
      <CardBody>
        <HStack align="center" justify={"space-between"}>
          <Image src={ExampleProductImage} />
          <Spacer />
          <VStack>
            <Heading>About</Heading>
            <UnorderedList spacing={3}>
              {product.product.descriptions.map(description => (
                <ListItem><Heading size={"md"}>{description}</Heading></ListItem>
              ))}
            </UnorderedList>
          </VStack>
          <Spacer />
          <VStack>
            <Heading>Price</Heading>
            <TableContainer>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>Quantity</Th>
                    <Th isNumeric>Price</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {product.product.pricing.map(price => (
                  <Tr>
                    <Td>{price.quantity}</Td>
                    <Td isNumeric>{price.price}</Td>
                  </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </VStack>
          <Spacer />
        </HStack>
      </CardBody>
    </Card>
  )
}

const SalesDeck = () => {

  // easily access the Firestore library
  const burritoRef = doc(useFirestore(), 'decks', 'firstdeck');

  // subscribe to a document for realtime updates. just one line!
  const { status, data } = useFirestoreDocData(burritoRef);

  // easily check the loading status
  if (status === 'loading') {
    return <p>Fetching burrito flavor...</p>;
  }

  // map through the products 

  return (
    <Box margin="10">
      <DeckHeader data={data.name} date={data.date} />
      {data.products.map(product => (
        <Product product={product} />
      ))}
    </Box>
  )
}

function App() {
  /*
  This is going to be a demo slide deck page 
  */
 const testDeck = {
    "name": "Cub Scouts of America",
    "products": [
      {
        "name": "MAGNIFIER AND LED LIGHT KEY CHAIN",
        "descriptions": [
          "2 Extra Bright White LED Lights",
          "Push Tip To Turn On/Off",
          "Handy Magnifier",
          "2x Magnification",
          "Split Ring Attachment",
          "Button Cell Batteries Included",
        ],
        "pricing": [
          { "quanitiy": "100", "price": "2.7" },
          { "quanitiy": "500", "price": "2.4" },
        ],
        "image": "https://www.sanmar.com/Brands/Gildan/c/bra-gildan/getProducts.json?as=&categorySearchTerm=&screenSize=large"
      },
      {
        "name": "Test Product 2",
        "descriptions": [
          "Test Description 1",
          "Test Description 2",
          "Test Description 3",
          "Test Description 4",
        ],
        "pricing": [
          { "quanitiy": "Test Pricing 1", "price": "2.7" },
          { "quanitiy": "Test Pricing 2", "price": "2.4" },
        ],
        "image": "https://www.sanmar.com/Brands/Gildan/c/bra-gildan/getProducts.json?as=&categorySearchTerm=&screenSize=large"
      },
    ]
 }
 const firestoreInstance = getFirestore(useFirebaseApp());

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <ChakraProvider theme={theme}>
        <SalesDeck data={testDeck} />
      </ChakraProvider>
    </FirestoreProvider>

  );
}

export default App;

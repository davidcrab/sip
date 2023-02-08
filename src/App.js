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
} from '@chakra-ui/react';
import useSWR from 'swr'
import { HamburgerIcon, AddIcon, CloseIcon } from '@chakra-ui/icons'
import ExampleProductImage from './unnamed.jpg'
import { FirestoreProvider, useFirestoreCollectionData, useFirestore, useFirebaseApp } from 'reactfire';
import { doc, getFirestore, query, collection, orderBy } from 'firebase/firestore';
import { IoShirtOutline, IoShirtSharp } from "react-icons/io5";

const trademarkSymbol = '®';

// const fetcher = url => fetch(url, { headers: { 'x-requested-with': 'XMLHttpRequest' } } ).then(r => r.json())
const fetcher = url => fetch(url).then(r => r.json())
// const temp_url = "https://www.hitpromo.net/search/data?query=ceramic_mugs&domain=category&limit=24&showFilters=1"
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

  async function createDeck() {
    console.log("Creating deck")
    /*
    create a new firestore document
    */
    console.log(items)
    const db = getFirestore(app);

    // Add a new document in collection "cities"
    await setDoc(doc(db, "decks", "test2"), {
      /*
      I need to map: 

      { name
        date
        products [
          { 
            name
            descriptions [
              string
            ]
            image
            pricing [
              { price, quantity }
            ]
          }
        ]
      }

      */

      name: "",
      state: "CA",
      country: "USA"
    });

  }

  /* 
  Get the deck name and date from the form...
  */
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
            <Button colorScheme='green' onClick={createDeck}>Send Request</Button>
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

  console.log(data)

  const AddItem = (name, image) => {

    items.push({name, image})

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

  return (
    <SimpleGrid spacing={10} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' margin="20" mt="10">
        {data.results.map(product => (
          <Card maxW='sm' align="center" justify="center">
            <CardBody key={product.name.replace(/&#174;/g, trademarkSymbol)} align="center" justify="center">
              <HStack align="right" justify="right">
                <Image src={product.images[0].url} />
                <IconButton colorScheme="green" size="xs" icon={<AddIcon />} onClick={() => AddItem(product.name.replace(/<sup>&#174;<\/sup>/g, trademarkSymbol).replace(/<sup>&#153;<\/sup>/g, "").replace(/&#153;/g, ""), product.images[0].url)}></IconButton>
              </HStack>
              {product.name.replace(/<sup>&#174;<\/sup>/g, trademarkSymbol).replace(/<sup>&#153;<\/sup>/g, "").replace(/&#153;/g, "")}
            </CardBody>
            <CardFooter>
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



function App() {

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
    <ChakraProvider theme={theme}>
      <Header />
      <HStack justify={"center"}>
        {/* <Button size="" variant='ghost'>
          <VStack>
            <IoShirtSharp />
            <Text>Shirts</Text>
          </VStack>
        </Button>
        <IconButton icon={IoShirtSharp}></IconButton> */}

        <Button onClick={() => ChangeItems("shirts")} colorScheme={index === 1 ? "green" :  "gray"}>Shirts</Button>
        {/* {index === 1 ? <CheckIcon /> : null} */}
        <Button onClick={() => ChangeItems("sweatshirts")} colorScheme={index === 2 ? "green" :  "gray"}>Sweatshirts</Button>
        <Button onClick={() => ChangeItems("activewear")} colorScheme={index === 3 ? "green" :  "gray"}>Activewear</Button>
        <Button onClick={() => ChangeItems("polos")} colorScheme={index === 4 ? "green" :  "gray"}>Polos</Button>
        <Button onClick={() => ChangeItems("all")} colorScheme={index === 0 ? "green" :  "gray"}>Top</Button>
      </HStack>
      <Box textAlign="center" fontSize="xl">
        <Items url={url} />
      </Box>
    </ChakraProvider>
  );
}

// function App() {
//  const firestoreInstance = getFirestore(useFirebaseApp());
//  const decksquery = query(
//     collection(firestoreInstance, "decks"),
//     orderBy("name", "asc")
//     // TODO: pagination... but how do we even handle this w/ respect to the deals display...
//   )
//   const { status: decksStatus, data: decks } = useFirestoreCollectionData(decksquery, { idField: "id" })

//   if(decksStatus === "loading") {
//     // TODO: add skeleton display instead of this text
//     return (
//       <Heading>Loading ...</Heading>
//     )
//   }

//   const deckCards = decks.map(deck => (
//     <Button m="10">{deck.name}</Button>
//   ))

//   return (
//     <FirestoreProvider sdk={firestoreInstance}>
//       <ChakraProvider theme={theme}>
//         <Box textAlign="center" fontSize="xl">
//           <Heading>My Decks</Heading>
//           <Divider mt="10" mb="20"/>
//           {deckCards}
//         </Box>
//       </ChakraProvider>
//     </FirestoreProvider>

//   );
// }

export default App;

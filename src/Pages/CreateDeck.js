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
import { FirestoreProvider, useFirestore, useFirebaseApp } from 'reactfire';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { IoShirtOutline, IoShirtSharp } from "react-icons/io5";
import { useNavigate } from 'react-router';

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
  const navigate = useNavigate()

  const onClick = () => {
    navigate(`/`)
  }

  console.log("Items: ", items)
  if (tempItems.length !== items.length) {
    setTempItems(items)
  }

  const removeItem = (name) => {
    items = items.filter(item => item.name !== name)
    setTempItems(items)
  }

  async function createDeck() {
    const db = getFirestore();
    console.log("Creating deck")
    await setDoc(doc(db, "decks", "mark2"), {
      name: "Hello World",
      date: "2021-09-01",
      products: items
    });
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
                <FormLabel htmlFor='name'>Name</FormLabel>
                <Input
                  ref={firstField}
                  id='name'
                  placeholder='Please name your deck'
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
              Continue Sourcing
            </Button>
            <Button colorScheme='green' onClick={() => createDeck()}>Create</Button>
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

  const AddItem = (name, image, price, description) => {
    if (price === undefined || price === null) {
      price = "0.00"
    }
    let pricing = [{ 
      price: price,
      quantity: "100"
    }]
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(description, 'text/html');
    console.log(htmlDoc)
    let bulletPoints = htmlDoc.getElementsByTagName('li')
    let descriptions = []
    for (let point of bulletPoints) {
      descriptions.push(point.innerHTML)
    }

    items.push({name, image, pricing, descriptions})

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
    <SimpleGrid spacing={10} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' margin="20" mt="10">
        {data.results.map(product => (
          <Card maxW='sm' align="center" justify="center">
            <CardBody key={product.name.replace(/&#174;/g, trademarkSymbol)} align="center" justify="center">
              <HStack align="right" justify="right">
                <Image src={product.images[0].url} />
                <IconButton colorScheme="green" size="xs" icon={<AddIcon />} onClick={() => AddItem(product.name.replace(/<sup>&#174;<\/sup>/g, trademarkSymbol).replace(/<sup>&#153;<\/sup>/g, "").replace(/&#153;/g, ""), product.images[0].url, product.displayPriceText, product.description)}></IconButton>
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

function CreateDeck() {
  const firestoreInstance = getFirestore(useFirebaseApp());

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
    <FirestoreProvider sdk={firestoreInstance}>
      <ChakraProvider theme={theme}>
        <Header />
        <HStack justify={"center"}>
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
    </FirestoreProvider>
  );
}

export default CreateDeck;
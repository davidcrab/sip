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
  CardFooter
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import Draggable,  {DraggableCore}  from 'react-draggable'; // Both at the same time
import useSWR from 'swr'
import { HamburgerIcon, AddIcon, CloseIcon } from '@chakra-ui/icons'

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

function App() {
  return (
    <ChakraProvider theme={theme}>
      <HStack align="left">
        <Box w="70%" textAlign="center" fontSize="xl">
        <VStack m="5" align="left" justify={"left"} textAlign="left">
          <Heading>Sip</Heading>
          <Text>Drag and Drop Sales Deck</Text>
        </VStack>
        <Canvas />
        {/* <Draggable>
          <Card className="App">
            <CardHeader>Draggable Card</CardHeader>
          </Card>
        </Draggable> */}
        </Box>
        <Box w="30%" bg="gray.100" mt="20">
          <Explorer />
        </Box>
      </HStack>
    </ChakraProvider>
  );
}

export default App;

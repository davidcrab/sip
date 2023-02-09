import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
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
  Link
} from '@chakra-ui/react';
import Draggable,  {DraggableCore}  from 'react-draggable'; // Both at the same time
import useSWR from 'swr'
import { HamburgerIcon, AddIcon, CloseIcon } from '@chakra-ui/icons'
import { FirestoreProvider, useFirestoreCollectionData, useFirestore, useFirebaseApp } from 'reactfire';
import { doc, getFirestore, query, collection, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router';

function MyDecks() {
 const firestoreInstance = getFirestore(useFirebaseApp());
 const navigate = useNavigate()

 const decksquery = query(
    collection(firestoreInstance, "decks"),
    orderBy("name", "asc")
    // TODO: pagination... but how do we even handle this w/ respect to the deals display...
  )
  const { status: decksStatus, data: decks } = useFirestoreCollectionData(decksquery, { idField: "id" })

  if(decksStatus === "loading") {
    // TODO: add skeleton display instead of this text
    return (
      <Heading>Loading ...</Heading>
    )
  }

  const onClick = (id) => {
    console.log("Clicked on " + id)
    navigate(`/view/` + id)
  }

  const deckCards = decks.map(deck => (
    <Card>
      <CardHeader>
        <Heading size="md">{deck.name}</Heading>
      </CardHeader>
      <CardBody>
        <Text>{deck.date}</Text>
      </CardBody>
      <CardFooter>
        <Button size="lg" colorScheme='green' variant='outline'>Edit</Button>
        <Spacer />
        {/* <Button onClick={() => onClick(deck.id)}>View</Button> */}
        <Button size="lg" colorScheme='green'><Link target="_blank" href={"/view/" + deck.id}>View</Link></Button>
      </CardFooter>
    </Card>
  ))

  const onCreate = () => {
    navigate("/create")
  }

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <ChakraProvider theme={theme}>
        <Box textAlign="center" fontSize="xl">
          <HStack ml="10" mr="10" mt="10">
            <Heading>My Decks</Heading>
            <Spacer />
            <Button onClick={onCreate}>Create Deck</Button>
          </HStack>
          <Divider mt="10" mb="20"/>
          <SimpleGrid spacing={10} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' margin="20" mt="10">
            {deckCards}
          </SimpleGrid>
        </Box>
      </ChakraProvider>
    </FirestoreProvider>

  );
}

export default MyDecks;
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
import { FirestoreProvider, useFirestoreCollectionData, useFirestore, useFirebaseApp } from 'reactfire';
import { doc, getFirestore, query, collection, orderBy } from 'firebase/firestore';

function App() {
 const firestoreInstance = getFirestore(useFirebaseApp());
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

  const deckCards = decks.map(deck => (
    <Button m="10">{deck.name}</Button>
  ))

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <ChakraProvider theme={theme}>
        <Box textAlign="center" fontSize="xl">
          <Heading>My Decks</Heading>
          <Divider mt="10" mb="20"/>
          {deckCards}
        </Box>
      </ChakraProvider>
    </FirestoreProvider>

  );
}

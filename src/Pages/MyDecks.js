import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  theme,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  SimpleGrid,
  Button,
  HStack,
  Spacer,
  CardFooter,
  Divider,
  Link,
  Tooltip,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack
} from '@chakra-ui/react';
import Draggable,  {DraggableCore}  from 'react-draggable'; // Both at the same time
import useSWR from 'swr'
import { FirestoreProvider, useFirestoreCollectionData, useFirebaseApp, useUser } from 'reactfire';
import { doc, getFirestore, query, collection, where, updateDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router';
import trackPathForAnalytics from '../TrackPathForAnalytics';
import { useCallback, useEffect } from 'react';
import LoginButton from '../components/Login';
import Mockup from './ProductEditor';
import DeckCard from '../components/DeckCard';

/* update deck component... this will */

function StatusColumn({status, decks}) {
  return (
    <VStack >
      <Heading size="sm">{status}</Heading>
      <VStack bg="gray.50" rounded="xl">
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' p="4">
          { /* map over the decks and display them */ }
          {decks.map((deck) => (
            <DeckCard deck={deck} />
          ))}
        </SimpleGrid>
      </VStack>
    </VStack>
  )
}

function MyDecks() {
  const { status: userStatus, data: user } = useUser();
  const { pathname, search } = useLocation();

  const analytics = useCallback(() => {
      trackPathForAnalytics({ path: pathname, search: search, title: pathname.split("/")[1] });
  }, [pathname, search]);

  useEffect(() => {
      analytics();
  }, [analytics]);

 const firestoreInstance = getFirestore(useFirebaseApp());

 // query the decks with the user id
 let decksquery = user ? query(
    collection(firestoreInstance, "decks"),
    where("userId", "==", user.uid)
  ) : query(
    collection(firestoreInstance, "decks"),
    where("userId", "==", "demo")
  )

  // if the userId, then this is me and I should have admin permission to view all ve2Q2aQj2ga4YJGcSwuvkSUi4R73
  if (user && user.uid === "ve2Q2aQj2ga4YJGcSwuvkSUi4R73") {
    decksquery = query(
      collection(firestoreInstance, "decks")
    )
  }

  const { status: decksStatus, data: decks } = useFirestoreCollectionData(decksquery, { idField: "id" })

  if(decksStatus === "loading" || userStatus === "loading") {
    // TODO: add skeleton display instead of this text
    return (
      <Heading>Loading ...</Heading>
    )
  }

  const noStatus = decks.filter(deck => !deck.status)
  const inProgress = decks.filter(deck => deck.status && deck.status.toLowerCase() === "in progress")
  const published = decks.filter(deck => deck.status && deck.status.toLowerCase() === "done")
  const archived = decks.filter(deck => deck.status && deck.status.toLowerCase() === "archive")


  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <ChakraProvider theme={theme}>
        <Box textAlign="center">
          <HStack ml="8" mr="8" mt="8">
            <Heading size="md">Home</Heading>
            <Spacer />
            <Link href="https://chrome.google.com/webstore/detail/sip-sales-extension/imkmdeidjgpjhccbamgpchddhmmfbagg?hl=en&authuser=0" target="_blank"><Button size="md">Install Extension</Button></Link>
            <LoginButton />
          </HStack>
          <Divider mt="8" mb="8"/>
          <HStack align={"flex-start"} justify="space-evenly" w="full">
            <StatusColumn status="No Status" decks={noStatus} />
            <StatusColumn status="In Progress" decks={inProgress} />
            <StatusColumn status="Published" decks={published} />
            <StatusColumn status="Archived" decks={archived} />
          </HStack>
          <Heading>All Decks</Heading>
          <SimpleGrid spacing={10} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' margin="20" mt="10">
            { /* map over the decks and display them */ }
            {decks.map((deck) => (
              <DeckCard deck={deck} />
            ))}
          </SimpleGrid>
        </Box>
      </ChakraProvider>
    </FirestoreProvider>

  );
}



export default MyDecks;
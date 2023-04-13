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

  console.log("user", user)
  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <ChakraProvider theme={theme}>
        <Box textAlign="center" fontSize="xl">
          <HStack ml="10" mr="10" mt="10">
            <Heading>All Decks</Heading>
            <Spacer />
            <Link href="https://chrome.google.com/webstore/detail/sip-sales-extension/imkmdeidjgpjhccbamgpchddhmmfbagg?hl=en&authuser=0" target="_blank"><Button size="lg">Install Extension</Button></Link>
            <LoginButton />
          </HStack>
          {user && <Text>Current user: {user.uid}</Text>} {/* add a conditional check for user object */}
          <Divider mt="10" mb="10"/>
          <HStack align={"flex-start"} justify="space-evenly" w="full">
            <VStack bg="orange.50" p="30px" rounded="xl">
                <Heading>No Status</Heading>
                <SimpleGrid spacing={10} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' margin="20" mt="10">
                  { /* map over the decks and display them */ }
                  {decks.map((deck) => (
                    !deck.status && <DeckCard deck={deck} />
                  ))}
                </SimpleGrid>
              </VStack>
            <VStack bg="yellow.50" p="30px" rounded="xl">
              <Heading>Decks in Progress</Heading>
              <SimpleGrid spacing={10} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' margin="20" mt="10">
                { /* map over the decks and display them */ }
                {decks.map((deck) => (
                  deck.status && deck.status.toLowerCase() === "in progress" && <DeckCard deck={deck} />
                ))}
              </SimpleGrid>
            </VStack>
            <VStack bg="green.50" p="30px" rounded="xl">
              <Heading>Decks Published</Heading>
              <SimpleGrid spacing={10} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' margin="20" mt="10"> 
                { /* map over the decks and display them */ }
                {decks.map((deck) => (
                  deck.status && deck.status.toLowerCase() === "done" && <DeckCard deck={deck} />
                ))}
              </SimpleGrid>
            </VStack>
            <VStack bg="red.50" p="30px" rounded="xl">
              <Heading>Decks Archived</Heading>
              <SimpleGrid spacing={10} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' margin="20" mt="10">
                { /* map over the decks and display them */ }
                {decks.map((deck) => (
                  deck.status && deck.status.toLowerCase() === "archive" && <DeckCard deck={deck} />
                ))}
              </SimpleGrid>
            </VStack>
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
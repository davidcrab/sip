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
  Tooltip
} from '@chakra-ui/react';
import Draggable,  {DraggableCore}  from 'react-draggable'; // Both at the same time
import useSWR from 'swr'
import { FirestoreProvider, useFirestoreCollectionData, useFirebaseApp, useUser } from 'reactfire';
import { doc, getFirestore, query, collection, where } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router';
import trackPathForAnalytics from '../TrackPathForAnalytics';
import { useCallback, useEffect } from 'react';
import LoginButton from '../components/Login';
import Mockup from './ProductEditor';

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
 const navigate = useNavigate()

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

  const onClick = (id) => {
    console.log("Clicked on " + id)
    navigate(`/edit/` + id)
  }

  const deckCards = decks.map(deck => (
      <Card>
        <Tooltip hasArrow placement='top' label="Click to Edit" aria-label="Edit Deck">
          <CardBody onClick={() => onClick(deck.id)}>
            <Box>
              <Heading size='xs' textTransform='uppercase'>
                {deck.name}
              </Heading>
              <Text pt='2' fontSize='sm'>
              {deck.date}
              </Text>
            </Box>
          </CardBody>
        </Tooltip>
        <Divider />
        <CardFooter w="full">
            <Button as="a" w="full" size="lg" colorScheme='gray' target="_blank" href={"/view/" + deck.id}>Preview</Button>
        </CardFooter>
      </Card>
  ))

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
          <Center>
          </Center>
          <SimpleGrid spacing={10} templateColumns='repeat(auto-fill, minmax(200px, 1fr))' margin="20" mt="10">
            {deckCards}
          </SimpleGrid>
        </Box>
      </ChakraProvider>
    </FirestoreProvider>

  );
}



export default MyDecks;
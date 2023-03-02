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
  Link,
  Tooltip
} from '@chakra-ui/react';
import Draggable,  {DraggableCore}  from 'react-draggable'; // Both at the same time
import useSWR from 'swr'
import { HamburgerIcon, AddIcon, CloseIcon } from '@chakra-ui/icons'
import { FirestoreProvider, useFirestoreCollectionData, useFirestore, useFirebaseApp, useUser } from 'reactfire';
import { doc, getFirestore, query, collection, orderBy, where } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router';
import trackPathForAnalytics from '../TrackPathForAnalytics';
import { useCallback, useEffect } from 'react';
import LoginButton from '../components/Login';

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
 const decksquery = user ? query(
  collection(firestoreInstance, "decks"),
  where("userId", "==", user.uid)
) : query(
  collection(firestoreInstance, "decks"),
  where("userId", "==", "demo")
)

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
          <Link w="full" target="_blank" href={"/view/" + deck.id}>
            <Button w="full" size="lg" colorScheme='gray'>Preview</Button>
          </Link>
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
            <Link href="https://david-crabtree-resume-bucket.s3.amazonaws.com/sip-sales-extension-0.0.01.zip" target="_blank"><Button size="lg">Download Extension</Button></Link>
            <LoginButton />
          </HStack>
          {user && <Text>Current user: {user.uid}</Text>} {/* add a conditional check for user object */}
          <Divider mt="10" mb="10"/>
          <Center>
            <Card variant={"filled"} w="80%">
              <CardHeader>
                <Heading>How to Download and Install</Heading>
              </CardHeader>
              <CardBody>
                <Text>1. Download the extension from the button above</Text>
                <Text>2. Go to chrome://extensions/</Text>
                <Text>3. Turn on developer mode</Text>
                <Text>4. Click "Load unpacked" and select the folder you downloaded</Text>
                <Text>5. Click the extension icon in the top right of your browser</Text>
                <Text>6. Pin the Sip Sales Extension</Text>
              </CardBody>
            </Card>
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
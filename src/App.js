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
import { FirestoreProvider, useFirestore, useFirebaseApp } from 'reactfire';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { IoShirtOutline, IoShirtSharp } from "react-icons/io5";
import { BrowserRouter, Route, Routes, Outlet, Navigate, useLocation } from "react-router-dom";
import MyDecks from './Pages/MyDecks';
import CreateDeck from './Pages/CreateDeck';
import DeckPage from './Pages/DeckPage';

export const App = () => {
  return (
    <AppInner />
  )
}

const AppInner = () => {
  const app = useFirebaseApp();

  const firestoreDatabase = getFirestore(app);

  return (
    <FirestoreProvider sdk={firestoreDatabase}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MyDecks />} />
          <Route path="/view" element={<DeckPage />} />
          <Route path="/create" element={<CreateDeck />} />
          <Route path="/view/:id" element={<DeckPage />} />
        </Routes>
      </BrowserRouter>
    </FirestoreProvider>
  )
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

import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  VStack,
  Badge,
  CardHeader,
  HStack
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from 'react'

async function getUserName(userId) {
  const db = getFirestore();
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().name;
  } else {
    console.log("Unknown User");
  }
}

const DeckCard = ({deck}) => {
  const navigate = useNavigate()
  const [deckUserName, setDeckUserName] = useState("loading user ...")

  const onClick = (id) => {
    console.log("Clicked on " + id)
    navigate(`/edit/` + id)
  }

  const setStatus = async (status) => {
    console.log("Status: " + status)
    console.log("deck id", deck.id)
    const db = getFirestore();
    const docRef = doc(db, "decks", deck.id);
    await updateDoc(docRef, {
      status: status
    });
  }

  useEffect(() => {
    getUserName(deck.userId).then((name) => {
      setDeckUserName(name)
    })
  }, [deck])

  return (
    <Card textAlign="start" size="sm">
      <CardHeader>
        <Heading size='xs' textTransform='uppercase'>
          {deck.name}
        </Heading>
      </CardHeader>
      <CardBody>
        <Text fontSize='sm'>
          {deck.date}
        </Text>
        <Text fontSize='sm'>Template {deck.version ? deck.version : "1.0"}</Text>
        <Badge colorScheme="green" fontSize='xs'>{deckUserName}</Badge>
      </CardBody>
      <CardFooter w="full">
        <VStack w="full">
          <HStack w="full" justifyContent={"center"}>
            <Button size="sm" onClick={() => onClick(deck.id)}>Edit</Button>
            <Button size="sm" as="a" colorScheme='gray' target="_blank" href={"/view/" + deck.id}>View</Button>
          </HStack>
          <Menu size="sm">
              {({ isOpen }) => (
                <>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm">
                    {deck.status ? deck.status : "Set Status"}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => setStatus('In progress')}>In progress</MenuItem>
                    <MenuItem onClick={() => setStatus('Done')}>Done</MenuItem>
                    <MenuItem onClick={() => setStatus("Archive")}>Archive</MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
        </VStack>
        
        {/* <VStack>
          <Button as="a" size="sm" colorScheme='gray' target="_blank" href={"/view/" + deck.id}>Preview</Button>
          <Menu size="sm">
            {({ isOpen }) => (
              <>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm">
                  {deck.status ? deck.status : "Set Status"}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setStatus('In progress')}>In progress</MenuItem>
                  <MenuItem onClick={() => setStatus('Done')}>Done</MenuItem>
                  <MenuItem onClick={() => setStatus("Archive")}>Archive</MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
          <Text pt='2' fontSize='sm'>{deck.version ? deck.version : "Version 1.0"}</Text>
        </VStack> */}
      </CardFooter>
    </Card>
  )
}

export default DeckCard;
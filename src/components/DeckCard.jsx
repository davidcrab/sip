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
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const DeckCard = ({deck}) => {
  const navigate = useNavigate()

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

  return (
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
        <VStack>
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
          {/* <small>Created by: {deck.userId}</small> */}
        </VStack>
      </CardFooter>
    </Card>
  )
}

export default DeckCard;
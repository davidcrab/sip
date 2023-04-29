/*
A Header component that allows the user to edit the deck name and upload
their clients logo. 
The Deck name will go on the top left and the logo will go on the top right
*/
import { Heading, Box, Image, HStack, Spacer } from '@chakra-ui/react';


const DeckEditorHeader = ({ deck, onSubmit }) => {

  console.log(deck)
  
  return (
    <Box w="100%" position="sticky" top="0" zIndex="sticky" bg="#11284a" color="white" overflow="hidden" mb="20">
      <HStack pl="8" pr="8">
        <Heading as="h4" size="lg">
          {deck.name}
        </Heading>
        <Spacer />
        <Image w="100px" src={deck.clientLogo} />
      </HStack>
    </Box>
  );
}

export default DeckEditorHeader;
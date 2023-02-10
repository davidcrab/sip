import {
Heading,
Box,
HStack,
Spacer,
Button,
ChakraBaseProvider, 
theme,
Center,
VStack,
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate  } from 'react-router-dom';

const Landing = () => {
  
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/demo');
  }


  return (
    <ChakraBaseProvider theme={theme}>
      <Box>
        <HStack m="10">
          <Heading>Sipp</Heading>
          <Spacer />
          <Button colorScheme={"green"} onClick={onClick} size="md">Demo</Button>
        </HStack>
        <Box margin="30" mt="10">
          <Center>
            <VStack textAlign={"center"} spacing={8}>
              <Heading lineHeight={"120%"} size="4xl">Start sending customized product decks in minutes.</Heading>
              <Heading size="lg">Stop jumping around vendor websites.</Heading>
              <Heading size="lg">Never copy product data into a PowerPoint again.</Heading>
              <Heading size="sm">We've simplified the process so you can focus on what matters.</Heading>
              <Spacer />
              <Button size="lg" colorScheme={"green"} w="200px" onClick={onClick}>Try Now</Button>
            </VStack>
          </Center>
        </Box>
        <Box margin="30" mt="150">
          <Heading size="xl">How?</Heading>
          <VStack align="start" ml="5">
            <Heading size="lg">1. Select specific products from your suppliers</Heading>
            <Heading size="lg">2. Generate a deck with those product names, descriptions, and images</Heading>
            <Heading size="lg">3. Add your pricing</Heading>
            <Heading size="lg">4. Share with your client</Heading>
          </VStack>
        </Box>
      </Box>
    </ChakraBaseProvider>
  );
}

export default Landing;
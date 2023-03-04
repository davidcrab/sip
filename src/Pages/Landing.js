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
import { useNavigate, useLocation  } from 'react-router-dom';
import trackPathForAnalytics from '../TrackPathForAnalytics';
import { useCallback, useEffect } from 'react';

const Landing = () => {
  
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/demo');
  }

  const { pathname, search } = useLocation();

  const analytics = useCallback(() => {
      trackPathForAnalytics({ path: pathname, search: search, title: pathname.split("/")[1] });
  }, [pathname, search]);

  useEffect(() => {
      analytics();
  }, [analytics]);

  return (
    <ChakraBaseProvider theme={theme}>
      <Box mb="0">
        <HStack m="10">
          <Heading>Sip</Heading>
          <Spacer />
          <Button colorScheme={"green"} onClick={onClick} size="md">Demo</Button>
        </HStack>
        <Box margin="30" mt="10">
          <Center>
            <VStack textAlign={"center"} spacing={4}>
              <Heading lineHeight={"120%"} size="4xl">Send custom product decks in minutes.</Heading>
              <Heading size="lg">Stop jumping around vendor websites.</Heading>
              <Heading size="lg">Never copy product data into a PowerPoint again.</Heading>
              <Heading size="sm">We've simplified the process so you can focus on what matters.</Heading>
              <Spacer />
              <Button size="lg" colorScheme={"green"} w="200px" onClick={onClick}>Try Now</Button>
            </VStack>
          </Center>
        </Box>
        <Box mt="20" bg="gray.50" mb="0">
          <VStack margin="30" mb="0" pt="50" pb="50" align="center" textAlign={"center"} ml="5">
            <Heading size="2xl">Drag-and-drop sales deck</Heading>
            <Heading size="lg">1. Handpick products from your suppliers</Heading>
            <Heading size="lg">2. Generate a deck with the product names, descriptions, and images</Heading>
            <Heading size="lg">3. Share with your client</Heading>
          </VStack>
        </Box>
      </Box>
    </ChakraBaseProvider>
  );
}

export default Landing;
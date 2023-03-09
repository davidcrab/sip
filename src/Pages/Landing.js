import {
Heading,
Box,
HStack,
Spacer,
Button,
ChakraBaseProvider, 
theme,
Center,
Input,
VStack,
AspectRatio,
Divider
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
        <HStack m="5">
          <Heading>Sip Decks</Heading>
          <Spacer />
          <Button colorScheme={"green"} onClick={onClick} size="md">Request a Demo</Button>
        </HStack>
        <Divider />
        <Box margin="30" mt="10">
          <Center>
            <VStack textAlign={"center"} spacing={4}>
              <Heading lineHeight={"120%"} size="2xl">Send personalized product decks in minutes.</Heading>
              <AspectRatio width={["100px", "500px", "800px"]} ratio={16 / 9}>
                <iframe src="https://www.youtube.com/embed/xtDRVMaaP_4" title="Sip Decks Demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
              </AspectRatio>
              <Spacer />
              <HStack>
                <Input placeholder="Enter your email" size="lg" w="300px" />
                <Button size="lg" colorScheme={"green"} w="200px" onClick={onClick}>Request a Demo</Button>
              </HStack>
            </VStack>
          </Center>
        </Box>
        <Box mt="20" bg="gray.50" mb="0">
          <VStack margin="30" mb="0" pt="50" pb="50" align="center" textAlign={"center"} ml="5">
          <Heading>Handpick products from your vendors</Heading>
          <Heading>Personalize them in seconds</Heading>
          <Heading>Share entire promotion product decks in minutes, not hours</Heading>
          <Heading size="lg">Handpick, personalize, and share promotional product pitch decks in minutes.</Heading>

            <Heading size="lg">Focus on building strong relationships and closing more deals.</Heading>
          </VStack>
        </Box>
      </Box>
    </ChakraBaseProvider>
  );
}

export default Landing;
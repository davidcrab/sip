import {
  Box,
  Card,
  CardBody,
  Heading,
  HStack,
  Image,
  Spacer,
  UnorderedList,
  ListItem,
  VStack,
  Text,
  ChakraProvider,
  theme,
  Stack,
  Wrap, 
  WrapItem,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
  AccordionButton,
  Divider,
  Center,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,

} from "@chakra-ui/react";
import React from "react";
import { doc, getFirestore } from 'firebase/firestore';
import { FirestoreProvider, useFirestoreDocData, useFirestore, useFirebaseApp } from 'reactfire';
import { Link, useParams, useLocation } from "react-router-dom";
import trackPathForAnalytics from '../TrackPathForAnalytics';
import { useCallback, useEffect } from 'react';
import ContactCard from "../components/ContactCard";

const DeckHeader = (data) => {
  console.log("Header", data)
  return (
    <Box m="0">
      <VStack justify="center" m="0">
        <HStack w={"95%"} m="5">
          <Heading size="xl">{data.data}</Heading>
          <Spacer />
          <Popover>
            <PopoverTrigger>
              <Button>Contact Me</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Contact Me!</PopoverHeader>
              <PopoverBody><ContactCard props={data.props} /></PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
       
      </VStack>
    </Box>
  )
}

const Product = (product) => {
  const descriptions = product.product.descriptions.split('-')
  descriptions.shift()

  // if the product id is in the product name string, remove it
  if (product.product.name.includes(product.product.id)) {
    product.product.name = product.product.name.replace(product.product.id, "")
    // remove the - 
    console.log(product.product.name)
    product.product.name = product.product.name.replace("-", "")
  }

  const prices = product.product.pricing.split('-')
  prices.shift()

  return (
    <Card maxW='400' minW="sm" minH="sm"  bg="white" variant={"filled"} borderRadius='xl'>
      <CardBody align="center" w="full">
        <Image
          // if the product has a customImage, use that, otherwise use the image
          src={product.product.customImage ? product.product.customImage : product.product.image}
          alt='Product Name'
          borderRadius='lg'
          objectFit='cover'
          h='200px'
          align="center"
        />
        <Stack align="left" justify="left" textAlign="left" mt='6' spacing='10'>
          <Heading size='md'>{product.product.name}</Heading>
          <HStack mt="10" justify={"center"}>
            <Accordion allowMultiple border={"hidden"}>
              <AccordionItem border={"hidden"}>
                <h2 border={"hidden"}>
                  <AccordionButton border={"hidden"}>
                    <Box as="span" flex='1' textAlign='left'>
                      Description
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel bg="white">
                  <UnorderedList spacing={3}>
                    {descriptions.map(description => (
                      <ListItem ml="4"><Text fontSize={"sm"}>{description}</Text></ListItem>
                    ))}
                  </UnorderedList> 
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Accordion allowMultiple border={"hidden"}>
              <AccordionItem border={"hidden"}>
                <h2 border={"hidden"}>
                  <AccordionButton border={"hidden"}>
                    <Box as="span" flex='1' textAlign='left'>
                      Price
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel bg="white">
                {prices.map(price => (
                  <Text m="4" color='blue.600' fontSize='2xl'>{price}</Text>
                ))}
                  {/* <UnorderedList spacing={3}>
                    {descriptions.map(description => (
                      <ListItem ml="4"><Text fontSize={"sm"}>{description}</Text></ListItem>
                    ))}
                  </UnorderedList>  */}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </HStack>
          {/* {prices.map(price => (
            <Text m="4" color='blue.600' fontSize='2xl'>{price}</Text>
          ))} */}
        </Stack>
      </CardBody>
    </Card>
  )
}

const SalesDeck = () => {
  const { id: projectId } = useParams();

  // easily access the Firestore library
  const deckRef = doc(useFirestore(), 'decks', projectId);

  // subscribe to a document for realtime updates. just one line!
  const { status, data } = useFirestoreDocData(deckRef);

  // easily check the loading status
  if (status === 'loading') {
    return <p>Fetching products...</p>;
  }
  let productsArray = Object.values(data.products)
  productsArray.sort((a, b) => (a.index > b.index) ? 1 : -1)

  const ImageBox = () => {
    let images = productsArray.map(product => {
      // if product.customImage exists, use that, otherwise use the product.image
      return product.customImage ? product.customImage : product.image
    })
    // for each image in the images array, create an image with the height and width of the random size
    let imagesArray = images.map(image => {
      // generate a random size for the image
      let sizes = Math.floor(Math.random() * 175) + 90

      return <Image src={image} w={sizes} h={sizes} />
    })

    return (
      <Center>
        <Box w="85%" bg="white" p="20" borderRadius="lg" overflow={'auto'}>
          <HStack align="flex" justify="space-around" w="full">
            {imagesArray}
          </HStack>
        </Box>
      </Center>
    )
  }
  


    /*

    */

  //   return (
  //     <Center>
  //       <Box w="85%" bg="white" p="20" borderRadius="lg">
  //         <HStack align="flex" justify="space-around" w="full">
  //           <Image src={images[0]} w="200px" h="200px" />
  //           <Image src={images[1]} w="125px" h="125px" />
  //           <Image src={images[2]} w="75px" h="75px" />
  //           <Image src={images[3]} w="250px" h="250px" />
  //           <Image src={images[4]} w="175px" h="175px" />
  //           <Image src={images[5]} borderRadius="" w="100px" h="100px" />
  //         </HStack>
  //       </Box>
  //     </Center>
  //   )
  // }



  return (
    <Box margin="" h="100%" bg="#f8f8f8">
      <DeckHeader data={data.name} date={data.date} props={data.userId} />
      <ImageBox />
      <Wrap spacing="30px" justify="center" align="center" p="10" bg="#f8f8f8">
        {productsArray.map((productMap, index) => (
          <WrapItem>
            <Product product={productMap} key={index} />
          </WrapItem>
        ))}
      </Wrap>
      <ContactCard props={data.userId} mb="100px"/>
    </Box>
  )
}

const DeckPage = () => {
  const firestoreInstance = getFirestore(useFirebaseApp());

  const { pathname, search } = useLocation();

  const analytics = useCallback(() => {
      trackPathForAnalytics({ path: pathname, search: search, title: pathname.split("/")[1] });
  }, [pathname, search]);

  useEffect(() => {
      analytics();
  }, [analytics]);

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <ChakraProvider theme={theme}>
          <SalesDeck bg="#f8f8f8"/>
      </ChakraProvider>
    </FirestoreProvider>
  );
}

export default DeckPage;
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
import ProductCarousel from '../components/ProductCarousel';


const DeckHeader = (data) => {
  console.log("Header", data)
  return (
    <Box m="0">
      <VStack justify="center" m="0">
        <HStack w={"95%"} m="5">
          <Heading>Let's discover your perfect merchandise, together.</Heading>
          {/* <Heading size="xl">{data.data}</Heading> */}
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

  return (
    <Box margin="" h="100%" bg="#f8f8f8">
      <DeckHeader data={data.name} date={data.date} props={data.userId} />
      <ProductCarousel products={productsArray} />
      <ContactCard personalNote={data.personalNote} props={data.userId}/>
      <Wrap spacing="30px" justify="center" align="center" p="10" bg="#f8f8f8">
        {productsArray.map((productMap, index) => (
          <WrapItem>
            <Product product={productMap} key={index} />
          </WrapItem>
        ))}
      </Wrap>
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
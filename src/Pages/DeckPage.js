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
  Button,
  Stack,
  Wrap, 
  WrapItem,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
  AccordionButton,
  Divider
} from "@chakra-ui/react";
import React from "react";
import ExampleProductImage from "../unnamed.jpg";
import { doc, getFirestore } from 'firebase/firestore';
import { FirestoreProvider, useFirestoreDocData, useFirestore, useFirebaseApp } from 'reactfire';
import { Link, useParams } from "react-router-dom";
import Example from "./Example.png"
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";

const DeckHeader = (data) => {
  console.log("Header", data)
  return (
    <Box m="0" bg="gray.50">
      <VStack justify="center" m="0">
        <HStack w={"95%"} m="5">
          <Heading size="xl">{data.data}</Heading>
          <Spacer />
          <Stack direction='row' spacing={4}>
            {/* <Button leftIcon={<EmailIcon />} colorScheme='teal' variant='solid'>
              Email Ryan
            </Button>
            <Button leftIco={<PhoneIcon />} colorScheme='teal' variant='outline'>
              443-852-4722
            </Button> */}
          </Stack>
        </HStack>
        <Divider />
      </VStack>
    </Box>
  )
}

const DeckFooter = (data) => {
  return (
    <VStack>
      <Heading size="sm">Prepared by</Heading>
      <Spacer />
      <Heading size="lg">G&G Outfitters, Inc</Heading>
      <Heading size="xs">{data.date}</Heading>
    </VStack>
  )
}

const Product = (product) => {
  const descriptions = product.product.descriptions.split('-')
  descriptions.shift()

  return (
    <Card maxW='400' minW="sm" minH="sm" variant={"elevated"}>
      <CardBody align="center" w="full">
        <Image
          src={product.product.image}
          alt='Product Name'
          borderRadius='lg'
          objectFit='cover'
          h='200px'
          align="center"
        />
        <Stack align="left" justify="left" textAlign="left" mt='6' spacing='3'>
          <Heading size='md'>{product.product.name}</Heading>
          <Accordion allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex='1' textAlign='left'>
                    Description
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
              <UnorderedList spacing={3}>
                {descriptions.map(description => (
                  <ListItem ml="4"><Text fontSize={"sm"}>{description}</Text></ListItem>
                ))}
              </UnorderedList> 
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Text color='blue.600' fontSize='2xl'>{product.product.pricing}</Text>

        </Stack>
      </CardBody>
    </Card>
  )
}

const SalesDeck = () => {
  const { id: projectId } = useParams();

  // easily access the Firestore library
  const burritoRef = doc(useFirestore(), 'decks', projectId);

  // subscribe to a document for realtime updates. just one line!
  const { status, data } = useFirestoreDocData(burritoRef);

  // easily check the loading status
  if (status === 'loading') {
    return <p>Fetching products...</p>;
  }

  // map through the products 
  console.log(data)

  return (
    <Box margin="0" h="full">
      <DeckHeader data={data.name} date={data.date} />
      <Wrap spacing="30px" justify="center" align="center" p="10">
        {Object.values(data.products).map((productMap, index) => (
          <WrapItem>
            <Product product={productMap} key={index} />
          </WrapItem>
        ))}
      </Wrap>
       <DeckFooter date={data.date}/>
    </Box>
  )
}

const DeckPage = () => {
  const firestoreInstance = getFirestore(useFirebaseApp());

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <ChakraProvider theme={theme}>
          <SalesDeck height="100%" />
      </ChakraProvider>
    </FirestoreProvider>

  );
}

export default DeckPage;
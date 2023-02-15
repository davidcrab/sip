import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Image,
  Spacer,
  UnorderedList,
  ListItem,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  ChakraProvider,
  theme,
  Button,
  Stack
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
    <Box h="200" m="0">
      <VStack justify="center" m="0">
        <HStack w={"95%"} m="5">
          <Heading size="3xl">{data.data}</Heading>
          <Spacer />
          <Stack direction='row' spacing={4}>
            <Button leftIcon={<EmailIcon />} colorScheme='teal' variant='solid'>
              Email Ryan
            </Button>
            <Button leftIco={<PhoneIcon />} colorScheme='teal' variant='outline'>
              443-852-4722
            </Button>
          </Stack>
        </HStack>
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

  console.log("Product", product)

  return (
    <Card h="400" m="10" variant={"outline"}>
      {/* <CardHeader>
        <Heading>{product.product.name}</Heading>
      </CardHeader> */}
      <CardBody>
        <HStack align="start">
          <VStack>
            <Heading>{product.product.name}</Heading>
            <VStack pl="10">
              <Spacer />
              <UnorderedList spacing={3}>
                {product.product.descriptions.map(description => (
                  <ListItem><Heading size={"md"}>{description}</Heading></ListItem>
                ))}
              </UnorderedList>
            </VStack>
            <Spacer />
            <VStack>
              {/* <Heading size="md">Price</Heading> */}
              <Spacer />
              <TableContainer>
                <Table variant='simple'>
                  <Thead>
                    <Tr>
                      <Th>Quantity</Th>
                      <Th isNumeric>Price</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                  {Object.values(product.product.pricing).map((price, index) => (
                    <Tr>
                      <Td>{price.quantity}</Td>
                      <Td isNumeric>{price.price}</Td>
                    </Tr>
                  ))}
                    {/* {product.product.pricing.map(price => (
                    <Tr>
                      <Td>{price.quantity}</Td>
                      <Td isNumeric>{price.price}</Td>
                    </Tr>
                    ))} */}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          </VStack>
          <Spacer />
          <Image src={product.product.image} />
        </HStack>
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
    return <p>Fetching burrito flavor...</p>;
  }

  // map through the products 
  console.log(data)

  return (
    <Box margin="0">
      <DeckHeader data={data.name} date={data.date} />
      {Object.values(data.products).map((productMap, index) => (
        <Product product={productMap} key={index} />
      ))}
      {/* {Object.entries(data.products).map(([key, value]) => {
        <Product product={value} />
      })}
      {data.products.map(product => (
        <Product product={product} />
       ))} */}
       <DeckFooter date={data.date}/>
    </Box>
  )
}

const DeckPage = () => {
  const firestoreInstance = getFirestore(useFirebaseApp());

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <ChakraProvider theme={theme}>
          <SalesDeck />
      </ChakraProvider>
    </FirestoreProvider>

  );
}

export default DeckPage;
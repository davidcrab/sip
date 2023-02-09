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
  theme
} from "@chakra-ui/react";
import React from "react";
import ExampleProductImage from "../unnamed.jpg";
import { doc, getFirestore } from 'firebase/firestore';
import { FirestoreProvider, useFirestoreDocData, useFirestore, useFirebaseApp } from 'reactfire';
import { Link, useParams } from "react-router-dom";


const DeckHeader = (data) => {
  console.log("Header", data)
  return (
    <Box h="200" mt="20">
      <VStack justify="center">
        <Heading size="3xl">{data.data}</Heading>
        <Heading size="sm">Prepared by</Heading>
        <Spacer />
        <Heading size="lg">G&G Outfitters, Inc</Heading>
        <Heading size="xs">{data.date}</Heading>
      </VStack>
    </Box>
  )
}

const Product = (product) => {

  console.log("Product", product)

  return (
    <Card h="600" mt="20" variant={"outline"}>
      <CardHeader>
        <Heading>{product.product.name}</Heading>
      </CardHeader>
      <CardBody>
        <HStack align="center" justify={"space-between"}>
          <Image src={product.product.image} />
          <Spacer />
          <VStack>
            <Heading>About</Heading>
            <UnorderedList spacing={3}>
              {product.product.descriptions.map(description => (
                <ListItem><Heading size={"md"}>{description}</Heading></ListItem>
              ))}
            </UnorderedList>
          </VStack>
          <Spacer />
          <VStack>
            <Heading>Price</Heading>
            <TableContainer>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>Quantity</Th>
                    <Th isNumeric>Price</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {product.product.pricing.map(price => (
                  <Tr>
                    <Td>{price.quantity}</Td>
                    <Td isNumeric>{price.price}</Td>
                  </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </VStack>
          <Spacer />
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

  return (
    <Box margin="10">
      <DeckHeader data={data.name} date={data.date} />
      {data.products.map(product => (
        <Product product={product} />
      ))}
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
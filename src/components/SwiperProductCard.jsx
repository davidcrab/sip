import React from 'react';
import { Heading, Text, Box, Image, Flex, Card, CardHeader, CardBody, HStack, VStack, Spacer } from '@chakra-ui/react';

const FocusSwiperProductCard = ({ product }) => {
  /*
  background color as prop 
  image - rounded corners
  product name 
  one setence deiscription
  */
  console.log(product)
  return (
    <Card maxW='400' minW="sm" minH="sm"  variant={"filled"} borderRadius='xl' bg="purple.100">
      <CardBody align="center">
        <Image
          src={product.customImage ? product.customImage : product.image}
          alt='Product Name'
          borderRadius='lg'
          objectFit='cover'
          h='300px'
          align="center"
        />
        <VStack mt="4" align="left" justify={"left"} textAlign="left" w="full">
          <Heading as='h3' size='md'>{product.name}</Heading>
          <Text>One sentence describing the product</Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

const SwiperProductCard = ({ product }) => {
  /*
  background color as prop 
  image - rounded corners
  product name 
  one setence deiscription
  */
  console.log(product)
    return (
      <Card maxW='300' minW="sm" minH="sm" maxH="350px" variant={"filled"} borderRadius='xl' bg="purple.100">
        <CardBody align="center">
          <Image
            src={product.customImage ? product.customImage : product.image}
            alt='Product Name'
            borderRadius='lg'
            objectFit='cover'
            h='250px'
            align="center"
          />
          <VStack mt="4" align="left" justify={"left"} textAlign="left" w="full">
            <Heading as='h3' size='md'>{product.name}</Heading>
            <Text>One sentence describing the product</Text>
          </VStack>
        </CardBody>
      </Card>
    );
};

export { SwiperProductCard, FocusSwiperProductCard };

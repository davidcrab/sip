import React from 'react';
import { Heading, Image, Card, CardBody, VStack } from '@chakra-ui/react';

const FocusSwiperProductCard = ({ product }) => {
  return (
    <Card maxW='400px' minW={['300px', '300px', '450px']} minH="sm"  variant={"filled"} borderRadius='xl' bg="gray.150">
      <CardBody align="center">
        <Image
          src={product.customImage ? product.customImage : product.image}
          alt='Product Name'
          borderRadius='lg'
          objectFit='cover'
          h={['200px', '250px', '350px']}
          align="center"
        />
        <VStack mt="4" align="left" justify={"left"} textAlign="left" w="full">
          <Heading as='h3' size='md'>{product.name}</Heading>
        </VStack>
      </CardBody>
    </Card>
  );
};

const SwiperProductCard = ({ product }) => {
    return (
      <Card maxW='300px' minW={['300px', '300px', '300px']} maxH={['100px', '350px', "600px"]} variant={"filled"} borderRadius='xl' bg="gray.100">
        <CardBody align="center">
          <Image
            src={product.customImage ? product.customImage : product.image}
            alt='Product Name'
            borderRadius='lg'
            objectFit='cover'
            h={['100px', '150px', '200px']}
            align="center"
          />
          <VStack mt="4" align="left" justify={"left"} textAlign="left" w="full">
            <Heading as='h3' size='md'>{product.name}</Heading>
          </VStack>
        </CardBody>
      </Card>
    );
};

export { SwiperProductCard, FocusSwiperProductCard };

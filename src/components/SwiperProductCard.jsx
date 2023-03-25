import React from 'react';
import { Heading, Image, Card, CardBody, VStack } from '@chakra-ui/react';

const FocusSwiperProductCard = ({ product }) => {
  return (
    <Card maxW='400' minW={['100px', '150px', '200px']} minH="sm"  variant={"filled"} borderRadius='xl' bg="purple.100" borderColor="purple.200" borderWidth={"2px"}>
      <CardBody align="center">
        <Image
          src={product.customImage ? product.customImage : product.image}
          alt='Product Name'
          borderRadius='lg'
          objectFit='cover'
          h={['200px', '250px', '250px']}
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
      <Card maxW='300' minW={['100px', '150px', '150px']} maxH={['100px', '350px', "350px"]} variant={"filled"} borderRadius='xl' bg="purple.50" borderColor="purple.100" borderWidth={"2px"}>
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

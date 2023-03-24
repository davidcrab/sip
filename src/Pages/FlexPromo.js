import { Box, Center, Heading, Stack, Input, InputGroup, InputLeftElement, Text, Divider, VStack, Spacer} from '@chakra-ui/react';
import React from 'react';
import { Search2Icon } from '@chakra-ui/icons';

import ProductCarousel from '../components/ProductCarousel';


const FlexPromo = () => {

    const data = [
      { 
        name: 'Design Projects 1'
      },
      {
        name: 'Design Projects 2'
      },
      {
        name: 'Design Projects 3'
      }
    ]

    return (
      <Box m="8">
      <ProductCarousel products={data}/>
      </Box>
    );
      // <Box m="8">
      //   <Carousel data={data} />
      //   <VStack align="left" spacing={10}> 
      //     <Text
      //       bgGradient='linear(to-r, #FFD700, #FF0080)'
      //       bgClip='text'
      //       fontSize='6xl'
      //       fontWeight='extrabold'
      //       letterSpacing={'.1rem'}
      //       lineHeight='1.2'
      //     >
      //       Welcome to <Text>flexpromo search</Text>
      //     </Text>
      //     <Heading color="gray">A modern search engine for the entire promotional product industry.</Heading>
      //   <Center>
          
      //     <VStack color='gray' spacing={5}>
      //     <Stack spacing={4} w="100%">
      //       <InputGroup>
      //         <InputLeftElement
      //           pointerEvents='none'
      //           children={<Search2Icon color='gray.300' />}
      //         />
      //         <Input type='tel' placeholder='Search thousands of products' />
      //       </InputGroup>
      //     </Stack>
      //     <Heading color='#fca525'>Coming Soon</Heading>
      //     <Text>Email davidcrabtree@startupshell.org to join the learn more.</Text>
      //       <Spacer />
      //       <Heading size="lg" color='#fca525'>Distributors</Heading>
      //       <Heading size="md">Search thousands of products across hundreds of vendors with lighting speeding.</Heading>
      //       <Heading size="lg" color='#fca525'>Suppliers</Heading>
      //       <Heading size="md">Out of the box analytics to understand interactions with your product data.</Heading>
      //       <Heading size="lg" color='#fca525'>Developers</Heading>
      //       <Heading size="md">A modern search API for accessing product data from the industry's leading suppliers.</Heading>
      //     </VStack>
      //   </Center>
      //   </VStack>
      // </Box>
  //)
}

export default FlexPromo;
import React, { useState } from 'react';
import { Heading, VStack, Box, Button, Center, HStack } from '@chakra-ui/react';
import { FocusSwiperProductCard, SwiperProductCard } from './SwiperProductCard';

/*
this should be include three product cards, and two buttons to navigate between them
*/

const ProductCarousel = (products) => {
  /* 
  have one SwiperProductCard centered. iterate through the products and have the other two cards on the left and right side of the centered card
  */

  const [currentProduct, setCurrentProduct] = useState(0);

  const nextProduct = () => {
     setCurrentProduct(currentProduct === products.products.length - 1 ? 0 : currentProduct + 1);
  };

  const prevProduct = () => {
    setCurrentProduct(currentProduct === 0 ? products.products.length - 1 : currentProduct - 1);
  };
  console.log(products)

  /*
  Not that this feels weird right now. clicking next 
  */

  return (
    <Box m="8">
      <Center>
        <HStack align="space-between" justify={"space-between"} w="full">
          {/* display a last product card when the current product is zero. display the prev when its not zero */}
          {currentProduct === 0 && <SwiperProductCard product={products.products[products.products.length - 1]} />}
          {currentProduct !== 0 && <SwiperProductCard product={products.products[currentProduct - 1]} />}
          {/* display the current product card */}
          <HStack>
            <Button onClick={prevProduct}>Back</Button>
            <FocusSwiperProductCard product={products.products[currentProduct]} />
            <Button onClick={nextProduct}>Next</Button>
          </HStack>
          {/* display a first product card when the current product is the last product. display the next when its not the last product */}
          {currentProduct === products.products.length - 1 && <SwiperProductCard product={products.products[0]} />}
          {currentProduct !== products.products.length - 1 && <SwiperProductCard product={products.products[currentProduct + 1]} />}

        </HStack>
        
        {/* <HStack>
          <Button onClick={prevProduct}>Left</Button>
          <SwiperProductCard product={products.products[currentProduct]} />
          <Button onClick={nextProduct}>Right</Button>
        </HStack> */}
      </Center>
    </Box>
  );
};

export default ProductCarousel;

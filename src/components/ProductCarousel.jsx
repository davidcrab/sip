import React, { useState } from 'react';
import { Box, Button, Center, HStack } from '@chakra-ui/react';
import { FocusSwiperProductCard, SwiperProductCard } from './SwiperProductCard';

const ProductCarousel = (products) => {
  const [currentProduct, setCurrentProduct] = useState(0);

  const nextProduct = () => {
     setCurrentProduct(currentProduct === products.products.length - 1 ? 0 : currentProduct + 1);
  };

  const prevProduct = () => {
    setCurrentProduct(currentProduct === 0 ? products.products.length - 1 : currentProduct - 1);
  };

  return (
    <Center>
    <Box m="8">
     
        <HStack align="space-between" justify={"space-between"} w="full">
          {/* display a last product card when the current product is zero. display the prev when its not zero */}
          {/* Should only display this when the screen size is md or larger */}
          <Box display={{ base: "none", lg: "block" }}>
            {currentProduct === 0 && <SwiperProductCard product={products.products[products.products.length - 1]} />}
            {currentProduct !== 0 && <SwiperProductCard product={products.products[currentProduct - 1]} />}
          </Box>
          {/* display the current product card */}
          <HStack>
            <Button onClick={prevProduct}>Back</Button>
            <FocusSwiperProductCard product={products.products[currentProduct]} />
            <Button onClick={nextProduct}>Next</Button>
          </HStack>
        
          <Box display={{ base: "none", md: "block" }}>
            {/* display a first product card when the current product is the last product. display the next when its not the last product */}
            {currentProduct === products.products.length - 1 && <SwiperProductCard product={products.products[0]} />}
            {currentProduct !== products.products.length - 1 && <SwiperProductCard product={products.products[currentProduct + 1]} />}
          </Box>
        </HStack>
    </Box>
    </Center>
  );
};

export default ProductCarousel;

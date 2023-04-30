import { 
  Heading,
  Box,
  Card,
  CardHeader,
  CardBody,
  Image,
  Center,
  UnorderedList,
  ListItem,
  HStack,
  VStack,
  Spacer,
} from '@chakra-ui/react'
import FloatingAddButton from './DeckEditor/FloatingButton'

const ProductDetails = ({ product }) => {

  console.log("Product from the product details page", product)

  return (
    <VStack h="full">
      <Heading as="h4" size="lg">
        {product.name}
      </Heading>
      <Spacer />
      <UnorderedList pl="10px">
        {product.descriptions.map((description) => {
          return ( 
            <div>
              <ListItem>{description}</ListItem>
            </div>
          )
        })}
      </UnorderedList>
      <UnorderedList pl="10px">
        {product.pricing && product.pricing.map((price) => {
          return ( 
            <div>
              <ListItem>{price}</ListItem>
            </div>
          )
        })}
      </UnorderedList>
    </VStack>
  )
}

const DisplayProductLeft = ({ product }) => {

  let displayArray = []
  for (let i = 0; i < product.images.length; i++) {
    if (product.images[i].includes("show/50") || product.images[i].includes("show/100")) {
    }
    else {
      displayArray.push(product.images[i])
    }
  }

  return (
    <Box w="85%" ml="8%" mr="8%" p={4} borderWidth="1px" borderRadius="lg" overflow="hidden" mb="20">
      <HStack>
        <Image h="300px" src={product.customImage ? product.customImage : product.image} rounded="2xl" />
        <Spacer />
        <Box display={["none", "block", "block"]}>
          <ProductDetails product={product} />
        </Box>
        <Spacer />
        {/* map the images array and display each image */}
      </HStack>
      <Box display={["block", "none", "none"]}>
        <ProductDetails product={product} />
      </Box>
      {/* <HStack overflow="auto">
        {displayArray.map((image) => {
          return (
            <Image h="200px" src={image} rounded="2xl" />
          )
        })}
      </HStack> */}
      {/* <FloatingAddButton product={product} /> */}
    </Box>
  )
}

const DisplayProductRight = ({ product }) => {
  return (
    <Box w="85%" ml="8%" mr="8%" p={4} borderWidth="1px" borderRadius="lg" overflow="hidden" mb="20">
      <HStack h="full">
        <VStack h="full">
          <Heading as="h4" size="lg">
            {product.name}
          </Heading>
          <Spacer />
          <UnorderedList>
            {product.descriptions.map((description) => {
              return ( 
                <div>
                  <ListItem>{description}</ListItem>
                </div>
              )
            })}
          </UnorderedList>
        </VStack>
        <Spacer />
        <Image h="300px" src={product.customImage ? product.customImage : product.image} rounded="2xl" />
      </HStack>
    </Box>
  )
}

const DisplayProductsRow = ({ products }) => {
  /* 
  Map through products and display each row. alterate between left and right
  */
  return (
    <Box>
      {products.map((product, index) => {
        if (index % 2 === 0) {
          return <DisplayProductLeft product={product} />
        } else {
          return <DisplayProductLeft product={product} />
        }
      })}
    </Box>
  )
}

// export default { DisplayProductsRow, DisplayProductLeft, DisplayProductRight }
export default DisplayProductsRow
/*
Export the following:
DisplayProductLeft
  DisplayProductsRow  
DisplayProductRight
  DisplayProductsRow
*/
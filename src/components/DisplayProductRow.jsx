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
        <VStack h="full" align={"flex-start"} center="flex-start">
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
        {/* map the images array and display each image */}
      </HStack>
      {/* <HStack overflow="auto">
        {displayArray.map((image) => {
          return (
            <Image h="200px" src={image} rounded="2xl" />
          )
        })}
      </HStack> */}
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

export default DisplayProductsRow
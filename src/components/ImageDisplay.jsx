
import { HStack, Image } from "@chakra-ui/react"

const ImagesDisplay = ({ products }) => {

  let images = []
  for (let i = 0; i < products.length; i++) {
    if (products[i].customImage) {
      images.push(products[i].customImage)
    }
    else {
      images.push(products[i].image)
    }
  //  // add products[i].image to images array
  //   images.push(products[i].image)
  //   // add products[i].customImage to images array
  //   images.push(products[i].customImage)
  }

  /* Return a Grid of images 
        {index % 2 === 0 ? <Image key={index} src={image} /> : <Image key={index} src={image} pt="200px"/>}

  */
  return (
    <>
    <HStack bg="white" overflow="hidden" align="center" justify="center" h="300" p="20px" spacing="250px">
      {images.map((image, index) => {
        if (index % 2 === 0) {
          return (
            <Image w="250px" key={index} src={image} boxShadow='lg'/>
          )
        }
      })}
    </HStack>
    <HStack mt="0" bg="white" overflow="hidden" align="center" justify="center" h="300" p="20" spacing="250px" pl="550px">
      {images.map((image, index) => {
        if (index % 2 !== 0) {
          return (
            <Image w="250px" key={index} src={image}  boxShadow='lg'/>
          )
        }
      })}
    </HStack>
    </>

  )
}

export default ImagesDisplay
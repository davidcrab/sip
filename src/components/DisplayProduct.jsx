import { 
  Heading,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
  Image,
  Center,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react'

const DisplayProduct = ({ product }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  let descriptions = product.descriptions
  console.log(descriptions)
  return (
    <>
      <Card onClick={onOpen}>
        <CardHeader>
          {product.name}
        </CardHeader>
        <CardBody>
          <Image src={product.image} />
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{product.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Image src={product.image} />
            </Center>
              <Heading as="h2" size="lg">About</Heading>
              <UnorderedList>
                {descriptions.map((description) => {
                  return ( 
                    <div>
                      <ListItem>{description}</ListItem>
                    </div>
                  )
                })}
              </UnorderedList>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DisplayProduct
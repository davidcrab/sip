import {
  Box,
  Card,
  CardBody,
  Heading,
  HStack,
  Image,
  Spacer,
  UnorderedList,
  ListItem,
  VStack,
  Text,
  ChakraProvider,
  theme,
  Stack,
  Wrap,
  WrapItem,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
  AccordionButton,
  Flex,
  Divider,
  Center,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import React from 'react';
import { doc, getFirestore, query, collection, where } from 'firebase/firestore';
import {
  FirestoreProvider,
  useFirestoreDocData,
  useFirestore,
  useFirebaseApp,
  useFirestoreCollectionData,
} from 'reactfire';
import { Link, useParams, useLocation } from 'react-router-dom';
import trackPathForAnalytics from '../TrackPathForAnalytics';
import { useCallback, useEffect } from 'react';
import ContactCard from '../components/ContactCard';
import ProductCarousel from '../components/ProductCarousel';
import DisplayProduct from '../components/DisplayProduct';
import DisplayProductsRow from '../components/DisplayProductRow';
import ImagesDisplay from '../components/ImageDisplay';

const DeckHeader = data => {
  console.log('Header', data);
  /*have the header be sticky */
  return (
    <Box m="0" position="sticky" top="0" zIndex="sticky" bg="#11284a" color="white">
        {/* <Image ml="85%" w="100px" src={"https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1495074912/n7q6etrr2svn5tkqn1zu.jpg"} /> */}
        <Flex p="8" pt="0" pb="0" align="center">
          <Heading>{data.data}</Heading>
          <Spacer />
          <Image w="100px" src={data.clientLogo} alt="cleint logo" />
        </Flex>
    </Box>
  );
};

const Product = product => {
  const descriptions = product.product.descriptions.split('-');
  descriptions.shift();

  // if the product id is in the product name string, remove it
  if (product.product.name.includes(product.product.id)) {
    product.product.name = product.product.name.replace(product.product.id, '');
    // remove the -
    console.log(product.product.name);
    product.product.name = product.product.name.replace('-', '');
  }

  const prices = product.product.pricing.split('-');
  prices.shift();

  return (
    <Card
      maxW="400"
      minW="sm"
      minH="sm"
      bg="white"
      variant={'filled'}
      borderRadius="xl"
    >
      <CardBody align="center" w="full">
        <Image
          // if the product has a customImage, use that, otherwise use the image
          src={
            product.product.customImage
              ? product.product.customImage
              : product.product.image
          }
          alt="Product Name"
          borderRadius="lg"
          objectFit="cover"
          h="200px"
          align="center"
        />
        <Stack align="left" justify="left" textAlign="left" mt="6" spacing="10">
          <Heading size="md">{product.product.name}</Heading>
          <HStack mt="10" justify={'center'}>
            <Accordion allowMultiple border={'hidden'}>
              <AccordionItem border={'hidden'}>
                <h2 border={'hidden'}>
                  <AccordionButton border={'hidden'}>
                    <Box as="span" flex="1" textAlign="left">
                      Description
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel bg="white">
                  <UnorderedList spacing={3}>
                    {descriptions.map(description => (
                      <ListItem ml="4">
                        <Text fontSize={'sm'}>{description}</Text>
                      </ListItem>
                    ))}
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Accordion allowMultiple border={'hidden'}>
              <AccordionItem border={'hidden'}>
                <h2 border={'hidden'}>
                  <AccordionButton border={'hidden'}>
                    <Box as="span" flex="1" textAlign="left">
                      Price
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel bg="white">
                  {prices.map(price => (
                    <Text m="4" color="blue.600" fontSize="2xl">
                      {price}
                    </Text>
                  ))}
                  {/* <UnorderedList spacing={3}>
                    {descriptions.map(description => (
                      <ListItem ml="4"><Text fontSize={"sm"}>{description}</Text></ListItem>
                    ))}
                  </UnorderedList>  */}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </HStack>
          {/* {prices.map(price => (
            <Text m="4" color='blue.600' fontSize='2xl'>{price}</Text>
          ))} */}
        </Stack>
      </CardBody>
    </Card>
  );
};

const SalesDeck = ({ demoDeck }) => {
  var { id: projectId } = useParams();
  if (demoDeck) {
    console.log(demoDeck)
    projectId = demoDeck;
  }

  const [ version, setVersion] = React.useState('1.1');

  // easily access the Firestore library
  const deckRef = doc(useFirestore(), 'decks', projectId);

  // subscribe to a document for realtime updates. just one line!
  const { status, data } = useFirestoreDocData(deckRef);

  // if the userId, then this is me and I should have admin permission to view all ve2Q2aQj2ga4YJGcSwuvkSUi4R73
  let productsQuery = query(collection(useFirestore(), "showcaseProduct"), where("deckId", "==", projectId));
  const { status: productsStatus, data: products } = useFirestoreCollectionData(productsQuery, { idField: "id" })

  // filter out with an inactive status
  products?.filter(product => product.status !== 'inactive');
  

  // easily check the loading status
  if (status === 'loading' || productsStatus === 'loading') {
    return <p>Fetching products...</p>;
  }
  
  let productsArray = [];
  if (data.version !== '1.1') {
    productsArray = Object.values(data.products);
    productsArray.sort((a, b) => (a.index > b.index ? 1 : -1));
  } else {
    productsArray = products;
    
  }

  // i need to query the products colle

  return (
    <Box margin="" h="100%" bg="#f8f8f8">
      <DeckHeader data={data.name} tagline={data.tagline} date={data.date} props={data.userId} clientLogo={data.clientLogo} />
      {/* <ImagesDisplay products={productsArray} /> */}
      
      <ProductCarousel products={productsArray} />
      <Spacer mt="75px"/>
      <ContactCard personalNote={data.personalNote} props={data.userId} color={data.color} />
      <Spacer mt="75px"/>
      {data.version === '1.1' &&  <DisplayProductsRow products={productsArray} />}
      {data.version === '1.0' && <Wrap spacing="30px" justify="center" align="center" p="10" bg="#f8f8f8">
        {productsArray.map((productMap, index) => (
          <WrapItem>
            <Product product={productMap} key={index} />
          </WrapItem>
        ))}
      </Wrap>}
      {/* <Wrap spacing="30px" justify="center" align="center" p="10" bg="#f8f8f8">
        {productsArray.map((productMap, index) => (
          <WrapItem>
            {data.version === '1.1' ? <DisplayProduct product={productMap} key={index} /> : <Product product={productMap} key={index} />}
          </WrapItem>
        ))}
      </Wrap> */}
    </Box>
  );
};

const DeckPage = ( { demoDeck } ) => {
  const firestoreInstance = getFirestore(useFirebaseApp());

  const { pathname, search } = useLocation();

  const analytics = useCallback(() => {
    trackPathForAnalytics({
      path: pathname,
      search: search,
      title: pathname.split('/')[1],
    });
  }, [pathname, search]);

  useEffect(() => {
    analytics();
  }, [analytics]);

  console.log(demoDeck)
  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <ChakraProvider theme={theme}>
        <SalesDeck bg="#f8f8f8" demoDeck={demoDeck} />
      </ChakraProvider>
    </FirestoreProvider>
  );
};

export default DeckPage;

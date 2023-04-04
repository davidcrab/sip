import {
  Box,
  Card,
  CardHeader,
  Image,
  Heading,
  SimpleGrid,
  Text,
  CardBody,
  Center,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  CardFooter,
  Button,
  TableContainer,
  Divider,
  Spacer
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import {
  InstantSearch,
  connectSearchBox,
  Stats,
  connectHits,
} from 'react-instantsearch-dom';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'LAcUvEIYXTSmVpuCCEOVXDYlFenRtfbm', // Be sure to use a Search API Key
    nodes: [
      {
        host: 'xbja4opl6mn7y2dkp-1.a1.typesense.net', // where xxx is the ClusterID of your Typesense Cloud cluster
        port: '443',
        protocol: 'https',
      },
    ],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  additionalSearchParameters: {
    queryBy: 'name,descriptions,categories,details',
  },
});

const Hits = ({ hits }) => (
  <>
    {hits.map(hit => (
      <Card maxW="400" m="5" key={hit.objectID}>
        <CardHeader>
          <Heading size="md">{hit.name}</Heading>
        </CardHeader>
        <Image
          src={hit.image}
          alt="Product Name"
          borderRadius="lg"
          objectFit=""
          align="center"
        />
        <SimpleGrid columns={3} spacing={10}>
          {hit.images ? hit.images.map(image => (
            <Image
              src={image}
              alt="Product Name"
              borderRadius="lg"
              objectFit=""
              align="center"
              maxW={"70px"}
              />
          )) : null}
        </SimpleGrid>
        <CardBody>
          {hit.descriptions.map(description => (
            <Text>{description}</Text>
          ))}

          <Divider m="5" />

          <div>
            <div className="content" dangerouslySetInnerHTML={{__html: hit.pricingTable}}></div>
          </div>
          <Divider m="5" />
          {/* if the hit has field categoires map the categories */}
          {hit.categories ? hit.categories.map(category => (
            <Text>{category}</Text>
          )) : null}
         
          <Divider m="5" />
         
          {hit.details ? hit.details.map(detail => (
            <Text>{detail}</Text>
          )) : null}

        </CardBody>
        <CardFooter>
            <Button as="a" href={hit.url} target="_blank">View on Supplier site</Button>
        </CardFooter>
      </Card>
    ))}
  </>
);

const CustomHits = connectHits(Hits);

const SearchBox = ({ currentRefinement, refine }) => {
  return (
    <InputGroup w="600px">
      <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
      <Input
        type="text"
        value={currentRefinement}
        onChange={(event) => refine(event.currentTarget.value)}
        placeholder="Search for products"
        w="full"
      />
    </InputGroup>
  );
};


const CustomSearchBox = connectSearchBox(SearchBox);


const searchClient = typesenseInstantsearchAdapter.searchClient;
export default function FlexPromo() {
  return (
    <Box w="full" m="8">
      <InstantSearch searchClient={searchClient} indexName="products">
        <Center>
          <VStack>
            <CustomSearchBox />
            <Stats />
          </VStack>
        </Center>
        <SimpleGrid
          spacing={2}
          templateColumns="repeat(auto-fill, minmax(400px, 1fr))"
        >
          <CustomHits />
        </SimpleGrid>
      </InstantSearch>
    </Box>
  );
}

// import { Box, Center, Heading, Stack, Input, InputGroup, InputLeftElement, Text, Divider, VStack, Spacer} from '@chakra-ui/react';
// import React from 'react';
// import { Search2Icon } from '@chakra-ui/icons';

// import ProductCarousel from '../components/ProductCarousel';

/*
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
      <Box m="8">
        <Carousel data={data} />
        <VStack align="left" spacing={10}> 
          <Text
            bgGradient='linear(to-r, #FFD700, #FF0080)'
            bgClip='text'
            fontSize='6xl'
            fontWeight='extrabold'
            letterSpacing={'.1rem'}
            lineHeight='1.2'
          >
            Welcome to <Text>flexpromo search</Text>
          </Text>
          <Heading color="gray">A modern search engine for the entire promotional product industry.</Heading>
        <Center>
          
          <VStack color='gray' spacing={5}>
          <Stack spacing={4} w="100%">
            <InputGroup>
              <InputLeftElement
                pointerEvents='none'
                children={<Search2Icon color='gray.300' />}
              />
              <Input type='tel' placeholder='Search thousands of products' />
            </InputGroup>
          </Stack>
          <Heading color='#fca525'>Coming Soon</Heading>
          <Text>Email davidcrabtree@startupshell.org to join the learn more.</Text>
            <Spacer />
            <Heading size="lg" color='#fca525'>Distributors</Heading>
            <Heading size="md">Search thousands of products across hundreds of vendors with lighting speeding.</Heading>
            <Heading size="lg" color='#fca525'>Suppliers</Heading>
            <Heading size="md">Out of the box analytics to understand interactions with your product data.</Heading>
            <Heading size="lg" color='#fca525'>Developers</Heading>
            <Heading size="md">A modern search API for accessing product data from the industry's leading suppliers.</Heading>
          </VStack>
        </Center>
        </VStack>
      </Box>
  )
}
export default FlexPromo;
*/

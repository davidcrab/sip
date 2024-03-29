import {
  Heading,
  Box,
  HStack,
  Spacer,
  Button,
  ChakraBaseProvider,
  theme,
  Center,
  Input,
  VStack,
  AspectRatio,
  Divider,
  Image,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import trackPathForAnalytics from '../TrackPathForAnalytics';
import { useCallback, useEffect } from 'react';
import deckScreenShot from './deckpage.png';
import { Field, Form, Formik } from 'formik';
// get thee firestore stuff
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import PromoPilot from './PromoPilot.png';
import LandingTwo from './LandingTwo';
import DeckPage from './DeckPage';
// The below import defines which components come from formik
function FormikExample() {
  const toast = useToast();
  return (
    <Formik
      initialValues={{ name: '' }}
      onSubmit={async (values, actions) => {
        console.log(values);
        /* add the email to the firestore */
        const db = getFirestore();
        // set document in the demo collection.
        const docRef = doc(db, 'demo', values.name);
        let response = await setDoc(docRef, {
          email: values.name,
        });
        toast({
          title: 'We hear you!',
          description: 'You will recieve an email from us shortly.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      }}
    >
      {props => (
        <Form>
          <HStack>
            <Field name="name">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name}>
                  <Input
                    {...field}
                    placeholder="Enter your email"
                    w="400px"
                    size="lg"
                  />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button
              colorScheme="yellow"
              isLoading={props.isSubmitting}
              type="submit"
              size="lg"
              width="200px"
            >
              Talk to us
            </Button>
          </HStack>
        </Form>
      )}
    </Formik>
  );
}

const Landing = () => {
  // const firestoreInstance = getFirestore(useFirebaseApp());

  const navigate = useNavigate();

  const onClick = () => {
    navigate('/demo');
  };

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

  return (
    // <FirestoreProvider sdk={firestoreInstance}>
    <ChakraBaseProvider theme={theme}>
      <Box mb="0" position="sticky" top="0" zIndex="sticky" m="0" bg="white">
        <HStack m="0" position="sticky" top="0" zIndex="sticky" mr="4">
          <Image src={PromoPilot} w="250px" objectFit="cover" />
          <Spacer />
          {/* <Button as="a" target="_blank" href={"/flexpromo"} variant="link">Search Products</Button>
            <Button as="a" target="_blank" href={"/vendorStatus"}>Supplier Status</Button> */}
          <Button colorScheme={'blue'} onClick={onClick} size="md">
            Try it out
          </Button>
        </HStack>
        <Divider />
      </Box>
      <VStack
        margin="30"
        mb="0"
        pt="50"
        pb="50"
        align="center"
        textAlign={'center'}
        ml="5"
        color="gray"
      >
        <Heading>Create. Personalize. Share.</Heading>
        <Heading>Seamless product showcases for your clients</Heading>
        <Text>Import products directly from your suppliers website</Text>
      </VStack>

      <Box margin="30" mt="0">
        <Center>
          <VStack textAlign={'center'} spacing={4}>
            {/* <Heading lineHeight={"120%"} size="lg">Create & share product showcases from your suppliers' websites</Heading>
                <Text>In a few clicks, import products your vendor's product data and personalize them for your client.</Text> */}
            <AspectRatio width={['100px', '500px', '800px']} ratio={16 / 9}>
              <iframe
                src="https://www.youtube.com/embed/xtDRVMaaP_4"
                title="Sip Decks Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </AspectRatio>
            <Spacer />
            {/* <Heading size="md">Let us show you how top distributors are using flexpromo</Heading> */}
            <FormikExample />
            <Text>
              Let us show you how top distributors are using PromoPilot
            </Text>
            <Spacer />
          </VStack>
        </Center>
      </Box>
      <Box bg="gray.50" mb="0">
        <Center>
          <VStack>
        <Heading mt="8" size="2xl">Showcase</Heading>
        <HStack pt="8" pb="8">
          <Button colorScheme="blue" variant={'solid'}>
            More Sugar
          </Button>
          <Tooltip label="Coming soon">
          <Button colorScheme="blue" variant="ghost">
            New Hire Welcome
          </Button>
          </Tooltip>
          <Tooltip label="Coming soon">
          <Button colorScheme="blue" variant="ghost">
            Summertime Essentials
          </Button>
          </Tooltip>
        </HStack>
        </VStack>
        </Center>
        <LandingTwo />
        {/* <Heading m="10">Default Template:</Heading>
        <DeckPage demoDeck="Version 2 fs" />  */}
      </Box>
    </ChakraBaseProvider>
    // </FirestoreProvider>
  );
};

export default Landing;

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
useToast
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import trackPathForAnalytics from '../TrackPathForAnalytics';
import { useCallback, useEffect } from 'react';
import deckScreenShot from './deckpage.png';
import { Field, Form, Formik } from 'formik';
// get thee firestore stuff
import { getFirestore, doc, setDoc } from "firebase/firestore";

// The below import defines which components come from formik
function FormikExample() {
  const toast = useToast()
  return (
    <Formik
      initialValues={{ name: '' }}
      onSubmit={async (values, actions) => {
        console.log(values)
        /* add the email to the firestore */
        const db = getFirestore();
        // set document in the demo collection.
        const docRef = doc(db, "demo", values.name);
        let response = await setDoc(docRef, {
          email: values.name
        });      
        toast({
          title: 'Demo Requested!',
          description: "We will reach out to you shortly.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })

      }}
    >
      {(props) => (
        <Form >
          <HStack>
            <Field name='name'>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name}>
                  <Input {...field} placeholder='Enter your email'  w="400px" size="lg" />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button
              colorScheme='green'
              isLoading={props.isSubmitting}
              type='submit'
              size="lg"
              width="200px"
            >
              Request a demo
            </Button>
          </HStack>
        </Form>
      )}
    </Formik>
  )
}

const Landing = () => {
  // const firestoreInstance = getFirestore(useFirebaseApp());
  
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/demo');
  }

  const { pathname, search } = useLocation();

  const analytics = useCallback(() => {
      trackPathForAnalytics({ path: pathname, search: search, title: pathname.split("/")[1] });
  }, [pathname, search]);

  useEffect(() => {
      analytics();
  }, [analytics]);

  return (
    // <FirestoreProvider sdk={firestoreInstance}>
      <ChakraBaseProvider theme={theme}>
        <Box mb="0">
          <HStack m="5">
            <Heading>Sip Decks</Heading>
            <Spacer />
            <Button colorScheme={"green"} onClick={onClick} size="md">Check it out</Button>
          </HStack>
          <Divider />
          <Box margin="30" mt="10">
            <Center>
              <VStack textAlign={"center"} spacing={4}>
                <Heading lineHeight={"120%"} size="lg">Handpick, personalize, and share promotional product pitch decks in minutes.</Heading>
                <Text>In a few clicks, import products your vendor's product data and personalize them for your client.</Text>
                <AspectRatio width={["100px", "500px", "800px"]} ratio={16 / 9}>
                  <iframe src="https://www.youtube.com/embed/xtDRVMaaP_4" title="Sip Decks Demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                </AspectRatio>
                <Spacer />
                <Heading size="md">Get a demo of Sip Decks</Heading>
                <FormikExample />
                <Spacer />
                <Image src={deckScreenShot} alt="Sip Decks Demo" />
              </VStack>
            </Center>
          </Box>
          <Box mt="20" bg="gray.50" mb="0">
            <VStack margin="30" mb="0" pt="50" pb="50" align="center" textAlign={"center"} ml="5">
              <Heading>Share winning promotion product decks in minutes, not hours.</Heading>
              <Heading size="lg">Focus on building strong relationships and closing more deals.</Heading>
            </VStack>
          </Box>
        </Box>
      </ChakraBaseProvider>
    // </FirestoreProvider>
  );
}

export default Landing;
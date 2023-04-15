
import { 
  Heading,
  Card, 
  CardBody,
  CardHeader,
  Text,
  Link,
  CardFooter,
  Spacer,
  HStack,
  Image,
  VStack,
  Box,
} from "@chakra-ui/react";
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { doc } from 'firebase/firestore';

const ContactCard = ({ personalNote, props, color }) => {
  const userRef = doc(useFirestore(), 'users', props);
  const { status: userStatus, data: userData } = useFirestoreDocData(userRef);

  if (userStatus === 'loading') {
    return <p>Fetching products...</p>;
  }

  const emailLink = `mailto:${userData.contactEmail}`;

  return (
<Card color="white" variant={"filled"} size="sm" p="2" w="85%" ml="8%" mr="8%" bg={"#11284a"} rounded="2xl">
  <CardBody ml="10">
    <Text>{personalNote}</Text>
  </CardBody>
  <CardFooter ml="0">
    <Box ml="0" w="full" align={"center"}>
      <HStack justifyContent="space-around" ml="0"> 
        <VStack>
          <Heading size="sm">{userData.name}</Heading>
          <Spacer />
          <Heading size="sm" ><Link href={emailLink} target="_blank">{userData.phone}</Link></Heading>
          <Spacer />
          <Heading size="sm" ><Link href={emailLink} target="_blank">{userData.contactEmail}</Link></Heading>
          <Spacer />
          <Heading size="sm" >{userData.company}</Heading>
          <Spacer />
        </VStack>
      <Image w="175px" objectFit="contain" src={userData.logo} alt="Company Logo" display={["none", "none", "block"]}/>
      </HStack>
      <Image w="200px" objectFit="contain" src={userData.logo} alt="Company Logo" display={["block", "block", "none"]}/>
    </Box>
    {/* <VStack display={["", "", "none"]} w="full" overflowWrap={"normal"} textAlign="center" align="center" justify={"center"}>
      <Heading size="sm">{userData.name}</Heading>
      <Spacer />
      <Heading size="sm" ><Link href={emailLink} target="_blank">{userData.phone}</Link></Heading>
      <Spacer />
      <Heading size="sm" ><Link href={emailLink} target="_blank">{userData.contactEmail}</Link></Heading>
      <Spacer />
      <Heading size="sm" >{userData.company}</Heading>
      <Spacer />
      <Image w="100px" objectFit="contain" src={userData.logo} alt="Company Logo" />
    </VStack>
    */}
  </CardFooter>
</Card>

  );
}

export default ContactCard;
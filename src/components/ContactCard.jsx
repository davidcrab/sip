
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
      <CardFooter ml="10">
        <HStack align="center" justify={"center"} textAlign="center"/>
        <HStack w="full">
          <Heading size="sm" textAlign="center" align="center" justify={"center"}>{userData.name}</Heading>
          <Spacer />
          <Heading size="sm" ><Link href={emailLink} target="_blank">{userData.phone}</Link></Heading>
          <Spacer />
          <Heading size="sm" ><Link href={emailLink} target="_blank">{userData.contactEmail}</Link></Heading>
          <Spacer />
          <Heading size="sm" >{userData.company}</Heading>
          <Spacer />
        </HStack>
        <Spacer />
        <Image w="100px"objectFit="cover" src={userData.logo} alt="Company Logo" rounded="2xl" />
        <Spacer />
        <HStack />
      </CardFooter>
    </Card>
  );
}

export default ContactCard;
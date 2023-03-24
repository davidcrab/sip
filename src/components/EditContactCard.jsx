
import { 
  Heading,
  Card, 
  CardBody,
  CardHeader,
  Text,
  Link,
  Button,
  Spacer,
  HStack
} from "@chakra-ui/react";
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { doc } from 'firebase/firestore';

/* 
accept the user ID and the deck ID as props
*/
const EditContactCard = ({ deckId, props, personalNote }) => {
  const userRef = doc(useFirestore(), 'users', props);
  const { status: userStatus, data: userData } = useFirestoreDocData(userRef);

  if (userStatus === 'loading') {
    return <p>Fetching products...</p>;
  }

  const emailLink = `mailto:${userData.contactEmail}`;

  return (
    <Card variant={"filled"} size="sm" p="2" w="85%" ml="8%" mr="8%">
      <CardHeader>
        <HStack>
          {personalNote && <Text>{personalNote}</Text>}
          <Spacer />
          <Button colorScheme={"cyan"}>Edit</Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <Heading as="h3" size="md">
            {userData.name}
        </Heading>
        <Heading size="sm" >{userData.company}</Heading>
        <Link href={emailLink} target="_blank">{userData.contactEmail}</Link>
        <Text>{userData.phone}</Text>
      </CardBody>
    </Card>
  );
}

export default EditContactCard;
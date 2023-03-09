
import { 
  Heading,
  Card, 
  CardBody,
  CardHeader,
  Text,
  Link
} from "@chakra-ui/react";
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { doc } from 'firebase/firestore';

const ContactCard = ({ props }) => {
  const userRef = doc(useFirestore(), 'users', props);
  const { status: userStatus, data: userData } = useFirestoreDocData(userRef);

  if (userStatus === 'loading') {
    return <p>Fetching products...</p>;
  }

  const emailLink = `mailto:${userData.contactEmail}`;

  return (
    <Card m="10%" variant={"filled"} size="sm" p="2">
      <CardHeader>
        Please reach out to me at any of the following
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

export default ContactCard;
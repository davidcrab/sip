
import { 
  Heading,
  Card, 
  CardBody,
  CardHeader,
  Text,
  Link,
  Button,
  Spacer,
  HStack,
  Editable,
  EditablePreview,
  EditableInput,
  EditableTextarea,
  Tooltip,
  CardFooter
} from "@chakra-ui/react";
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { doc, updateDoc, getFirestore  } from 'firebase/firestore';
import { useState } from 'react'; 

/* 
accept the user ID and the deck ID as props
*/
const EditContactCard = ({ deckId, props, personalNote }) => {
  const userRef = doc(useFirestore(), 'users', props);
  const { status: userStatus, data: userData } = useFirestoreDocData(userRef);
  const [ editing , setEditing ] = useState(false);

  /* remember this will re-render the component every time the value changes. Doesn't make much sense to me but okay for now */
  const [note, setNote] = useState(personalNote)
  const handleChange = (event) => setNote(event.target.value)
  
  if (userStatus === 'loading') {
    return <p>Fetching products...</p>;
  }

  if (userStatus === 'error') {
    return <p>Failed to fetch products</p>;
  }

  const emailLink = `mailto:${userData.contactEmail}`;

  async function save() {

    const db = getFirestore();
    const docRef = doc(db, "decks", deckId);
    await updateDoc(docRef, {
      "personalNote": note,
    });
    setEditing(false)
  }


  if (editing) {
    return (
      <Card variant={"filled"} size="sm" p="2" w="85%" ml="8%" mr="8%">
        <HStack>
          <Editable defaultValue={note} w="80%">
            <Tooltip label="Click to edit your personal note">
              <EditablePreview />
            </Tooltip>
            <EditableTextarea onChange={handleChange} />
          </Editable>
          <Spacer />
          <Button onClick={save} colorScheme={"green"}>Save</Button>
        </HStack>
      </Card>
    )
  } else {
    return (
      <Card variant={"filled"} size="sm" p="2" w="85%" ml="8%" mr="8%">
        <CardHeader>
          <HStack>
            {note && <Text>{note}</Text>}
            <Spacer />
            <Button colorScheme={"cyan"} onClick={() => setEditing(true)}>Edit</Button>
          </HStack>
        </CardHeader>
        <CardFooter>
          <Spacer />
          <Heading size="sm">{userData.name}</Heading>
          <Spacer />
          <Heading size="sm"><Link href={emailLink} target="_blank">{userData.contactEmail}</Link></Heading>
          <Spacer />
          <Heading size="sm">{userData.phone}</Heading>
          <Spacer />
        </CardFooter>
      </Card>
    );
  }
}
export default EditContactCard;
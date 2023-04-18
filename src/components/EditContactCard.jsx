
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
  CardFooter,
  Input,
  FormControl,
  Progress,
  Image,
  VStack,
} from "@chakra-ui/react";
import { useFirestore, useUser, useStorageUploadTask, useFirestoreDocData, useStorage } from 'reactfire';
import { doc, updateDoc, getFirestore  } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { ChromePicker } from "react-color";

const ColorPicker = ({ setColor, deckId }) => {
  const [pickingColor, setPickingColor] = useState(false);
  const [tempColor, setTempColor] = useState("");

  const handleChangeColor = (newColor) => {
    setColor(newColor.hex);
    setTempColor(newColor.hex)
    console.log(newColor.hex)
  };

  async function updateColor() {
    const db = getFirestore();
    const deckRef = doc(db, "decks", deckId);
    await updateDoc(deckRef, {
      color: tempColor,
    });
    setPickingColor(false);
  }

  return (
    <>
    <VStack>
      {pickingColor &&
      <ChromePicker color={tempColor} onChange={handleChangeColor} />
      }
      {!pickingColor && <Button colorScheme="green" onClick={() => setPickingColor(true)}>Set Background Color</Button>}
      {pickingColor && 
      <>
      <Button colorScheme="green" onClick={() => updateColor()}>Save Color</Button>
      <Button colorScheme="red" onClick={() => setPickingColor(false)}>Cancel</Button>
      </>
      }
    </VStack>
    </>
  );
};


const ImageUpload = ({ userId }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const storage = useStorage();

  const handleSubmit = (e) => {
    e.preventDefault();
    // i can change the name to be files/${user.uid}/${Date.now()}${file.name}
    const file = e.target[0].files[0]
    const imageRef = ref(storage, `files/${userId}/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(imageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgressPercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL)
          updateUserLogo(userId, downloadURL);
          setImgUrl(downloadURL);
        });
      }
    );
  }

  return (
    <>
    <form onSubmit={handleSubmit}>
      <FormControl>
        <Input type="file" />
        <Button type="submit" colorScheme="green">Upload your logo</Button>
      </FormControl>
    </form>
    {!imgUrl && <Progress value={progressPercent} />}
    {imgUrl && <Image w="100px" src={imgUrl} />}
    </>
  )
}

const updateUserLogo = (userId, imageUrl) => {
  const db = getFirestore();
  const userRef = doc(db, "users", userId);

  updateDoc(userRef, {
    logo: imageUrl,
  });
}


/* 
accept the user ID and the deck ID as props
*/
const EditContactCard = ({ deckId, props, personalNote, currColor }) => {
  const userRef = doc(useFirestore(), 'users', props);
  const { status: userStatus, data: userData } = useFirestoreDocData(userRef);
  const [ editing , setEditing ] = useState(false);
  const [image, setImage] = useState(null);
  const storage = useStorage();

  const [color, setColor] = useState(currColor);

  /* remember this will re-render the component every time the value changes. Doesn't make much sense to me but okay for now */
  const [note, setNote] = useState(personalNote)
  const handleChange = (event) => setNote(event.target.value)

  const [name, setName] = useState("")
  const handleNameChange = (event) => setName(event.target.value)

  // phone 
  const [phone, setPhone] = useState("")
  const handlePhoneChange = (event) => setPhone(event.target.value)

  // email
  const [email, setEmail] = useState("")
  const handleEmailChange = (event) => setEmail(event.target.value)

  // company
  const [company, setCompany] = useState("")
  const handleCompanyChange = (event) => setCompany(event.target.value)

  useEffect(() => {
    if (userStatus !== 'success') {
      return;
    }
    
    setName(userData.name);
    setPhone(userData.phone);
    setEmail(userData.contactEmail);
    setCompany(userData.company);

  }, [userStatus])

  
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

    const userRef = doc(db, "users", props);
    // need to get this info
    await updateDoc(userRef, {
      contactEmail: email,
      phone: phone,
      name: name,
      company: company,
    });
    setEditing(false)
  }

  if (editing) {
    return (
      <Card variant={"filled"} color={"white"} size="sm" p="2" w="85%" ml="8%" mr="8%" bg={"darkgrey"}>
        <HStack>
          <Editable defaultValue={note} w="80%" placeholder="Add Personal Note">
            <Tooltip label="Click to edit your personal note">
              <EditablePreview />
            </Tooltip>
            <EditableTextarea onChange={handleChange} />
          </Editable>
          <Spacer />
          <Button onClick={save} colorScheme={"green"}>Save</Button>
        </HStack>
        <HStack>
          <Editable defaultValue={name} w="80%" placeholder="Add your name">
            <Tooltip label="Click to edit your display name">
              <EditablePreview />
            </Tooltip>
            <EditableTextarea onChange={handleNameChange} />
          </Editable>
          <Spacer />
          <Editable defaultValue={phone} w="80%" placeholder="Add your phone number">
            <Tooltip label="Click to edit your phone number">
              <EditablePreview />
            </Tooltip>
            <EditableTextarea onChange={handlePhoneChange} />
          </Editable>
          <Spacer />
          <Editable defaultValue={email} w="80%" placeholder="Add your email">
            <Tooltip label="Click to edit your email">
              <EditablePreview />
            </Tooltip>
            <EditableTextarea onChange={handleEmailChange} />
          </Editable>
          <Spacer />
          <Editable defaultValue={company} w="80%" placeholder="Add your company">
            <Tooltip label="Click to edit your company">
              <EditablePreview />
            </Tooltip>
            <EditableTextarea onChange={handleCompanyChange} />
          </Editable>
        </HStack>

        <HStack>
          <ImageUpload userId={userData.NO_ID_FIELD} />
        </HStack>
        <ColorPicker setColor={setColor} deckId={deckId}/>
      </Card>
    )
  } else {
    return (
      <Card variant={"filled"} color={"white"} size="sm" p="2" w="85%" ml="8%" mr="8%" bg={color}>
        <CardHeader>
          <HStack>
            {note && <Text>{note}</Text>}
          </HStack>
        </CardHeader>
        <CardFooter>
          <VStack w="full">
            <HStack align="center" justify={"space-evenly"} w="full">
              <Spacer />
              <Heading size="sm">{userData.name}</Heading>
              <Spacer />
              <Heading size="sm"><Link href={emailLink} target="_blank">{userData.contactEmail}</Link></Heading>
              <Spacer />
              <Heading size="sm">{userData.phone}</Heading>
              <Spacer />
              <Image w="100px" src={userData.logo} alt="Add your logo" />
            </HStack>
            <Button colorScheme={"cyan"} onClick={() => setEditing(true)}>Edit</Button>
          </VStack>
        </CardFooter>
      </Card>
    );
  }
}
export default EditContactCard;
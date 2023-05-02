import FloatingAddButton from '../components/DeckEditor/FloatingButton';
import { doc, collection, query, where, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  useFirestore,
  useFirestoreDocData,
  useFirestoreCollectionData,
} from 'reactfire';
import DeckEditorHeader from '../components/DeckEditor/DeckEditorHeader';
import DeckEditorProductDisplay from '../components/DeckEditor/DeckEditorProductDisplay';
import { VStack, Spinner, Heading, Button, Image } from '@chakra-ui/react';
import { useTour } from '@reactour/tour';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import EditContactCard from "../components/EditContactCard";
import { useParams } from 'react-router-dom';
import deck1 from "./deck1.png";
import deck2 from "./deck2.png";
import deck3 from "./deck3.png";
import deck4 from "./deck4.png";
import deck5 from "./deck5.png";
import deck6 from "./deck6.png";

const PlaygroundPage = () => {
  return (
    <div>
    <Button
        position="fixed"
        bottom="2rem"
        right="2rem"
        zIndex="99"
        as='a'
        href={`/`}
        target="_blank"
        colorScheme="blue"
      >
        Try it now
      </Button>
      <Image src={deck1} />
      <Image src={deck2}  />
      <Image src={deck3}  />
      <Image src={deck4}  />
      <Image src={deck5}  />
      <Image src={deck6}  />
    </div>
  );
};

export default PlaygroundPage;

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
import { VStack, Spinner, Heading } from '@chakra-ui/react';

const PlaygroundPage = () => {
  const deckRef = doc(useFirestore(), 'decks', 'Version 2 fs');

  // subscribe to a document for realtime updates. just one line!
  const { status: deckStatus, data: deck } = useFirestoreDocData(deckRef);

  let productsQuery = query(
    collection(useFirestore(), 'showcaseProduct'),
    where('deckId', '==', 'Version 2 fs')
  );
  const { status: productsStatus, data: products } = useFirestoreCollectionData(
    productsQuery,
    { idField: 'id' }
  );

  const handleDeckUpdate = async (updatedDeck) => {
    try {
      await updateDoc(deckRef, updatedDeck);
    } catch (error) {
      console.error('Error updating deck:', error);
    }
  };

  const handleClientLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    // Upload the image to Firebase Storage
    const storage = getStorage();
    const storageRef = ref(storage, `clientLogos/${file.name}`);
    await uploadBytes(storageRef, file);
  
    // Get the uploaded image URL
    const imageURL = await getDownloadURL(storageRef);
  
    // Update the Firestore field with the new client logo URL
    handleDeckUpdate({ ...deck, clientLogo: imageURL });
  };
  

  if (deckStatus === 'loading' || productsStatus === 'loading') {
    return (
      <VStack>
        <Spinner size="xl" />
        <Heading>Fetching products...</Heading>
      </VStack>
    );
  }

  // filter out products with an inactive status
  const activeProducts = products?.filter(
    product => product.status !== 'inactive'
  );

  return (
    <div>
      {productsStatus === 'loading' && <div>Loading...</div>}
      {deckStatus === 'loading' && <div>Loading...</div>}
      {productsStatus === 'error' && <div>Error</div>}
      {deckStatus === 'error' && <div>Error</div>}
      <DeckEditorHeader deck={deck} onSubmit={handleDeckUpdate} onClientLogoUpload={handleClientLogoUpload} />
      {activeProducts &&
        activeProducts.map(product => {
          return (
            <DeckEditorProductDisplay key={product.id} product={product} />
          );
        })}
      <FloatingAddButton />
    </div>
  );
};

export default PlaygroundPage;

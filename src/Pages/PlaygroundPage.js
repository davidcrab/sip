import FloatingAddButton from '../components/DeckEditor/FloatingButton';
import { doc, collection, query, where } from 'firebase/firestore';
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
      <DeckEditorHeader deck={deck} />
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

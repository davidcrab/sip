import {
  Card,
  CardBody,
  CardHeader,
  Image,
  Spacer,
  Button,
  VStack,
  Center
} from "@chakra-ui/react";
import EditProduct from "./EditProduct";
import { getFirestore, doc, updateDoc } from "firebase/firestore";


const PreviewProduct = ({ product, deckId, productId }) => {
    
  async function removeProduct() {
    const db = getFirestore();
    const docRef = doc(db, "showcaseProduct", productId);
    await updateDoc(docRef, {
      deckId: "deleted"
    });
  }

  return (
    <Card size="lg" w="600px">
      <CardHeader>
        {product.name}
      </CardHeader>
      <CardBody>
        <Image src={product.image} />
      </CardBody>
      <Center>
        <VStack w="70%">
          <EditProduct product={product} deckId={deckId} productId={productId} />
          <Button colorScheme={"red"} onClick={removeProduct} w="full">Remove</Button>
        </VStack>
      </Center>
    </Card>
  );
}

export default PreviewProduct;
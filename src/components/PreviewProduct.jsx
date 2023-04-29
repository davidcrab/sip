import {
  Card,
  CardBody,
  CardHeader,
  Image,
  Spacer,
  Button,
  VStack,
  Center,
  Divider
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
        {/* if there is a custom image, use it, otherwise use the default image */}
        <Image src={product.customImage ? product.customImage : product.image} />
        <div>
            <div className="content" dangerouslySetInnerHTML={{__html: product.pricingTable}}></div>
        </div>
        {/* Map the product details array */}
        <Divider m="3" />
        {product.details && product.details.map((detail, index) => (
          <p key={index}>{detail}</p>
        ))}
      </CardBody>
      <Center>
        <VStack w="70%" mb="10">
          <Button w="full" as="a" colorScheme='gray' target="_blank" href={product.url}>Suppliers Product Page</Button>
          <EditProduct product={product} deckId={deckId} productId={productId} />
          <Button colorScheme={"red"} onClick={removeProduct} w="full" mb="10">Remove</Button>
        </VStack>
      </Center>
    </Card>
  );
}

export default PreviewProduct;
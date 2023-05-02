import { VStack, Spinner, Heading, Button, Image } from '@chakra-ui/react';
import deck1 from "./assests/1.png";
import deck2 from "./assests/2.png";
import deck3 from "./assests/3.png";
import deck4 from "./assests/4.png";
import deck5 from "./assests/5.png";
import deck6 from "./assests/6.png";
import deck7 from "./assests/7.png";

const LandingTwo = () => {
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
      <Image src={deck7}  />
    </div>
  );
};

export default LandingTwo;

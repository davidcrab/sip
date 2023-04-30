import {
  Heading,
  Box,
  Image,
  HStack,
  Spacer,
  Editable,
  EditableInput,
  EditablePreview,
  Input,
  Tooltip,
} from '@chakra-ui/react';

const DeckEditorHeader = ({ deck, onSubmit, onClientLogoUpload }) => {
  const handleDeckNameSubmit = nextValue => {
    onSubmit({ ...deck, name: nextValue });
  };

  return (
    <Box
      w="100%"
      position="sticky"
      top="0"
      zIndex="sticky"
      bg="#11284a"
      color="white"
      overflow="hidden"
      mb="20"
    >
      <HStack pl="8" pr="8">
        <Tooltip
          label="Click to edit the title"
          aria-label="Click to edit the title"
        >
          <Editable
            defaultValue={deck.name}
            onSubmit={handleDeckNameSubmit}
            fontSize="2xl"
            fontWeight="bold"
            className="first-step"
          >
            <EditablePreview />
            <EditableInput />
          </Editable>
        </Tooltip>
        <Spacer />
        {/* <Image w="100px" src={deck.clientLogo} /> */}
        <Spacer />
        <Input
          type="file"
          accept="image/*"
          display="none"
          onChange={onClientLogoUpload}
          id="client-logo-upload"
        />
        <Tooltip
          label="Click to upload your client's logo"
          aria-label="Click to upload your client's logo"
        >
          <label htmlFor="client-logo-upload">
          
            <Image
              w="100px"
              src={deck.clientLogo || '/placeholder-logo.png'} alt="Logo here" // Replace '/placeholder-logo.png' with a placeholder image URL
              cursor="pointer"
              className='second-step'
            />
          </label>
        </Tooltip>
      </HStack>
    </Box>
  );
};

export default DeckEditorHeader;

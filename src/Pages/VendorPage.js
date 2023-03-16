import { Heading, Text, Box, Divider, UnorderedList, ListItem, Card, CardHeader, CardBody, VStack, HStack, Button, Spacer } from '@chakra-ui/react';
import React from 'react';

const VendorPage = () => {
  return (
    <Box m="8">
        <VStack >
          <HStack w="full">
            <Heading>Vendor & Supplier Status</Heading>
            <Spacer />
            <Button isDisabled>Request New Vendor</Button>
          </HStack>
        <Divider />
        <Text>Check what vendors we support, the data we pull, and request new vendors</Text>
        <Text>We pull the product's name, description, and image by default. You can request additional info including details like pricing, sizes, or colors for each vendor below.</Text>
        <Card size="sm" minW="sm">
          <CardHeader>
            <Heading>Hit Promo</Heading>
            <strong>Status: <strong style={{color: "green"}}>Connected</strong></strong>
          </CardHeader>
          <Divider />
          <CardBody>
            
            <HStack p="2" align="start">
              <UnorderedList>
                <strong>Default</strong>
                <ListItem>Name</ListItem>
                <ListItem>Image</ListItem>
                <ListItem>Description</ListItem>
              </UnorderedList>
              <Spacer />
              <UnorderedList ml="5">
                <strong>Additional</strong>
                <ListItem>Pricing</ListItem>
                <ListItem>Colors</ListItem>
                <ListItem>Sizes</ListItem>
                <ListItem>Set up Charges</ListItem>
                <ListItem>Production Times</ListItem>
              </UnorderedList>
            </HStack>
          </CardBody>
        </Card>
        </VStack>
    </Box>
  )
}

export default VendorPage;

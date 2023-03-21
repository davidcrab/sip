import { Heading, Text, Box, Divider, UnorderedList, ListItem, Card, CardHeader, CardBody, VStack, HStack, Button, Spacer, CardFooter, SimpleGrid } from '@chakra-ui/react';
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
        <Card size="sm" variant={"filled"}>
          <CardBody>
            <Text>Check what vendors we support, the data we pull, and request new vendors</Text>
            <Text>We pull the product's name, description, and image by default. You can request additional info including details like pricing, sizes, or colors for each vendor below.</Text>
            <Text>Please email davidcrabtree@startupshell.org to request a new vendor or more production information from an existing vendor</Text>
          </CardBody>
        </Card>
        <SimpleGrid columns={2} spacing={10}>
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
          <CardFooter>
            <Button as="a" href="https://www.hitpromo.net/" target="_blank">Visit Vendor</Button>
            <Spacer />
            <Button isDisabled>Request Additional Info</Button>
          </CardFooter>
        </Card>
        <Card size="sm" minW="sm">
          <CardHeader>
            <Heading>Primeline</Heading>
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
              </UnorderedList>
            </HStack>
          </CardBody>
          <CardFooter>
            <Button as="a" href="https://www.primeline.com/" target="_blank">Visit Vendor</Button>
            <Spacer />
            <Button isDisabled>Request Additional Info</Button>
          </CardFooter>
        </Card>
        <Card size="sm" minW="sm">
          <CardHeader>
            <Heading>PCNA</Heading>
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
              </UnorderedList>
            </HStack>
          </CardBody>
          <CardFooter>
            <Button as="a" href="https://www.pcna.com/en-us" target="_blank">Visit Vendor</Button>
            <Spacer />
            <Button isDisabled>Request Additional Info</Button>
          </CardFooter>
        </Card>
        <Card size="sm" minW="sm">
          <CardHeader>
            <Heading>High Caliber</Heading>
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
              </UnorderedList>
            </HStack>
          </CardBody>
          <CardFooter>
            <Button as="a" href="https://highcaliberline.com/" target="_blank">Visit Vendor</Button>
            <Spacer />
            <Button isDisabled>Request Additional Info</Button>
          </CardFooter>
        </Card>

        </SimpleGrid>
        </VStack>
    </Box>
  )
}

export default VendorPage;

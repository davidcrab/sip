import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Textarea,
  Button,
  Box,
  Badge,
  Tag,
  Tooltip,
  HStack,
} from '@chakra-ui/react';
import { ViewIcon, LockIcon } from '@chakra-ui/icons';

const RestrictedTag = () => {
  return (
    <Tooltip label="Will not be shown on the published deck">
      <Tag size="sm" colorScheme="blue" ml={2} leftIcon={<LockIcon />}>
        <LockIcon mr="2" />
        Restricted
      </Tag>
    </Tooltip>
  );
};

const SharedTag = () => {
  return (
    <Tooltip label="Will be shown on the published deck">
      <Tag size="sm" colorScheme="orange" ml={2}>
        <ViewIcon mr="2" />
        Shared
      </Tag>
    </Tooltip>
  );
};

const AddProductForm = ({ deckId, onSubmit, onAdd }) => {
  // ...formik setup
  const formik = useFormik({
    initialValues: {
      name: '',
      image: '',
      url: '',
      supplier: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Product name is required'),
      image: Yup.string().required('Product image is required'),
      url: Yup.string().url('Invalid URL').required('Product URL is required'),
      supplier: Yup.string().required('Supplier is required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      onSubmit(values);
      setSubmitting(false);
    },
  });

  const [notes, setNotes] = useState(['']);
  const [details, setDetails] = useState(['']);
  const [pricing, setPricing] = useState(['']);
  const [descriptions, setDescriptions] = useState(['']);

  const addField = (arr, setArr) => {
    setArr([...arr, '']);
  };

  const updateField = (arr, setArr, index, value) => {
    const newArr = [...arr];
    newArr[index] = value;
    setArr(newArr);
  };

  const handleFieldChange = (arr, setArr, e, index) => {
    const pastedText = e.target.value;
    const lines = pastedText.split('\n');
  
    if (lines.length > 1) {
      const processedLines = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (i < lines.length - 1 && line.toUpperCase() === line && lines[i + 1].toUpperCase() !== lines[i + 1]) {
          processedLines.push(`${line} ${lines[i + 1]}`);
          i++; // skip the next line as it's already concatenated
        } else {
          processedLines.push(line);
        }
      }
  
      const newArr = [...arr.slice(0, index), ...processedLines, ...arr.slice(index + 1)];
      setArr(newArr);
    } else {
      updateField(arr, setArr, index, e.target.value);
    }
  };

  const removeEmptyFields = (arr) => {
  return arr.filter((item) => item.trim() !== "");
};

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit({
      name: formik.values.name,
      image: formik.values.image,
      url: formik.values.url,
      supplier: formik.values.supplier,
      notes: removeEmptyFields(notes),
      details: removeEmptyFields(details),
      pricing: removeEmptyFields(pricing),
      descriptions: removeEmptyFields(descriptions),
      deckId: deckId,
      images: [],
    });
  };

  formik.handleSubmit = handleSubmit;

  return (
    <form
      onSubmit={event => {
        event.preventDefault(); // Add this line
        formik.handleSubmit(event);
      }}
    >
      <FormControl id="name" isRequired>
        <HStack>
          <FormLabel>Product Name</FormLabel>
          <SharedTag />
        </HStack>
        <Input type="text" {...formik.getFieldProps('name')} />
        {formik.touched.name && formik.errors.name ? (
          <FormHelperText color="red.500">{formik.errors.name}</FormHelperText>
        ) : null}
      </FormControl>
      <FormControl id="image" mt={4} isRequired>
        <HStack>
          <FormLabel>Product Image</FormLabel>
          <SharedTag />
        </HStack>
        <Input type="text" {...formik.getFieldProps('image')} />
        {formik.touched.image && formik.errors.image ? (
          <FormHelperText color="red.500">{formik.errors.image}</FormHelperText>
        ) : null}
      </FormControl>
      <FormControl id="pricing" mt={4}>
        <HStack>
          <FormLabel>Product Pricing</FormLabel>
          <SharedTag />
        </HStack>
        {pricing.map((price, index) => (
          <Textarea
            key={index}
            value={price}
            onChange={e => handleFieldChange(pricing, setPricing, e, index)}
            mt={index > 0 ? 2 : 0}
          />
        ))}
        <Button mt={2} onClick={() => addField(pricing, setPricing)}>
          Add Pricing
        </Button>
      </FormControl>
      <FormControl id="descriptions" mt={4}>
        <HStack>
          <FormLabel>Product Description</FormLabel>
          <SharedTag />
        </HStack>
        {descriptions.map((description, index) => (
          <Textarea
            key={index}
            value={description}
            onChange={e =>
              handleFieldChange(descriptions, setDescriptions, e, index)
            }
            mt={index > 0 ? 2 : 0}
          />
        ))}
        <Button mt={2} onClick={() => addField(descriptions, setDescriptions)}>
          Add Description
        </Button>
      </FormControl>
      <FormControl id="supplier" mt={4} isRequired>
        <HStack>
          <FormLabel>Supplier</FormLabel>
          <RestrictedTag />
        </HStack>
        <Input type="text" {...formik.getFieldProps('supplier')} />
        {formik.touched.supplier && formik.errors.supplier ? (
          <FormHelperText color="red.500">
            {formik.errors.supplier}
          </FormHelperText>
        ) : null}
      </FormControl>
      <FormControl id="url" mt={4} isRequired>
        <HStack>
          <FormLabel>Product URL</FormLabel>
          <RestrictedTag />
        </HStack>
        <Input type="text" {...formik.getFieldProps('url')} />
        {formik.touched.url && formik.errors.url ? (
          <FormHelperText color="red.500">{formik.errors.url}</FormHelperText>
        ) : null}
      </FormControl>
      <FormControl id="notes" mt={4}>
        <HStack>
          <FormLabel>Product Notes</FormLabel>
          <RestrictedTag />
        </HStack>
        {notes.map((note, index) => (
          <Textarea
            key={index}
            value={note}
            onChange={e => handleFieldChange(notes, setNotes, e, index)}
            mt={index > 0 ? 2 : 0}
          />
        ))}
        <Button mt={2} onClick={() => addField(notes, setNotes)}>
          Add Note
        </Button>
      </FormControl>
      <FormControl id="details" mt={4}>
        <HStack>
          <FormLabel>Product Details</FormLabel>
          <RestrictedTag />
        </HStack>
        {details.map((detail, index) => (
          <Textarea
            key={index}
            value={detail}
            onChange={e => handleFieldChange(details, setDetails, e, index)}
            mt={index > 0 ? 2 : 0}
          />
        ))}
        <Button mt={2} onClick={() => addField(details, setDetails)}>
          Add Detail
        </Button>
      </FormControl>
      <Box mt={4}>
        <Button colorScheme="blue" type="submit">
          Add Product
        </Button>
      </Box>
    </form>
  );
};

export default AddProductForm;

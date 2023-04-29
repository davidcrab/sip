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
} from '@chakra-ui/react';

const ProductForm = ({ onSubmit, onAdd }) => {
  // ...formik setup
  const formik = useFormik({
    initialValues: {
      name: '',
      image: '',
      url: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Product name is required'),
      image: Yup.string().required('Product image is required'),
      url: Yup.string()
        .url('Invalid URL')
        .required('Product URL is required'),
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

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name: formik.values.name,
      image: formik.values.image,
      url: formik.values.url,
      notes,
      details,
      pricing,
      descriptions,
      deckId: 'Version 2 fs',
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
        <FormLabel>Product Name</FormLabel>
        <Input type="text" {...formik.getFieldProps('name')} />
        {formik.touched.name && formik.errors.name ? (
          <FormHelperText color="red.500">
            {formik.errors.name}
          </FormHelperText>
        ) : null}
      </FormControl>
      <FormControl id="image" mt={4} isRequired>
        <FormLabel>Product Image</FormLabel>
        <Input type="text" {...formik.getFieldProps('image')} />
        {formik.touched.image && formik.errors.image ? (
          <FormHelperText color="red.500">
            {formik.errors.image}
          </FormHelperText>
        ) : null}
      </FormControl>
      <FormControl id="url" mt={4} isRequired>
        <FormLabel>Product URL</FormLabel>
        <Input type="text" {...formik.getFieldProps('url')} />
        {formik.touched.url && formik.errors.url ? (
          <FormHelperText color="red.500">
            {formik.errors.url}
          </FormHelperText>
        ) : null}
      </FormControl>
      <FormControl id="notes" mt={4} isRequired>
        <FormLabel>Product Notes</FormLabel>
        {notes.map((note, index) => (
          <Textarea
            key={index}
            value={note}
            onChange={e =>
              updateField(notes, setNotes, index, e.target.value)
            }
            mt={index > 0 ? 2 : 0}
          />
        ))}
        <Button mt={2} onClick={() => addField(notes, setNotes)}>
          Add Note
        </Button>
      </FormControl>
      <FormControl id="details" mt={4} isRequired>
        <FormLabel>Product Details</FormLabel>
        {details.map((detail, index) => (
          <Textarea
            key={index}
            value={detail}
            onChange={e =>
              updateField(
                details,
                setDetails,
                index,
                e.target.value
              )
            }
            mt={index > 0 ? 2 : 0}
          />
        ))}
        <Button
          mt={2}
          onClick={() => addField(details, setDetails)}
        >
          Add Detail
        </Button>
      </FormControl>
      <FormControl id="pricing" mt={4} isRequired>
        <FormLabel>Product Pricing</FormLabel>
        {pricing.map((price, index) => (
          <Textarea
            key={index}
            value={price}
            onChange={e =>
              updateField(
                pricing,
                setPricing,
                index,
                e.target.value
              )
            }
            mt={index > 0 ? 2 : 0}
          />
        ))}
        <Button
          mt={2}
          onClick={() => addField(pricing, setPricing)}
        >
          Add Pricing
        </Button>
      </FormControl>
      <FormControl id="descriptions" mt={4} isRequired>
        <FormLabel>Product Description</FormLabel>
        {descriptions.map((price, index) => (
          <Textarea
            key={index}
            value={price}
            onChange={e =>
              updateField(
                descriptions,
                setDescriptions,
                index,
                e.target.value
              )
            }
            mt={index > 0 ? 2 : 0}
          />
        ))}
        <Button
          mt={2}
          onClick={() => addField(descriptions, setDescriptions)}
        >
          Add Description
        </Button>
      </FormControl>
      <Box mt={4}>
        <Button colorScheme="blue" type="submit">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default ProductForm;

import React, { useState } from 'react';
import { useFirestore, useUser, useStorageUploadTask, useFirestoreDocData, useStorage } from 'reactfire';
import { doc, updateDoc, getFirestore  } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import {
  FormControl,
  Input,
  Button,
  Progress,
  Image,
} from "@chakra-ui/react";

const ImageUpload = ({ deckId }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const storage = useStorage();

  const handleSubmit = (e) => {
    e.preventDefault();
    // i can change the name to be files/${user.uid}/${Date.now()}${file.name}
    const file = e.target[0].files[0]
    const imageRef = ref(storage, `files/${deckId}/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(imageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgressPercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL)
          updateUserLogo(deckId, downloadURL);
          setImgUrl(downloadURL);
        });
      }
    );
  }

  return (
    <>
    <form onSubmit={handleSubmit}>
      <FormControl>
        <Input type="file" />
        <Button type="submit" colorScheme="green">Upload your logo</Button>
      </FormControl>
    </form>
    {!imgUrl && <Progress value={progressPercent} />}
    {imgUrl && <Image w="100px" src={imgUrl} />}
    </>
  )
}

const updateUserLogo = (deckId, imageUrl) => {
  const db = getFirestore();
  const deckRef = doc(db, "decks", deckId);

  updateDoc(deckRef, {
    clientLogo: imageUrl,
  });
}

export default ImageUpload;
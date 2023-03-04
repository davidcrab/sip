import { useStorage, useStorageDownloadURL } from 'reactfire'
import { ref, getStorage, uploadBytes, uploadString, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import React, { useRef, useState, useEffect, } from 'react';
import {
  exportComponentAsPNG,
} from 'react-component-export-image';
import { Resizable } from 're-resizable';
import Draggable from 'react-draggable';
import logo from './gg-logo.png';
import html2canvas from 'html2canvas';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  var byteString = atob(dataURI.split(',')[1]);

  // separate the mime type from the data
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // create a Blob object from the ArrayBuffer
  return new Blob([ab], { type: mimeString });
}

/* Update the product image in the database */
const updateProductImage = (deckId, productId, image) => {
  const db = getFirestore();
  const deckRef = doc(db, "decks", deckId);
  let field = "products." + productId + ".customImage"
  updateDoc(deckRef, {
    [field]: image,
  });
}

/*
  will need something like the deck id and the product id for this to work
  pass in encode imagee 
*/
const Mockup = (props) => {
  const componentRef = useRef();
  const storage = useStorage();
  const catRef = ref(storage, '5950_REDWHT_Blank.jpeg');
  const logoRef = ref(storage, 'gg-logo.png');

  // const { status, data: imageURL } = useStorageDownloadURL(catRef);
  const { status: logoStatus, data: logoURL } = useStorageDownloadURL(logoRef);

  const [isExporting, setIsExporting] = useState(false);
  console.log(props.src)

  useEffect(() => {
    if (props.src && logoURL && isExporting) {
      htmlToImage.toPng(componentRef.current)
      .then(function (dataUrl) {
        let imageName = props.deckId + "_" + props.productId + ".png";
        // Create a reference to the image in Firebase Storage
        const imagesRef = ref(storage, imageName);
  
        // Convert the data URL to a Blob object
        const blob = dataURItoBlob(dataUrl);
  
        // Upload the Blob to Firebase Storage
        // uploadBytes(imagesRef, blob).then((snapshot) => {
        //   console.log('Uploaded a blob or file!');
        // })

        const uploadTask = uploadBytesResumable(imagesRef, blob);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, 
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            updateProductImage(props.deckId, props.productId, downloadURL);
            setIsExporting(false);
          });
        });
      })
      .catch(function (error) {
        console.error('Error generating image', error);
      });

      // htmlToImage.toPng(componentRef.current).then((image) => {
      //   const imagesRef = ref(storage, 'my-new-image.png');
      //   uploadBytes(imagesRef, image).then(() => {
      //     console.log('Image uploaded!');
      //     setIsExporting(false);
      //   });
      // });
    }
  }, [props.src, logoURL, isExporting, storage, props.deckId, props.productId]);

  const handleExport = () => {
    setIsExporting(true);
  };


  if (logoStatus === 'loading') {
    return <span>loading...</span>;
  }

  return (
    <div>
      <div
        ref={componentRef}
        style={{
          background: `url(${props.src})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          width: 400,
          height: 400,
        }}
      >
        <Draggable>
          <Resizable
            defaultSize={{
              width: 200,
              height: 360,
            }}
            style={{
              background: `url(${logoURL})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            }}
            lockAspectRatio={true}
          ></Resizable>
        </Draggable>
      </div>
      <button onClick={handleExport}>Save Customization</button>
    </div>
  );



  // return (
  //   <>
  //     <ComponentToPrint ref={componentRef} />
  //     <button onClick={() => UploadNewImage(componentRef)}>
  //       Export As PNG
  //     </button>
  //   </>
  // );
};

export default Mockup;

import { useStorage, useStorageDownloadURL } from 'reactfire'
import { ref, getStorage, uploadBytes, uploadString } from 'firebase/storage';
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

/*
  will need something like the deck id and the product id for this to work
  pass in encode imagee 
*/
const Mockup = (encodedImage) => {
  const componentRef = useRef();
  const storage = useStorage();
  const catRef = ref(storage, '5950_REDWHT_Blank.jpeg');
  const logoRef = ref(storage, 'gg-logo.png');

  // const { status, data: imageURL } = useStorageDownloadURL(catRef);
  const { status: logoStatus, data: logoURL } = useStorageDownloadURL(logoRef);

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (encodedImage && logoURL && isExporting) {
      htmlToImage.toPng(componentRef.current)
      .then(function (dataUrl) {
        // Create a reference to the image in Firebase Storage
        const imagesRef = ref(storage, 'my-new-image.png');
  
        // Convert the data URL to a Blob object
        const blob = dataURItoBlob(dataUrl);
  
        // Upload the Blob to Firebase Storage
        uploadBytes(imagesRef, blob).then((snapshot) => {
          console.log('Uploaded a blob or file!');
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
  }, [encodedImage, logoURL, isExporting, storage]);

  const handleExport = () => {
    setIsExporting(true);
  };


  if (logoStatus === 'loading') {
    return <span>loading...</span>;
  }

  // this one is working, wile the other one is not.
  const ComponentToPrint = React.forwardRef((props, ref) => (
    <div
      ref={ref}
       style={{
         background: `url(${imageURL})`,
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
  ));

  const UploadNewImageOld = async (componentRef) => {
    let image = exportComponentAsPNG(componentRef)

    // Create a reference to 'mountains.jpg'
    // Create a reference to 'images.png'
    const imagesRef = ref(storage, 'images.png');

    // Create a reference to 'images/mountains.jpg'
    //const cupImagesRef = ref(storage, 'images/up.jpg');

    // Convert data URL to blob
    const response = await fetch(image);
    const blob = await response.blob();

    // 'file' comes from the Blob or File API
    await uploadBytes(imagesRef, blob).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });

  }

  const uploadComponentAsImage = async (componentRef) => {
    // Use html2canvas to convert the component to an HTML canvas
    const canvas = await html2canvas(componentRef.current);

    // Convert the canvas to a data URL
    const dataUrl = canvas.toDataURL('image/png');

    // Upload the data URL to Firebase Storage
    const storageRef = ref(storage, 'image.png');
    await uploadString(storageRef, dataUrl, 'data_url');
    console.log('Uploaded component as image!');
  };

  const UploadNewImage = async (componentRef) => {
    html2canvas(componentRef.current).then((canvas) => {
      canvas.toBlob(async (blob) => {
        // Create a reference to the new image file in Firebase Storage
        const imageRef = ref(storage, 'my-new-image.png');

        // Upload the image file to Firebase Storage
        await uploadBytes(imageRef, blob);

        console.log('Image uploaded successfully!');
      }, 'image/png');
    });
  };

  return (
    <div>
      <div
        ref={componentRef}
        style={{
          background: `url(${encodedImage})`,
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
      <button onClick={handleExport}>Export As PNG</button>
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

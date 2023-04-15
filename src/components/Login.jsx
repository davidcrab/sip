import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useSigninCheck } from "reactfire";
import { Button, ChakraProvider, Heading, theme } from "@chakra-ui/react"
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore"; 
import { useFirebaseApp, useFirestoreDocData } from "reactfire";
import {useState} from "react"
import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const firestoreInstance = getFirestore(useFirebaseApp());
  const { status, data: signInCheckResult } = useSigninCheck();
  const [ userID, setUserID ] = useState(" ")
  const ref = doc(firestoreInstance, 'users', userID);
  const { userDocStatus, data: userDoc } = useFirestoreDocData(ref);
  const navigate = useNavigate()

  function addNewUserToFirestore(user) {
    const details = {
      email: user.email,
      name: user.displayName,
      company: "Company Placeholder",
      contactEmail: "Email placeholder",
      phone: "Phone placeholder",
    };
    setDoc(doc(firestoreInstance, "users", user.uid), details)
    return {user, details};
  }

  const onClick = () => {

    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      var docRef = doc(firestoreInstance, 'users', user.uid);
      
      getDoc(docRef)
      .then(doc => {
        console.log()
        if (doc.exists()) {
          // id use exists do nothing
        } else {
          //user doesn't exist - create a new user in firestore
          addNewUserToFirestore(user);
          // this has resolve in front of it, idk why
        }
      })
      .catch(error => {
          console.error('Checking if customer exists failed" ' + error);
      });
      /* check if this user exists in firestore, and if so */
    }).catch((error) => {
      // Handle Errors here.
      console.log("ERRORR ", error)
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    })
    .finally(() => {
      navigateToScore()
    })
  }

  const navigateToScore = () => {
    navigate("/demo")
  }
  const SignOut = () => {
      const auth = getAuth();
      signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
  }

  if (status === 'loading') {
    return <span>loading...</span>;
  }

  if (signInCheckResult.signedIn === true) {
    return (
      <ChakraProvider theme={theme}>
        <Button size='md' onClick={() => SignOut()}>Sign Out</Button>
      </ChakraProvider>
    )
  } else {
    return (
      <ChakraProvider theme={theme}>
        <Button size='md' colorScheme='blue' onClick={() => onClick()}>Sign in</Button>
      </ChakraProvider>
    );
  }
}

export default LoginButton;

import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import { FirebaseAppProvider } from 'reactfire';
import { TourProvider } from '@reactour/tour'

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

const firebaseConfig = {
  apiKey: "AIzaSyCUrgmyBtJYrpaE7iRH3XA4IBpmwG8-4sg",
  authDomain: "siip-e2ada.firebaseapp.com",
  projectId: "siip-e2ada",
  storageBucket: "siip-e2ada.appspot.com",
  messagingSenderId: "705663877367",
  appId: "1:705663877367:web:a1d3d6466bca93251753f2",
  measurementId: "G-47C98JY4NB"
};

const steps = [
  {
    selector: '.first-step',
    content: 'Edit the name of the deck here.',
  },
  {
    selector: '.second-step',
    content: 'Upload a client logo here.',
  },
  {
    selector: '.third-step',
    content: 'Add a product to the deck here.',
  },
]

root.render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <ChakraProvider theme={theme}>
      <StrictMode>
        <ColorModeScript />
        <TourProvider steps={steps}>
          <App />
        </TourProvider>
      </StrictMode>
    </ChakraProvider>
  </FirebaseAppProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

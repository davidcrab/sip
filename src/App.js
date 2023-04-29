import React from 'react';
import { AuthProvider, FirestoreProvider, StorageProvider, useFirestore, useFirebaseApp } from 'reactfire';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { BrowserRouter, Route, Routes, Outlet, Navigate } from "react-router-dom";
import MyDecks from './Pages/MyDecks';
import CreateDeck from './Pages/CreateDeck';
import DeckPage from './Pages/DeckPage';
import Landing from './Pages/Landing';
import EditDeck from './Pages/EditDeck';
import { getAnalytics } from "firebase/analytics";
import trackPathForAnalytics from './TrackPathForAnalytics';
import { useCallback, useEffect } from 'react';
import { useLocation } from "react-router";
import { getAuth } from 'firebase/auth'; // Firebase v9+
import { getStorage } from 'firebase/storage'; // Firebase v9+
import VendorPage from './Pages/VendorPage';
import FlexPromo from './Pages/FlexPromo';
import PlaygroundPage from './Pages/PlaygroundPage';

export const App = () => {

  return (
    <AppInner />
  )
}

const AppInner = () => {
  const app = useFirebaseApp();

  const auth = getAuth(app);

  const firestoreDatabase = getFirestore(app);
  
  // firebase storage
  const storage = getStorage(app);

  return (
    <StorageProvider sdk={storage}>
      <AuthProvider sdk={auth}>
        <FirestoreProvider sdk={firestoreDatabase}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/flexPromo" element={<FlexPromo />} />
              <Route path="/demo" element={<MyDecks />} />
              <Route path="/view" element={<DeckPage />} />
              <Route path="/create" element={<CreateDeck />} />
              <Route path="/edit/:id" element={<EditDeck />} />
              <Route path="/view/:id" element={<DeckPage />} />
              <Route path="/vendorStatus" element={<VendorPage />} />
              <Route path="/playground" element={<PlaygroundPage />} />
            </Routes>
          </BrowserRouter>
        </FirestoreProvider>
      </AuthProvider>
    </StorageProvider>
  )
}

export default App;

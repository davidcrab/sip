import React from 'react';
import { FirestoreProvider, useFirestore, useFirebaseApp } from 'reactfire';
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


export const App = () => {

  // const { pathname, search } = useLocation();

  // const analytics = useCallback(() => {
  //     trackPathForAnalytics({ path: pathname, search: search, title: pathname.split("/")[1] });
  // }, [pathname, search]);

  // useEffect(() => {
  //     analytics();
  // }, [analytics]);

  return (
    <AppInner />
  )
}

const AppInner = () => {
  const app = useFirebaseApp();

  const firestoreDatabase = getFirestore(app);

  return (
    <FirestoreProvider sdk={firestoreDatabase}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/demo" element={<MyDecks />} />
          <Route path="/view" element={<DeckPage />} />
          <Route path="/create" element={<CreateDeck />} />
          <Route path="/edit/:id" element={<EditDeck />} />
          <Route path="/view/:id" element={<DeckPage />} />
        </Routes>
      </BrowserRouter>
    </FirestoreProvider>
  )
}

export default App;

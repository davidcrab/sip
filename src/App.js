import React from 'react';
import { FirestoreProvider, useFirestore, useFirebaseApp } from 'reactfire';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { BrowserRouter, Route, Routes, Outlet, Navigate, useLocation } from "react-router-dom";
import MyDecks from './Pages/MyDecks';
import CreateDeck from './Pages/CreateDeck';
import DeckPage from './Pages/DeckPage';
import Landing from './Pages/Landing';

export const App = () => {
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
          <Route path="/view/:id" element={<DeckPage />} />
        </Routes>
      </BrowserRouter>
    </FirestoreProvider>
  )
}

export default App;

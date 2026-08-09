import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import AddPlacePage from './pages/AddPlacePage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/place/:id" element={<PlaceDetailsPage />} />
        <Route path="/add" element={<AddPlacePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

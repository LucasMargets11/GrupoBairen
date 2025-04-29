import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import PropertyListPage from './pages/admin/PropertyListPage';
import PropertyFormPage from './pages/admin/PropertyFormPage';
import ContactPage from './pages/ContactPage';
import { properties } from './data/properties';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage properties={properties} />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/property/:id" element={<PropertyDetailsPage properties={properties} />} />
              <Route path="/admin/properties" element={<PropertyListPage />} />
              <Route path="/admin/properties/new" element={<PropertyFormPage />} />
              <Route path="/admin/properties/:id/edit" element={<PropertyFormPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
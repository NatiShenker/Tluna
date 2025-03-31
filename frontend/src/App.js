import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewComplaint from './pages/NewComplaint';
import ComplaintDetails from './pages/ComplaintDetails';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/complaints/new"
            element={
              <PrivateRoute>
                <NewComplaint />
              </PrivateRoute>
            }
          />
          <Route
            path="/complaints/:id"
            element={
              <PrivateRoute>
                <ComplaintDetails />
              </PrivateRoute>
            }
          />
        </Routes>
      </Container>
    </Box>
  );
}

export default App; 
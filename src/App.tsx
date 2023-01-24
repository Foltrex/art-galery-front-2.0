import React, { PropsWithChildren, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Layout from './components/layout/Layout';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Organization from './pages/home';
import Facilities from './pages/facilities';
import Representatives from './pages/representatives';
import Login from './pages/signin';
import Register from './pages/signup';
import PrivateRoute from './components/routes/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signin' element={<Login />} />
        <Route path='/signup' element={<Register />} />

        <Route path='/' element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Organization />} />
          <Route path='facilities' element={<Facilities />} />
          <Route path='representatives' element={<Representatives />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

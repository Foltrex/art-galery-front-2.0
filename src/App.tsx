import React from 'react';
import './App.css';
import Layout from './components/layout/Layout';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import OrganizationProfile from './pages/home';
import Facilities from './pages/facilities';
import Representatives from './pages/representatives';
import Login from './pages/auth/signin';
import Register from './pages/auth/signup';
import PrivateRoute from './components/routes/PrivateRoute';
import PasswordRecovery from "./pages/auth/passwordrecovery";
import MapTest from "./components/map/MapTest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth/signin' element={<Login />} />
        <Route path='/auth/signup' element={<Register />} />
        <Route path='/auth/passwordrecovery' element={<PasswordRecovery />} />
        <Route path='/map' element={<MapTest />} />

        <Route path='/' element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<OrganizationProfile />} />
          <Route path='facilities' element={<Facilities />} />
          <Route path='representatives' element={<Representatives />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

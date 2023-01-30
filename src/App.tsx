import React, { useEffect } from 'react';
import './App.css';
import Layout from './components/layout/Layout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import OrganizationProfile from './pages/home';
import Facilities from './pages/facilities';
import Representatives from './pages/representatives';
import Login from './pages/auth/signin';
import Register from './pages/auth/signup';
import PrivateRoute from './components/routes/PrivateRoute';
import PasswordRecovery from "./pages/auth/passwordrecovery";
import { useFetch } from './hooks/react-query';
import FacilityForm from './pages/facilities/FacilityForm';
import { FacilityApi } from './api/FacilityApi';

function App() {

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/auth/signin' element={<Login />} />
				<Route path='/auth/signup' element={<Register />} />
				<Route path='/auth/passwordrecovery' element={<PasswordRecovery />} />

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

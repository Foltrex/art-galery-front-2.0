import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/routes/PrivateRoute';
import ArtCreation from './pages/art/artist/ArtCreation';
import ArtistArt from './pages/art/artist/ArtistArt';
import RepresentativeArt from './pages/art/representative/RepresentativeArt';
import Arts from './pages/arts';
import PasswordRecovery from "./pages/auth/passwordrecovery";
import Login from './pages/auth/signin';
import Register from './pages/auth/signup';
import Facilities from './pages/facilities';
import Profile from './pages/home';
import Representatives from './pages/representatives';
import Settings from "./pages/settings";
import { AuthService } from "./services/AuthService";
import Proposals from './pages/proposals';
import ArtistProfile from './pages/artists/ArtistProfile';
import Organization from './pages/organization';

function App() {

    window.addEventListener('beforeunload', (event) => {
        if (!AuthService.getRememberMe()) {
            AuthService.logout()
        }
    });

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/auth/signin' element={<Login/>}/>
                <Route path='/auth/signup' element={<Register/>}/>
                <Route path='/auth/passwordrecovery' element={<PasswordRecovery/>}/>

                <Route path='/' element={
                    <PrivateRoute>
                        <Layout/>
                    </PrivateRoute>
                }>
                    <Route index element={<Profile/>}/>
                    <Route path='facilities' element={<Facilities/>}/>
                    <Route path='representatives' element={<Representatives/>}/>
                    <Route path='proposals' element={<Proposals />}/>
                    <Route path='organization' element={<Organization />} />

                    <Route path='arts'>
                        <Route path='artist'>
                            <Route index element={<Arts />} />
                            <Route path='new' element={<ArtCreation />} />
                            <Route path=':id' element={<ArtistArt />} />
                        </Route>

                        <Route path='representative'>
                            <Route index element={<Arts />} />
                            <Route path=':id' element={<RepresentativeArt />} />
                        </Route>
                    </Route>

                    <Route path='artists'>
                        <Route path=':id' element={<ArtistProfile />} />
                    </Route>

                    <Route path='settings' element={<Settings/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

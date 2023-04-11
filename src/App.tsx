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
import UserRoute from './pages/users/UserRoute';
import Settings from "./pages/settings";
import Proposals from './pages/proposals';
import ArtistProfile from './pages/artists/ArtistProfile';
import {BrowserRouter, Route, Routes,} from "react-router-dom";
import Organizations from './pages/organizations';
import OrganizationNew from "./pages/organizations/OrganizationNew";
import OrganizationEdit from './pages/organizations/OrganizationEdit';
import ErrorPage from "./pages/error/ErrorPage";
import ArtistsGrid from "./pages/artists/ArtistsGrid";
import Error404 from "./pages/error/Error404";
import ProfilePage from "./pages/home";
import ArtFormatFilter from './components/form/art-format-filter/ArtFormatFilter';
import ArtSizeFilter from './components/form/art-size-filter/ArtSizeFilter';
import ArtStyleFilter from './components/form/art-style-filter/ArtStyleFilter';
import ArtTopicFilter from './components/form/ArtTopicFilter';
import ArtTypeFilter from './components/form/ArtTypeFilter';
import FacilityEdit from "./pages/facilities/FacilityEdit";

function App() {
    //@Todo maybe bug here
    window.addEventListener('beforeunload', (event) => {
        // if (!AuthService.getRememberMe()) {
        //     AuthService.logout()
        // }
    });

    return (
        <BrowserRouter basename={"/admin"}>
            <Routes>
                <Route
                    path='/testing'
                    element={
                        <>
                            <ArtFormatFilter/>
                            <ArtSizeFilter/>
                            <ArtStyleFilter/>
                            <ArtTopicFilter/>
                            <ArtTypeFilter/>
                        </>
                    }
                />
                <Route path='/auth/signin' element={<Login/>}/>
                <Route path='/auth/signup' element={<Register/>}/>
                <Route path='/auth/passwordrecovery' element={<PasswordRecovery/>}/>

                <Route
                    path='/'
                    errorElement={<ErrorPage/>}
                    element={
                        <PrivateRoute>
                            <Layout/>
                        </PrivateRoute>
                    }
                >
                    <Route index element={<ProfilePage/>}/>

                    <Route path={"organizations"}>
                        <Route index element={<Organizations/>}/>
                        <Route path={":id"} element={<OrganizationEdit/>}/>
                        <Route path={"new"} element={<OrganizationNew/>}/>
                    </Route>

                    <Route path='facilities'>
                        <Route index element={<Facilities/>}/>
                        <Route path={":id"} element={<FacilityEdit/>}/>
                        <Route path={"new"} element={<FacilityEdit/>}/>
                    </Route>

                    <Route path='users' element={<UserRoute/>}/>
                    <Route path='proposals' element={<Proposals/>}/>

                    <Route path='gallery'>
                        <Route index element={<Arts />} />
                        <Route path=':id' element={<ArtistArt />} />
                    </Route>

                    <Route path='arts'>
                        <Route path='artist'>
                            <Route index element={<Arts/>}/>
                            <Route path='new' element={<ArtCreation/>}/>
                            <Route path=':id' element={<ArtistArt/>}/>
                        </Route>

                        <Route path='representative'>
                            <Route index element={<Arts/>}/>
                            <Route path=':id' element={<RepresentativeArt/>}/>
                        </Route>
                    </Route>

                    <Route path='artists'>
                        <Route index element={<ArtistsGrid/>}/>
                        <Route path=':id' element={<ArtistProfile/>}/>
                    </Route>

                    <Route path='settings' element={<Settings/>}/>
                </Route>
                <Route path={"*"} element={<Error404/>}/>
            </Routes>
        </BrowserRouter>
    );
}


export default App;

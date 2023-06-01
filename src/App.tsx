import './App.css';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/routes/PrivateRoute';
import PasswordRecovery from "./pages/auth/passwordrecovery";
import Login from './pages/auth/signin';
import Register from './pages/auth/signup';
import Facilities from './pages/facilities';
import UserRoute from './pages/users/UserRoute';
import {BrowserRouter, Route, Routes,} from "react-router-dom";
import OrganizationNew from "./pages/organizations/OrganizationNew";
import OrganizationEdit from './pages/organizations/OrganizationEdit';
import ErrorPage from "./pages/error/ErrorPage";
import Error404 from "./pages/error/Error404";
import {FacilityNewRoute} from "./pages/facilities/FacilityNewRoute";
import {FacilityEditRoute} from "./pages/facilities/FacilityEditRoute";
import {EditUserPage} from "./pages/users/EditUserPage";
import {AddUserPage} from "./pages/users/AddUserPage";
import ProfilePage from './pages/users/ProfilePage';
import {ErrorsRoute} from './pages/error/ErrorsRoute';
import OrganizationsRoute from './pages/organizations/OrganizationsRoute';
import {EditArt} from "./pages/arts/EditArt";
import {CreateArt} from "./pages/arts/CreateArt";
import {ThreadList} from "./pages/support/ThreadList";
import {NewThread} from "./pages/support/NewThread";
import {EditThread} from "./pages/support/EditThread";
import ProposalsGrid from "./pages/proposals/ProposalsGrid";
import {GalleryRoute} from "./pages/arts/GalleryRoute";

function App() {
    return (
        <BrowserRouter basename={"/admin"}>
            <Routes>
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

                    <Route path={"/organizations"}>
                        <Route index element={<OrganizationsRoute/>}/>
                        <Route path={":id"} element={<OrganizationEdit/>}/>
                        <Route path={"new"} element={<OrganizationNew/>}/>
                    </Route>

                    <Route path='/facilities'>
                        <Route index element={<Facilities/>}/>
                        <Route path={":id"} element={<FacilityEditRoute/>}/>
                        <Route path={"new"} element={<FacilityNewRoute/>}/>
                    </Route>

                    <Route path='/users'>
                        <Route index element={<UserRoute/>}/>
                        <Route path={":id"} element={<EditUserPage/>} />
                        <Route path={"new"} element={<AddUserPage/>} />
                    </Route>

                    <Route path='/errors'>
                        <Route index element={<ErrorsRoute/>}/>
                    </Route>

                    <Route path='/proposals'>
                        <Route index element={<ProposalsGrid/>}/>
                    </Route>

                    <Route path='/gallery'>
                        <Route index element={<GalleryRoute />} />
                        <Route path=':id' element={<EditArt />} />
                        <Route path='new' element={<CreateArt />} />
                    </Route>
                    <Route path='/support'>
                        <Route index element={<ThreadList />} />
                        <Route path=':id' element={<EditThread />} />
                        <Route path='new' element={<NewThread />} />
                    </Route>
                </Route>
                <Route path={"*"} element={<Error404/>}/>
            </Routes>
        </BrowserRouter>
    );
}


export default App;

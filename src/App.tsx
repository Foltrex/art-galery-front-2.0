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
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: '/admin/auth/signin',
        element: <Login/>
    },
    {
        path: '/admin/auth/signup',
        element: <Register/>
    },
    {
        path: '/admin/auth/passwordrecovery',
        element: <PasswordRecovery/>
    },
    {
        path: "/admin",
        element: (<PrivateRoute>
            <Layout/>
        </PrivateRoute>),
        children: [
            {
                index: true,
                element: <Profile />,
            },
            {
                path: 'facilities',
                element: <Facilities />,
            },
            {
                path: 'representatives',
                element: <Representatives />,
            },
            {
                path: 'proposals',
                element: <Proposals />,
            },
            {
                path: 'organization',
                element: <Organization />,
            },
            {
                path: 'arts',
                children: [
                    {
                        path: 'artist',
                        children: [
                            {
                                index: true,
                                element: <Arts />
                            },
                            {
                                path: 'new',
                                element: <ArtCreation />
                            },
                            {
                                path: ':id',
                                element: <ArtistArt />
                            },
                        ],
                    },
                    {
                        path: 'representative',
                        children: [
                            {
                                index: true,
                                element: <Arts />
                            },
                            {
                                path: ':id',
                                element: <RepresentativeArt />
                            },
                        ],
                    },
                ]
            },
            {
                path: 'artists',
                children: [
                    {
                        path: ":id",
                        element: <ArtistProfile/>
                    }
                ]
            },
            {
                path: "settings",
                element: <Settings/>
            }
        ],
    },
]);

function App() {
    window.addEventListener('beforeunload', (event) => {
        if (!AuthService.getRememberMe()) {
            AuthService.logout()
        }
    });

    return (
        <RouterProvider router={router} />
    );
}

export default App;

import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute: React.FC<PropsWithChildren> = ({children}) => {
    // const [cookies] = useCookies();
    const isAuthorized = true;

    return <>{isAuthorized ? children : <Navigate to='/login' />}</>;
}

export default PrivateRoute;
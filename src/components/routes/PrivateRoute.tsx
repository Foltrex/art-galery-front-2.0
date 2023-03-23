import { PropsWithChildren } from "react";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

const PrivateRoute: React.FC<PropsWithChildren> = ({children}) => {
    const [cookies] = useCookies(['token']);

    return <>{cookies.token ? children : <Navigate to='/admin/auth/signin' />}</>;
}

export default PrivateRoute;
import {PropsWithChildren, useEffect} from "react";
import {Navigate} from "react-router-dom";
import {CircularProgress} from "@mui/material";
import {useGetAccountById} from "../../api/AccountApi";
import {useCookies} from "react-cookie";
import {TokenService} from "../../services/TokenService";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {observer} from "mobx-react";

const PrivateRouteInternal: React.FC<PropsWithChildren> =  observer(({children}) => {
    const {isFetching, isLoading, data, isError} = useGetAccountById(TokenService.getCurrentAccountId());
    const {authStore} = useRootStore();
    useEffect(() => {
        if(!isFetching && !isLoading) {
            data && authStore.setAccount(data);
        }
    }, [data, isFetching, isLoading])
    if(isError) {
        return <Navigate to='/auth/signin' />;
    }

    if(isFetching || isLoading || !authStore.account) {
        return <div style={{display: 'flex', paddingTop: 50, flexDirection: "row", alignItems: 'center', justifyContent: 'center'}}>
            <CircularProgress />
        </div>
    } else if(!data) {
        return <Navigate to='/auth/signin' />;
    } else {
        return <div>{children}</div>;
    }
})
const PrivateRoute: React.FC<PropsWithChildren> = ({children}) => {
    const [cookies] = useCookies(['token']);
    if(!cookies || !cookies.token) {
        return <Navigate to='/auth/signin' />;
    }
    return <PrivateRouteInternal>{children}</PrivateRouteInternal>;
}

export default PrivateRoute;

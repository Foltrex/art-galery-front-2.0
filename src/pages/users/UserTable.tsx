import * as React from 'react';
import { useState } from 'react';
import { IUserGridProps, UserGrid } from "../../components/users/UserGrid";
import { AuthService } from '../../services/AuthService';
import { TokenService } from '../../services/TokenService';
import { useRootStore } from "../../stores/provider/RootStoreProvider";
import { IPage } from '../../hooks/react-query';
import { Account } from '../../entities/account';
import { useGetAll } from '../../api/AccountApi';

interface IUserTableProps {
    cityId?: string;
    username?: string;
    usertype?: string;
    organizationId?: string;
}

const UserTable: React.FunctionComponent<IUserTableProps> = ({ 
    username, 
    usertype, 
    cityId, 
    organizationId
}) => {
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [pageNumber, setPageNumber] = useState(0);

    const [sort, setSort] = useState<string>();

    const applySort = (key: string, direction: string | undefined) => {
        setSort(direction ? key + "," + direction : undefined);
    }
    const { data } = useGetAll({
        page: pageNumber, 
        size: rowsPerPage, 
        username: username,
        usertype: usertype, 
        cityId: cityId,
        organizationId: organizationId, 
        sort
    });

    return (
        <UserGrid 
        data={data} 
        rowsPerPage={rowsPerPage} 
        onRowsPerPageChange={setRowsPerPage} 
        onPageNumberChange={setPageNumber} 
        applySort={applySort} />
    );
};

export default UserTable;

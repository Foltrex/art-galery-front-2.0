import * as React from 'react';
import {IColumnType} from '../../components/table/Table';
import {Representative} from '../../entities/representative';
import {AuthService} from '../../services/AuthService';
import {TokenService} from '../../services/TokenService';
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {UserGrid} from "../../components/users/UserGrid";

interface IRepresentativeTableProps {
}

interface IRepresentativeData {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    organizationRole: string;
    facility: string;
}

const columns: IColumnType<IRepresentativeData>[] = [
	{key: 'firstname', title: 'Firstname'},
	{key: 'lastname', title: 'lastname'},
	{key: 'email', title: 'Email'},
	{key: 'organizationRole', title: 'Role'},
    {key: 'facility', title: 'Facility'}
];

const mapRepresentativeToTableRow = (representative: Representative): IRepresentativeData => {
    const { facility, organizationRole } = representative;
        
    return {
        id: representative.id,
        firstname: representative.firstname,
        lastname: representative.lastname,
        email: 'unknown',
        organizationRole: organizationRole?.name,
        facility: facility?.name
    };
}

const RepresentativeTable: React.FunctionComponent<IRepresentativeTableProps> = (props) => {


    const token = TokenService.decode(AuthService.getToken());
    const {authStore} = useRootStore();
    const account = authStore.account;



	return <UserGrid />;
};

export default RepresentativeTable;

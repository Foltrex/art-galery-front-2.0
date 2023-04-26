import * as React from 'react';
import {TokenService} from '../../services/TokenService';
import {AccountEnum} from '../../entities/enums/AccountEnum';
import ArtistOrganizationsTable from './ArtistOrganizationsTable';
import OrganizationGrid from './OrganizationsGrid';

interface IOrganizationsRouteProps {
}

const OrganizationsRoute: React.FunctionComponent<IOrganizationsRouteProps> = (props) => {
    if (TokenService.getCurrentAccountType() === AccountEnum.ARTIST) {
        return <ArtistOrganizationsTable />
    } else {
        return <OrganizationGrid />;
    }
};

export default OrganizationsRoute;

import React, {useMemo} from 'react';
import FacilityTable from './FacilityTable';
import {findOrganizationId} from "../../util/MetadataUtil";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {useNavigate} from "react-router-dom";

const Facilities = () => {
	const navigate = useNavigate();
	const {authStore} = useRootStore();
	const account = authStore.account;
	const organizationId = useMemo(() => findOrganizationId(account), [account]);
	return <FacilityTable edit={(id) => navigate("/facilities/" + id)} organizationId={organizationId}/>;
};

export default Facilities;

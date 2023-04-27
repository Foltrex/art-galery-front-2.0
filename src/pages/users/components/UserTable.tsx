import {Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import * as React from 'react';
import {useState} from 'react';
import {useGetAll} from '../../../api/AccountApi';
import CityDropdown from "../../../components/cities/CityDropdown";
import {OrganizationsDropdown} from "../../../components/form/OrganizationsDropdown";
import {TypeFilter} from "../../../components/form/TypeFilter";
import {useNavigate} from "react-router-dom";
import {useRootStore} from "../../../stores/provider/RootStoreProvider";
import {isCreatorOrAdmin} from "../../../util/MetadataUtil";
import {AccountEnum} from "../../../entities/enums/AccountEnum";
import {TokenService} from "../../../services/TokenService";
import {UserGrid} from "../../../components/users/UserGrid";

interface IUserTableProps {
    organizationId?: string;
}

const UserTable: React.FunctionComponent<IUserTableProps> = (props) => {

    const [cityId, setCityId] = useState<string>();
    const [oId, setOrganizationId] = useState<string>();
    const organizationId = props.organizationId || oId;
    const [username, setUsername] = useState<string>()
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [pageNumber, setPageNumber] = useState(0);
    const [userType, setUserType] = useState<string>('');
    const navigate = useNavigate();
    const {authStore} = useRootStore();
    const canCreateUser = authStore.account.accountType === AccountEnum.SYSTEM || isCreatorOrAdmin(authStore.account);

    const [sort, setSort] = useState<string>();

    const applySort = (key: string, direction: string | undefined) => {
        setSort(direction ? key + "," + direction : undefined);
    }
    const { data } = useGetAll({
        page: pageNumber,
        size: rowsPerPage,
        name: username,
        usertype: userType,
        cityId: cityId,
        organizationId: organizationId,
        sort
    });

    const loggedUserAccountType = TokenService.getCurrentAccountType();
    const userTypes = Object
        .keys(AccountEnum)
        .filter(type => loggedUserAccountType === AccountEnum.SYSTEM || type !== AccountEnum.SYSTEM);

    const handleUsertypeChange = (e: SelectChangeEvent<string>) => {
        const currentUserType = userTypes.find(type => type === e.target.value);
        setUserType(currentUserType || '');
    }

    return (
        <div>
            <Box sx={{ display: 'flex', gap: '20px' }}>
                <TypeFilter onChange={(text) => setUsername(text)} placeholder={"Lastname/Firstname"} />

                <CityDropdown value={cityId} onChange={setCityId} />

                {!props.organizationId && <OrganizationsDropdown onChange={setOrganizationId} />}

                <FormControl size='small'>
                    <InputLabel id='usertype-dropdown'>Usertype</InputLabel>
                    <Select
                        labelId='usertype-dropdown'
                        label='Usertype'
                        value={userType}
                        onChange={handleUsertypeChange}
                    >
                        <MenuItem value=''>All</MenuItem>
                        {userTypes.map(type => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {canCreateUser && 
                    <FormControl size='small' style={{marginLeft: 'auto'}}>
                        <Button variant={"text"} onClick={() => navigate("/users/new")}>
                            New User
                        </Button>
                    </FormControl>
                }
            </Box>

            <UserGrid
                organizationId={organizationId}
                data={data}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={setRowsPerPage}
                onPageNumberChange={setPageNumber}
                applySort={applySort} />
        </div>
    );


};

export default UserTable;

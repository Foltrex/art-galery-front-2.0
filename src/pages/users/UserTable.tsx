import * as React from 'react';
import {useState} from 'react';
import {UserGrid} from "../../components/users/UserGrid";
import {TokenService} from '../../services/TokenService';
import {useGetAll} from '../../api/AccountApi';
import {AccountEnum} from "../../entities/enums/AccountEnum";
import {Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import CityDropdown from "../../components/cities/CityDropdown";
import SearchBar from "../../components/ui/SearchBar";
import {OrganizationsFilter} from "../../components/form/OrganizationsFilter";

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


    const [sort, setSort] = useState<string>();

    const applySort = (key: string, direction: string | undefined) => {
        setSort(direction ? key + "," + direction : undefined);
    }
    const { data } = useGetAll({
        page: pageNumber,
        size: rowsPerPage,
        username: username,
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
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Typography variant='h4' align='left'>
                    <b>Representatives</b>
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', my: 2, justifyContent: 'space-around' }}>
                <FormControl sx={{ flex: '15%', mx: 1 }} size='small'>
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

                <CityDropdown value={cityId} onChange={setCityId} />

                <SearchBar
                    style={{ flex: '30%', marginLeft: 1, marginRight: 1 }}
                    onSearch={(text) => setUsername(text)}
                    placeholder={'Enter lastname/firstname...'}
                />

                {!props.organizationId && <OrganizationsFilter setOrganizationId={setOrganizationId} />}
            </Box>

            <UserGrid
                data={data}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={setRowsPerPage}
                onPageNumberChange={setPageNumber}
                applySort={applySort} />
        </div>
    );


};

export default UserTable;

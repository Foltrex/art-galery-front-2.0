import AddIcon from '@mui/icons-material/Add';
import {Box, Container, FormControl, FormControlLabel, IconButton, Radio, RadioGroup, Tooltip} from '@mui/material';

import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useGetAllArts} from '../../api/ArtApi';
import ScrollTop from '../../components/ui/ScrollTop';
import InfiniteArtList from './components/InfiniteArtList';
import LoadMoreButton from '../../components/ui/LoadMoreButton';
import {AccountEnum} from '../../entities/enums/AccountEnum';
import {TypeFilter} from "../../components/form/TypeFilter";
import CityDropdown from "../../components/cities/CityDropdown";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import UsersAutocomplete from "../../components/form/UsersAutocomplete";

const Arts = () => {
    const navigate = useNavigate();
    const {authStore} = useRootStore();

    const [artSearch, setArtSearch] = useState<string>();
    const [artistId, setArtistId] = useState<string>();
    const [cityId, setCityId] = useState<string>();

    const all = {label: 'All', value: 'all'};
    const exhibited = {label: 'Exhibited', value: 'exhibited'};
    const free =  {label: 'Free', value: 'free'};

    const searchFilters: Array<{ label: string, value: string }> = [
        all,
        exhibited,
        free,
    ];

    const accountType = authStore.account.accountType;

    const [artStatus, setArtStatus] = useState(
        accountType === AccountEnum.ARTIST || accountType === AccountEnum.REPRESENTATIVE
            ? free.value
            : all.value
    );

    const {data: infinteData, isSuccess, fetchNextPage} = useGetAllArts({
        sort: 'dateCreation,desc',
        searchText: artSearch,
        artistId: accountType === AccountEnum.ARTIST ? authStore.account.id : artistId,
        cityId: artStatus === exhibited.value ? cityId : undefined
    });

    const lastPage = infinteData?.pages.at(-1);
    const isNotLast = lastPage && !lastPage.last;

    return (
        <Container sx={{position: 'relative'}}>
                <Box sx={{display: 'flex', gap: '20px'}}>

                    <TypeFilter onChange={setArtSearch} placeholder={"Art description"}/>
                    {accountType !== AccountEnum.ARTIST && <UsersAutocomplete userType={AccountEnum.ARTIST} onChange={id => setArtistId(id)}/>}
                    <FormControl>
                        <RadioGroup
                            value={artStatus}
                            onChange={(e) => setArtStatus(e.target.value)}
                            row
                        >
                            {searchFilters.map(filter => (
                                <FormControlLabel
                                    key={filter.value}
                                    control={<Radio size='small'/>}
                                    value={filter.value}
                                    label={filter.label}/>
                            ))}
                        </RadioGroup>
                    </FormControl>

                    {artStatus === exhibited.value && <CityDropdown onChange={setCityId}/>}

                    {accountType === AccountEnum.ARTIST &&
                        <Tooltip title='Add New Art'>
                            <IconButton onClick={() => navigate('/gallery/new')}>
                                <AddIcon fontSize='large'/>
                            </IconButton>
                        </Tooltip>
                    }
                </Box>


            {isSuccess && <InfiniteArtList infinteData={infinteData}/>}

            {isNotLast && <LoadMoreButton onClick={() => fetchNextPage()}/>}

            <ScrollTop/>
        </Container>
    );
};

export default Arts;

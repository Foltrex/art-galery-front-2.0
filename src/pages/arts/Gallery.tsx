import {Box, Button, Container, FormControl, FormControlLabel, Radio, RadioGroup} from '@mui/material';

import * as React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useGetAllArts} from '../../api/ArtApi';
import ScrollTop from '../../components/ui/ScrollTop';
import {AccountEnum} from '../../entities/enums/AccountEnum';
import {TypeFilter} from "../../components/form/TypeFilter";
import CityDropdown from "../../components/cities/CityDropdown";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import UsersAutocomplete from "../../components/form/UsersAutocomplete";
import InfiniteScroll from 'react-infinite-scroll-component';
import ArtItem from "./components/ArtItem";
import Loading from "../../components/ui/Loading";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import {EntityFileTypeEnum} from "../../entities/enums/EntityFileTypeEnum";
import {getErrorMessage} from "../../components/error/ResponseError";


const Gallery = () => {
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

    const {data: infiniteData, isSuccess, fetchNextPage, isError, error} = useGetAllArts({
        sort: 'dateCreation,desc',
        searchText: artSearch,
        artistId: accountType === AccountEnum.ARTIST ? authStore.account.id : artistId,
        cityId: artStatus === exhibited.value ? cityId : undefined
    }, () => {getErrorMessage("Failed to load gallery", error)});

    const lastPage = infiniteData?.pages.at(-1);
    const isNotLast = !!(lastPage && !lastPage.last);

    const images = infiniteData?.pages || [];

    return (
        <Container sx={{position: 'relative'}}>
                <Box sx={{display: 'flex', gap: '20px', marginBottom: '20px'}}>

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
                            <Button style={{marginLeft: "auto"}} variant={'text'} onClick={() => navigate('/gallery/new')}>
                                New art
                            </Button>
                    }
                </Box>


            <InfiniteScroll
                style={{overflow: "hidden"}}
                dataLength={images.length} //This is important field to render the next data
                next={fetchNextPage}
                hasMore={isNotLast}
                loader={<Loading center={true}/>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>No more results</b>
                    </p>
                }
            >
                <ResponsiveMasonry
                    columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
                >
                <Masonry
                    style={{gap: '20px'}}
                    //columns={{sx: 1, sm: 2, md: 3, lg: 4}} spacing={2}
                >
                    {images.map(page => (
                        page.content.map(art => {
                            return <ArtItem key={art.id} art={art} imageType={EntityFileTypeEnum.THUMBNAIL}/>
                        })
                    ))}
                </Masonry>
                </ResponsiveMasonry>
            </InfiniteScroll>
            {/*isSuccess && <InfiniteArtList infinteData={infinteData}/>*/}


            <ScrollTop/>
        </Container>
    );
};

export default Gallery;

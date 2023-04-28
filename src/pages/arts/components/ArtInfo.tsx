import {History} from '@mui/icons-material';
import {Box, Button, Stack, Typography} from '@mui/material';
import * as React from 'react';
import {useMemo} from 'react';
import dayjs from 'dayjs';
import {useGetAccountById} from '../../../api/AccountApi';
import {Art as ArtEntity} from '../../../entities/art';
import ArtExhibitionHistory from './ArtExhibitionHistory';
import {useNavigate} from "react-router-dom";
import {useRootStore} from "../../../stores/provider/RootStoreProvider";

interface IArtInfoProps {
    art: ArtEntity;
    canEdit: boolean,
    switchMode: (edit:boolean) => void
}

const ArtInfo: React.FunctionComponent<IArtInfoProps> = ({art,canEdit, switchMode}) => {
    const [showArtExhibitionHistory, setShowArtExhibitionHistory] = React.useState(false);
    const navigate = useNavigate();
    const {authStore} = useRootStore();
    const account = authStore.account;
    const {data: artist} = useGetAccountById(art.artistAccountId)

    const artStyle = useMemo(() => {
        return art.artStyles && art.artStyles
            .map(s => s.label)
            .join(', ')
    }, [art])

    return (
        <>
            <table className={"view-table"}>
                <tbody>
                {art.name && <tr>
                    <td/>
                    <td>
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography sx={{fontSize: '2em'}}>
                                {art.name}
                            </Typography>
                        </Box>
                    </td>
                </tr>}
                <tr>
                    <td className={"label"}>Artist</td>
                    <td>{`${artist?.firstName} ${artist?.lastName}`}</td>
                </tr>
                <tr>
                    <td className={"label"}>Created At</td>
                    <td>{art.dateCreation && dayjs(art.dateCreation).format("MMMM YYYY")}</td>
                </tr>
                {artStyle && <tr>
                    <td className={"label"}>Style</td>
                    <td>{artStyle}</td>
                </tr>}
                {art.artSize?.label && <tr>
                    <td className={"label"}>Size</td>
                    <td>{art.artSize?.label}</td>
                </tr>}
                {art.description && <tr>
                    <td className={"label"}>Description</td>
                    <td><div style={{whiteSpace: 'pre-wrap', lineHeight: '27px', paddingTop: 6}}>{art.description}</div></td>
                </tr>}
                <tr>
                    <td colSpan={2}>
                        <Stack gap={'10px'} direction={"row"}>
                            <Button variant={"outlined"} type={"button"} onClick={() => navigate("/gallery")}>
                                Back
                            </Button>
                            <Button variant={"outlined"} type={"button"} onClick={() => setShowArtExhibitionHistory(true)}
                                    startIcon={<History/>}
                            >
                                Exhibition history
                            </Button>
                            {account.id === art?.artistAccountId &&
                                <Button type={"button"} variant={"outlined"} color={'error'} onClick={() => switchMode(!canEdit)} style={{marginLeft: "auto"}}>
                                    {canEdit ? 'View mode' : 'Back to edit mode'}
                                </Button>
                            }
                        </Stack>
                    </td>
                </tr>
                </tbody>
            </table>

            <ArtExhibitionHistory
                art={art}
                open={showArtExhibitionHistory}
                onClose={() => setShowArtExhibitionHistory(false)}/>
        </>
    );
};

export default ArtInfo;

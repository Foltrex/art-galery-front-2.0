import {Close} from '@mui/icons-material';
import {Dialog, DialogContent, DialogTitle, IconButton, ImageList} from '@mui/material';
import * as React from 'react';
import {useState} from 'react';
import {useGetAllArtsByAccountIdAndSearchText} from '../../../api/ArtApi';
import ProposalDialog from '../../../components/ui/ProposalDialog';
import {Art} from '../../../entities/art';
import {TokenService} from '../../../services/TokenService';
import ArtCard from './ArtCard';

interface IProposalDialogProps {
    open: boolean;
    onClose: () => void;
}

const ArtsDialog: React.FunctionComponent<IProposalDialogProps> = ({open, onClose}) => {
    const [art, setArt] = useState<Art>();
    const [openProposalDialog, setOpenProposalDialog] = useState(false);

    const handlePropose = (art: Art) => {
        setArt(art);
        setOpenProposalDialog(true);
    }

    const handleProposalDialogClick = () => {
        setOpenProposalDialog(false);
    }

    const token = TokenService.getCurrentDecodedToken();

    const {data: infiniteData, isSuccess, fetchNextPage} = useGetAllArtsByAccountIdAndSearchText(token.id);

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth='sm'
            >
                <DialogTitle sx={{display: 'relative'}}>
                    <h3>
                        Select proposal art
                    </h3>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 15,
                            top: 25
                        }}
                    >
                        <Close fontSize='large'/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <ImageList cols={3} rowHeight={170}>
                        {isSuccess && infiniteData.pages.map(page => (
                            page.content.map(art => (
                                <ArtCard key={art.id} art={art} onPropose={handlePropose}/>
                            ))
                        ))}
                    </ImageList>
                </DialogContent>
            </Dialog>

            {art &&
                <ProposalDialog
                    art={art}
                    open={openProposalDialog}
                    onClose={handleProposalDialogClick}
                />
            }
        </>
    );
};

export default ArtsDialog;

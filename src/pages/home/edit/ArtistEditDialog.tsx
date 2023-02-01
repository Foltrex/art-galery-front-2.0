import React from 'react';
import {Dialog, DialogContent, DialogTitle, Divider} from "@mui/material";
import {Organization} from "../../../entities/organization";
import {Address} from "../../../entities/address";
import {Artist} from "../../../entities/artist";

interface IArtistEditDialogProps {
    open: boolean;
    onClose: () => void;
    artist: Artist,
}

interface IFormValues {
    firstname: string | null,
    lastname: string | null,
    description: string | null,
    address: Address | null | string,
}

const ArtistEditDialog = ({open, onClose, artist}: IArtistEditDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth='xs'>
            <DialogTitle>Edit artist</DialogTitle>
            <Divider/>
            <DialogContent style={{paddingTop: "0px"}}>
            </DialogContent>
        </Dialog>
    );
};

export default ArtistEditDialog;
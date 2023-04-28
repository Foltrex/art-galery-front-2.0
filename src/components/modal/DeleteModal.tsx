import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider} from '@mui/material';
import * as React from 'react';

interface IDeleteModalProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    contextText?: string;
}

const DeleteModal: React.FunctionComponent<IDeleteModalProps> = ({open, onClose, onDelete, contextText}) => {
    const handleDelete = () => {
        onDelete();
        onClose();
    }

    return (
        <Dialog open={open}>
            <DialogTitle>
                Please confirm the following action
            </DialogTitle>
            <Divider/>
            <DialogContent>
                <DialogContentText>
                    {contextText !== undefined ?
                        contextText : 'Do you really want to delete this record? This action cannot be undone.'
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleDelete} variant='contained'>Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteModal;

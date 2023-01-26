import { Dialog, DialogTitle, Divider, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import * as React from 'react';

interface IDeleteModalProps {
	open: boolean;
	onClose: () => void;
	onDelete: () => void;
}

const DeleteModal: React.FunctionComponent<IDeleteModalProps> = ({ open, onClose, onDelete }) => {
	return (
		<Dialog open={open}>
			<DialogTitle>
				Are you sure?
			</DialogTitle>
			<Divider />
			<DialogContent>
				<DialogContentText>
					Do you really want to delete this record? This action cannot be undone.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={onDelete} variant='contained'>Delete</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteModal;

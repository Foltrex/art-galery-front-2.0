
import { Dialog, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import Big from 'big.js';
import { useFormik } from 'formik';
import * as React from 'react';

interface FormValues {
	money: Big;
}

interface IProposalDialogProps {
	open: boolean;
	onClose: () => void;
}

const ProposalDialog: React.FunctionComponent<IProposalDialogProps> = ({ open, onClose }) => {
	const initialValues: FormValues = {
		money: new Big('0.0')
	}

	const formik = useFormik({
		initialValues: initialValues,
		onSubmit: () => alert('Proposal submitted')
	});

	return (
		<Dialog
			open={open}
			onClose={onClose}
		>
			<DialogTitle>

			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					How mush are you ready pay for?
				</DialogContentText>
				<TextField
					name='money'
					fullWidth
					value={formik.values.money}
					onChange={formik.handleChange}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default ProposalDialog;

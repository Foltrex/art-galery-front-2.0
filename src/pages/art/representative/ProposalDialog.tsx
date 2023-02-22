
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, InputAdornment, TextField } from '@mui/material';
import { Box } from '@mui/system';
import Big from 'big.js';
import { FormikHelpers, useFormik } from 'formik';
import lodash from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useGetArtistByAccountId, useGetArtistByArtId } from '../../../api/ArtistApi';
import { useGetAllCurrencies, useSaveCurrency } from '../../../api/CurrencyApi';
import { useGetFacilityByAccountId } from '../../../api/FacilityApi';
import { useSaveProposal } from '../../../api/ProposalApi';
import { Art } from '../../../entities/art';
import { Artist } from '../../../entities/artist';
import { Currency } from '../../../entities/currency';
import { Proposal } from '../../../entities/proposal';
import { TokenService } from '../../../services/TokenService';

interface FormValues {
	money: string;
	commission: number;
}

interface IProposalDialogProps {
	art: Art;
	open: boolean;
	onClose: () => void;
}

const ProposalDialog: React.FunctionComponent<IProposalDialogProps> = ({ art, open, onClose }) => {
	const navigate = useNavigate();

	const accountId = TokenService.getCurrentAccountId();
	const { data: facility } = useGetFacilityByAccountId(accountId);
	const { data: currencies } = useGetAllCurrencies();
	const { data: artist } = useGetArtistByArtId(art.id);

	const [proposalObj, setProposal] = useState({ facility } as Proposal);
	const [currentCurrency, setCurrentCurrency] = useState<Currency>();

	React.useEffect(() => {
		if (facility) {
			setProposal({ ...proposalObj, facility });
		}
		if (currencies) {
			setCurrentCurrency(currencies[0]);
		}
	}, [facility, currencies, artist])


	const initialValues: FormValues = {
		money: '0.0',
		commission: 0
	};

	const validationSchema = yup.object({
		commission: yup.number()
			.min(0, '< 0%')
			.max(100, '> 100%')
			.required(),
		money: yup.number()
			.positive()
			.required()
	})
	
	// const { data: artist } = useGetArtistByArtId(art.id);
	const mutationSaveProposal = useSaveProposal();

	const mutationSaveCurrency = useSaveCurrency();
	
	const onSaveProposal = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
		setSubmitting(true);
		try {
			// todo: change latter
			const proposal: Proposal = {
				art: art,
				price: values.money,
				commission: values.commission,
				currency: currentCurrency!,
				artist: artist!,
				organization: proposalObj.facility.organization,
				facility: proposalObj.facility,
				artistConfirmation: false,
				organizationConfirmation: true
			};
			
			await mutationSaveProposal.mutateAsync(proposal);
			navigate('/arts/representative');
		} catch (e) {
			console.log(e);
		} finally {
			setSubmitting(false);
			onClose();
		}
	}

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: onSaveProposal
	});
	
	const handleCurrencyButtonClick = (currency: Currency) => {
		formik.setFieldValue('currency', currency);
		setCurrentCurrency(currency);
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth='xs'
			fullWidth
		>
			<form onSubmit={formik.handleSubmit}>
				<DialogTitle>
					Art Proposal
				</DialogTitle>
				<Divider />
				<DialogContent>
					<Box component='div' sx={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>

						{currencies?.map(currency => (
							<Button
								variant='outlined'
								onClick={() => handleCurrencyButtonClick(currency)}
								sx={{ my: 1, mr: 1 }}
								size='small'
							>
								{currency.value}
							</Button>
						))}
					</Box>
					<TextField
						name='money'
						fullWidth
						variant='standard'
						label='Art Price'
						sx={{ my: 1 }}
						InputProps={{
							startAdornment: <InputAdornment position='start'>{currentCurrency?.label}</InputAdornment>
						}}
						value={formik.values.money}
						onChange={formik.handleChange}
						error={formik.touched.money && !!formik.errors.money}
						helperText={formik.touched.money && formik.errors.money && formik.errors.money}
					/>
					<TextField
						name='commission'
						variant='standard'
						label='Commission'
						sx={{ my: 1, width: 70 }}
						InputProps={{
							endAdornment: <InputAdornment position='end'>%</InputAdornment>
						}}
						value={formik.values.commission}
						onChange={formik.handleChange}
						error={formik.touched.commission && !!formik.errors.commission}
						helperText={formik.touched.commission && formik.errors.commission}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>
						Cancel
					</Button>
					<Button variant='contained' type='submit'>
						Propose
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default ProposalDialog;

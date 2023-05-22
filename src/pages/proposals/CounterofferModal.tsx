import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    InputAdornment,
    TextField
} from '@mui/material';
import {FormikHelpers, useFormik} from 'formik';
import {title} from 'process';
import React from 'react';
import * as yup from 'yup';
import {useGetAllCurrencies} from '../../api/CurrencyApi';
import {useSaveProposal} from '../../api/ProposalApi';
import {Currency} from '../../entities/currency';
import {Proposal} from '../../entities/proposal';
import {getErrorMessage} from "../../components/error/ResponseError";


interface FormValues {
	money: string;
	commission: number;
}

interface ICounterofferModalProps {
    open: boolean;
    onClose: () => void;
    proposal: Proposal;
}

const CounterofferModal: React.FunctionComponent<ICounterofferModalProps> = ({open, onClose, proposal}) => {
	const { data: currencies } = useGetAllCurrencies((e) => {
        getErrorMessage("Failed to load currencies", e)
    });
	const [currentCurrency, setCurrentCurrency] = React.useState<Currency>();

    React.useEffect(() => {
        if (currencies) {
			setCurrentCurrency(currencies[0]);
		}
    }, [currencies]);
    
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
	

	const mutationSaveProposal = useSaveProposal(() => {});

    console.log(proposal)
    const onSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        setSubmitting(true);
        try {
            await mutationSaveProposal.mutateAsync({
                ...proposal,
                commission: values.commission,
                price: values.money,
                currency: currentCurrency!
            })
        } catch (e) {
            console.error(e);
        }
    }

    const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: onSubmit
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
                    {title ? title : 'Art Proposal'}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Box component='div' sx={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>

                        {currencies?.map(currency => (
                            <Button
                                key={currency.id}
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

export default CounterofferModal;

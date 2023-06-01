import {Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useGetAllArtSizes} from '../../../api/ArtSizeApi';
import {Art} from '../../../entities/art';
import {useRootStore} from '../../../stores/provider/RootStoreProvider';
import React, {useState} from 'react';
import {ArtStyleDropdown} from "../../../components/form/ArtStyleDropdown";
import {useNavigate} from "react-router-dom";
import {getErrorMessage} from "../../../components/error/ResponseError";
import {EntityFile} from "../../../entities/entityFile";
import {NewProposalDialog} from "../../proposals/NewProposalDialog";
import {createNewProp} from "../../proposals/ProposalUtils";
import {HandshakeOutlined} from "@mui/icons-material";


interface IArtFormProps {
	art: Art;
	onSubmit: (art: Art) => Promise<void>;
	onDelete: () => void
	canEdit: boolean,
	files: EntityFile[],
	switchMode: (edit:boolean, art?:Art) => void
}

const ArtForm: React.FunctionComponent<IArtFormProps> = ({ art, onSubmit, onDelete, files, canEdit, switchMode}) => {
	const navigate = useNavigate();
	const rootStore = useRootStore();
	const { authStore } = rootStore;
	const account = authStore.account;
	const [submitting, setSubmitting] = useState(false);
	const [step, setStep] = React.useState<'cancel' | 'facility' | 'configuration'>('cancel');
	const [proposal, setProposal] = useState([createNewProp(account).art(art).build()]);

	//@todo replace with dropdown
	const { data: artSizeItems = []} = useGetAllArtSizes((e) => {
		getErrorMessage("Failed to load sizes property for arts object", e);
	});

	const validationSchema = yup.object({
		artSize: yup.object({id: yup.string().required("Size is required field")}),
		price: yup.number()
			    .typeError('Price must be a number')
				.integer("Price should be an integer (without coins)")
				.required("Price is required field")
				.positive("Must be bigger then 0"),
	});


	const onSaveArt = async (values: Art) => {
		if(submitting) {
			return;
		}
		setSubmitting(true);
		const artEntity: Art = {
			id: art?.id,
			name: values.name,
			description: values.description,
			price: (undefined as any) as number,
			artistAccountId: account.id,
			dateCreation: formik.values.dateCreation,
			artStyles: formik.values.artStyles,
			artSize: values.artSize,
			files: files
		};

		return onSubmit(artEntity).then(r => {
			setSubmitting(false);
			return r;
		}).catch(() => {
			setSubmitting(false);
		});

	}

	const formik = useFormik<Art>({
		initialValues: art,
		validationSchema: validationSchema,
		validateOnChange: false,
		onSubmit: onSaveArt,
	});

	return (<>
		<form onSubmit={formik.handleSubmit}>
			<Stack direction='column' rowGap={3}>
				<TextField
					size='small'
					label='Art title'
					name='name'
					value={formik.values.name}
					onChange={formik.handleChange}
					error={!!formik.errors.name}
					helperText={formik.errors.name}
					sx={{ fontSize: '2em', lineHeight: 'normal', flexGrow: 1 }} />
				<TextField
					size='small'
					label='Artist'
					name='artistName'
					disabled
					value={`${account?.firstName} ${account?.lastName}`}
					InputProps={{ readOnly: true }}
					fullWidth
					sx={{ fontSize: '2em', lineHeight: 'normal' }} />

				<TextField
					size='small'
					label='Price'
					name='price'
					value={formik.values.price}
					onChange={formik.handleChange}
					error={!!formik.errors.price}
					helperText={formik.errors.price}
					sx={{ fontSize: '2em', lineHeight: 'normal' }} />

				<FormControl size='small'>
					<ArtStyleDropdown value={formik.values.artStyles} onChange={(ids) => formik.setFieldValue('artStyles', ids)} />
				</FormControl>


				<DatePicker
					label={'Date Created'}
					sx={{ lineHeight: 'normal' }}
					disableFuture
					value={dayjs(formik.values.dateCreation)}
					onChange={(date) => {formik.setFieldValue('dateCreation', date ? date.toDate() : undefined, false)}}
					views={['month', 'year']}
					slotProps={{ textField: { size: 'small' } }}
				/>

				<FormControl size='small'>
					<InputLabel id='size-select'>Size</InputLabel>
					<Select
						label={'Size'}
						labelId='size-select'
						name='artSize'
						value={formik.values.artSize?.id}
						onChange={e => {
							const size =  artSizeItems.find(
								s => s.id === e.target.value
							);
							console.log(size);
							formik.setFieldValue('artSize', size);
						}}
						error={!!formik.errors.artSize?.id}
						sx={{ lineHeight: 'normal' }}
					>
						{artSizeItems.map(s => (
							<MenuItem
								key={s.id}
								value={s.id}
							>
								{s.label}
							</MenuItem>
						))}
					</Select>
					<FormHelperText error={!!formik.errors.artSize?.id}>{formik.errors.artSize?.id}</FormHelperText>
				</FormControl>
				<TextField
					minRows={5}
					type={"textarea"}
					multiline
					name='description'
					value={formik.values.description}
					onChange={formik.handleChange}
					size='small'
					label='Description'
					fullWidth
					error={!!formik.errors.description}
					helperText={formik.errors.description}
					sx={{ lineHeight: 'normal' }} />
				<div>
					<Stack direction={"row"} gap={'10px'}>

						<Button color={"primary"}
								variant="outlined"
								onClick={() => navigate("/gallery")}
						>
							Back
						</Button>
						<Button type={"button"} color={"error"} variant={"outlined"}
								onClick={onDelete}>Delete</Button>
						<Button type={"submit"} color={"success"}
								variant="outlined">Save</Button>
						{account.id === art?.artistAccountId && canEdit &&
							<Button type={"button"} startIcon={<HandshakeOutlined/>} variant={"outlined"} onClick={() => setStep('facility')} style={{marginLeft: "auto"}}>
								Commercial proposal
							</Button>
						}
						{account.id === art?.artistAccountId &&
							<Button type={"button"} variant={"outlined"} onClick={() => switchMode(!canEdit, canEdit ? formik.values : undefined)}>
								{canEdit ? 'View' : 'Edit'}
							</Button>
						}
					</Stack>
				</div>
			</Stack>
		</form>
	{step !== 'cancel' &&
	<NewProposalDialog proposal={proposal} step={step}
					   allowBack={step !== "facility"}
					   back={() => {
						   if (step === 'configuration') {
							   setStep('facility')
						   }
					   }}
					   next={(currentStep, proposal) => {
						   if (currentStep === 'facility') {
							   setStep('configuration')
						   } else if (currentStep === 'configuration') {
							   setStep('cancel');
							   proposal = [createNewProp(account).art(art).build()]
						   } else if(currentStep === 'cancel') {
							   setStep('cancel');
							   proposal = [createNewProp(account).art(art).build()]
						   }

						   setProposal(proposal);
					   }}/>}
	</>
	);
};

export default ArtForm;

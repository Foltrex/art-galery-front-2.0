import { Save } from '@mui/icons-material';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';
import { useGetArtSizeFilterContent } from '../../../components/form/art-size-filter/useGetArtSizeFilterContent';
import { useGetArtStyleFilterContent } from '../../../components/form/art-style-filter/useGetStyleFilterContent';
import { Art } from '../../../entities/art';
import { useRootStore } from '../../../stores/provider/RootStoreProvider';

interface IArtFormProps {
	art?: Art;
	onSubmit: (art: Art) => Promise<void>;
}

interface FormValues {
	artName: string;
	description: string;
	style: string;
	creationDate: Dayjs;
	size: string;
}

const ArtForm: React.FunctionComponent<IArtFormProps> = ({ art, onSubmit }) => {
	// const accountId = TokenService.getCurrentAccountId();
	// const { data: artist } = useGetArtistByAccountId(accountId);

	const rootStore = useRootStore();
	const { authStore } = rootStore;
	const account = authStore.account;

	const artStyleItems = useGetArtStyleFilterContent();
	const artSizeItems = useGetArtSizeFilterContent();
	/*
	let artist:Artist|undefined = undefined;
	useEffect(() => {
		if(!accountId) {
			return;
		}
		artist = useGetArtistByAccountId(accountId).data;
	}, [accountId])
	*/

	const validationSchema = yup.object({
		// name: yup.string()
		// 	.required()
	});


	const initialValues: FormValues = {
		artName: art?.name ?? '',
		description: art?.description ?? '',
		style: '',
		creationDate: dayjs(),
		size: ''
	}

	const onSaveArt = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
		setSubmitting(true);
		
		const creationDateJS = formik.values.creationDate;
		try {
			const artEntity: Art = {
				id: art?.id,
				name: values.artName,
				description: values.description,
				artistAccountId: account.id,
				dateCreation: creationDateJS.toDate()
			};

			onSubmit(artEntity);
		} catch (e) {
			console.log(e);
		} finally {
			setSubmitting(false);
		}
	}

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		validateOnChange: false,
		onSubmit: onSaveArt,
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<Stack direction='column' rowGap={3}>
				<Box sx={{ display: 'flex' }}>
					<TextField
						placeholder='Enter art name...'
						name='artName'
						required
						value={formik.values.artName}
						onChange={formik.handleChange}
						error={!!formik.errors.artName}
						helperText={formik.errors.artName}
						sx={{ fontSize: '2em', lineHeight: 'normal', flexGrow: 1 }} />

					<IconButton type='submit'>
						<Save />
					</IconButton>
				</Box>
				<TextField
					size='small'
					required
					placeholder='Artist...'
					name='artistName'
					value={`${account?.firstName} ${account?.lastName}`}
					InputProps={{ readOnly: true }}
					fullWidth
					sx={{ fontSize: '2em', lineHeight: 'normal' }} />

				<FormControl size='small'>
					<InputLabel id='style-select' shrink={false}>
						{!formik.values.style
							? 'Style...'
							: ''
						}
					</InputLabel>

					<Select
						labelId='style-select'
						required
						name='style'
						value={formik.values.style}
						onChange={formik.handleChange}
						error={!!formik.errors.style}
						// helperText={formik.errors.name}
						sx={{ lineHeight: 'normal' }}
						inputProps={{ shrink: false }}
					>
						{artStyleItems.map(s => (
							<MenuItem
								key={s.value}
								value={s.value}
							>
								{s.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>


				<DatePicker
					disableFuture
					value={formik.values.creationDate}
					onChange={formik.handleChange}
					views={['month', 'year']}
				/>

				<FormControl size='small'>
					<InputLabel id='size-select' shrink={false}>
						{!formik.values.size
							? 'Size...'
							: ''
						}
					</InputLabel>
					<Select
						labelId='size-select'
						required
						placeholder='Size...'
						name='size'
						value={formik.values.size}
						onChange={formik.handleChange}
						error={!!formik.errors.size}
						// helperText={formik.errors.name}
						sx={{ lineHeight: 'normal' }}
					>
						{artSizeItems.map(s => (
							<MenuItem
								key={s.value}
								value={s.value}
							>
								{s.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField
					name='description'
					value={formik.values.description}
					onChange={formik.handleChange}
					size='small'
					placeholder='Description...'
					fullWidth
					error={!!formik.errors.description}
					helperText={formik.errors.description}
					sx={{ lineHeight: 'normal' }} />
			</Stack>
		</form>
	);
};

export default ArtForm;

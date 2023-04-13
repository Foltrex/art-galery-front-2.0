import { Save } from '@mui/icons-material';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';
import { useGetAllArtSizes } from '../../../api/ArtSizeApi';
import { useGetAllArtStyles } from '../../../api/ArtStyleApi';
import { Art } from '../../../entities/art';
import { ArtSize } from '../../../entities/art-size';
import { ArtStyle } from '../../../entities/art-style';
import { useRootStore } from '../../../stores/provider/RootStoreProvider';
import { useState } from 'react';

interface IArtFormProps {
	art?: Art;
	onSubmit: (art: Art) => Promise<void>;
}

interface FormValues {
	artName: string;
	description: string;
	creationDate: Dayjs;
	size: ArtSize;
}

const ArtForm: React.FunctionComponent<IArtFormProps> = ({ art, onSubmit }) => {
	// const accountId = TokenService.getCurrentAccountId();
	// const { data: artist } = useGetArtistByAccountId(accountId);
	const [selectedStyles, setSelectedStyles] = useState<ArtStyle[]>(art?.artStyles ?? []);

	const rootStore = useRootStore();
	const { authStore } = rootStore;
	const account = authStore.account;

	const { data: artStyleItems = []} = useGetAllArtStyles();
	
	const { data: artSizeItems = []} = useGetAllArtSizes();
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
		creationDate: dayjs(),
		size:  artSizeItems[0] || artSizeItems[0]
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
				dateCreation: creationDateJS.toDate(),
				artStyles: selectedStyles,
				artSize: values.size
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

	const handleStyleSelect = (e: SelectChangeEvent<string | string[]>) => {
		const idsString = e.target.value;
		const ids = typeof idsString === 'string' ? idsString.split(',') : idsString;
		const styles = ids.map(id => artStyleItems.find(s => s.id === id)!);
		console.log(selectedStyles)
		setSelectedStyles(styles);
	}
	
	const selectedStylesIds = selectedStyles.map(s => s.id);
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
						{selectedStyles.length === 0
							? 'Style...'
							: ''
						}
					</InputLabel>

					<Select
						labelId='style-select'
						required
						name='style'
						multiple
						value={selectedStylesIds}
						renderValue={values => {
							const styles = values.map(value => {
								return selectedStyles.find(s => s.id === value)!;
							})

							return styles
								.map(s => s.label)
								.join(', ');
						}}
						onChange={handleStyleSelect}
						// helperText={formik.errors.name}
						sx={{ lineHeight: 'normal' }}
						inputProps={{ shrink: false }}
					>
						{artStyleItems.map(s => !selectedStyles.includes(s) && (
							<MenuItem
								key={s.id}
								value={s.id}
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
						value={formik.values.size?.id}
						onChange={e => {
							const size =  artSizeItems.find(
								s => s.id === e.target.value
							);
							formik.setFieldValue('size', size);
						}}
						error={!!formik.errors.size}
						// helperText={formik.errors.name}
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

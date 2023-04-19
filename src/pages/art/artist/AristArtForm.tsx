import {Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers';
import dayjs, {Dayjs} from 'dayjs';
import {FormikHelpers, useFormik} from 'formik';
import * as yup from 'yup';
import {useGetAllArtSizes} from '../../../api/ArtSizeApi';
import {Art} from '../../../entities/art';
import {ArtSize} from '../../../entities/art-size';
import {ArtStyle} from '../../../entities/art-style';
import {useRootStore} from '../../../stores/provider/RootStoreProvider';
import {useState} from 'react';
import {ArtStyleDropdown} from "../../../components/form/ArtStyleDropdown";

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
	const [selectedStyles, setSelectedStyles] = useState<ArtStyle[]>(art?.artStyles ?? []);

	const rootStore = useRootStore();
	const { authStore } = rootStore;
	const account = authStore.account;

	
	const { data: artSizeItems = []} = useGetAllArtSizes();

	const validationSchema = yup.object({});


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



	return (
		<form onSubmit={formik.handleSubmit}>
			<Stack direction='column' rowGap={3}>
				<TextField
					size='small'
					label='Art title'
					name='artName'
					value={formik.values.artName}
					onChange={formik.handleChange}
					error={!!formik.errors.artName}
					helperText={formik.errors.artName}
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

				<FormControl size='small'>
					<ArtStyleDropdown value={selectedStyles} onChange={(ids) => setSelectedStyles(ids)} />
				</FormControl>


				<DatePicker
					label={'Date Created'}
					sx={{ lineHeight: 'normal' }}
					disableFuture
					value={formik.values.creationDate}
					onChange={formik.handleChange}
					views={['month', 'year']}
					slotProps={{ textField: { size: 'small' } }}
				/>

				<FormControl size='small'>
					<InputLabel id='size-select'>Size</InputLabel>
					<Select
						label={'Size'}
						labelId='size-select'
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
					label='Description'
					fullWidth
					error={!!formik.errors.description}
					helperText={formik.errors.description}
					sx={{ lineHeight: 'normal' }} />
				<div>
					<Button type={"submit"} color={"success"}
							variant="outlined">Save</Button>
				</div>
			</Stack>
		</form>
	);
};

export default ArtForm;

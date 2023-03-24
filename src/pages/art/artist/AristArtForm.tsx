import { Add } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box, Divider, Grid, IconButton, InputBase, Stack, TextField } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { RefObject } from 'react';
import * as yup from 'yup';
import { useGetArtistByAccountId } from '../../../api/ArtistApi';
import { Art } from '../../../entities/art';
import { TokenService } from '../../../services/TokenService';

interface IArtFormProps {
	art?: Art;
	onSubmit: (art: Art) => Promise<void>;
	onImageAdd?: () => void;
}

interface FormValues {
	name: string;
	description: string;
}

const ArtForm: React.FunctionComponent<IArtFormProps> = ({ art, onSubmit, onImageAdd }) => {
	const accountId = TokenService.getCurrentAccountId();
	const { data: artist } = useGetArtistByAccountId(accountId);

	const validationSchema = yup.object({
		name: yup.string()
			.required()
	});


	const initialValues: FormValues = {
		name: art?.name ?? '',
		description: art?.description ?? ''
	}

	const onSaveArt = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
		setSubmitting(true);
		try {
			const artEntity: Art = {
				id: art?.id,
				name: values.name,
				description: values.description,
				artist: artist!
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
		onSubmit: onSaveArt,
		enableReinitialize: true,
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<TextField
					placeholder='Enter art name'
					name='name'
					value={formik.values.name}
					onChange={formik.handleChange}
					fullWidth
					error={!!formik.errors.name}
					helperText={formik.errors.name}
					sx={{ fontSize: '2em', lineHeight: 'normal' }} />
				
				<Stack direction='row'>
					{/* <IconButton onClick={onImageAdd}>
						<AddPhotoAlternateIcon color='primary' />
					</IconButton> */}

					<IconButton type='submit' disabled={formik.isSubmitting}>
						<SaveIcon />
					</IconButton>
				</Stack>
			</Box>
			<Divider sx={{ my: 1 }} />
			<Stack spacing={2} sx={{ marginTop: 4 }}>
				<Grid container>
					<Grid item sm={4}><strong>Description</strong></Grid>
					<Grid item sm={8}>
						<InputBase
							multiline
							fullWidth
							placeholder='Enter art description'
							sx={{
								borderRadius: 1,
								borderColor: "black",
							}}
							name='description'
							onChange={formik.handleChange}
							value={formik.values.description}
						/>
					</Grid>
				</Grid>
			</Stack>
		</form>
	);
};

export default ArtForm;

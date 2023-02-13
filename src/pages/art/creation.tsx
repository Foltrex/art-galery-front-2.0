import { Box, InputBase, IconButton, Divider, Stack, Grid } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import * as React from 'react';
import art from '.';
import { useSaveArt } from '../../api/ArtApi';
import SaveIcon from '@mui/icons-material/Save';
import { useGetArtistByAccountId } from '../../api/ArtistApi';
import { TokenService } from '../../services/TokenService';
import * as yup from 'yup';
import { Art } from '../../entities/art';
import ImageSlider from '../../components/ui/ImageSlider';
import { useNavigate } from 'react-router-dom';


interface FormValues {
	name: string;
	description: string;
}

const ArtCreation = () => {
	const navigate = useNavigate();;

	const accountId = TokenService.getCurrentAccountId();
	const { data: artist } = useGetArtistByAccountId(accountId);

	const mutationSaveArt = useSaveArt();

	const initialValues: FormValues = {
		name: '',
		description: ''
	};

	const validationSchema = yup.object({
		name: yup.string()
			.min(1)
			.required(),
		description: yup.string()
			.min(1)
			.required()
	});

	const onSaveArt = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
		setSubmitting(true);
		try {
			const art: Art = {
				name: values.name,
				description: values.description,
				artist: artist!
			};

			const response = await mutationSaveArt.mutateAsync(art);
			const { data: persistedArt } = response;
			const { id } = persistedArt;
			navigate(`/arts/${id}`);
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
		enableReinitialize: true
	});

	return (
		<Grid container
			spacing={0}
			sx={{ marginTop: "4%" }}
			justifyContent="center"
		>
			<Grid item sm={6}>
				<div style={{
					width: 'auto',
					height: '380px',
					margin: '0 15px',
				}}>
					
					<div style={{ background: '#E8EDF0', width: '100%', height: '100%' }} />
				</div>
			</Grid>
			<Grid item sm={6}>

				<form onSubmit={formik.handleSubmit}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<InputBase
							placeholder='Enter art name'
							name='name'
							value={formik.values.name}
							onChange={formik.handleChange}
							fullWidth />
						<IconButton type='submit' disabled={formik.isSubmitting}>
							<SaveIcon />
						</IconButton>
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
										borderColor: "black"
									}}
									name='description'
									onChange={formik.handleChange}
									value={formik.values.description}
								/>
							</Grid>
						</Grid>
					</Stack>
				</form>
			</Grid>
		</Grid>
	);
};

export default ArtCreation;

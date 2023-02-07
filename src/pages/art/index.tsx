import { Container, Divider, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetArtById } from "../../api/ArtApi";
import ImageSlider from "../../components/ui/ImageSlider";

import f from '../arts/images/1.jpg';
import s from '../arts/images/2.jpg';
import t from '../arts/images/3.jpg';
import fo from '../arts/images/4.jpg';
import fi from '../arts/images/5.jpg';
import si from '../arts/images/6.jpeg';
import se from '../arts/images/7.webp';

import { Art as ArtEntity } from '../../entities/art';
import { PrepareDataUtil } from "../../util/PrepareDataUtil";

// description
// artist
// name
// image
// facility where it is handing

const Art = () => {
	const { id: artId } = useParams();
	const { data: art } = useGetArtById(artId!);

	const slides = [
		f, s, t, fo, fi, si, se
	]

	return (
		<Grid container
			spacing={0}
			sx={{ marginTop: "4%" }}
			justifyContent="center"
		>
			<Grid item sm={6}>
				<div style={{
					width: '550px',
					height: '380px',
					margin: '0 auto', 
				}}>
					<ImageSlider slides={slides} />
				</div>
			</Grid>
			<Grid item sm={6}>
				<Typography variant='h4'>
					The best painting
				</Typography>
				<Divider />
				<Stack spacing={2} sx={{ marginTop: 4 }}>
					<Grid container>
						<Grid item sm={4}><strong>Email</strong></Grid>
						<Grid item sm={8}>tonasdf@gmail.com</Grid>
					</Grid>
				</Stack>
			</Grid>
			{/* {art
				? <>
					<Grid item sm={4}>
						<div style={{
							width: '500px',
							height: '280px',
							margin: '0 auto',
						}}>
							<ImageSlider slides={slides} />
						</div>
					</Grid>
					<Grid item sm={6}>
						<Typography variant='h4'>
							{art.name}
						</Typography>
						<Divider />
						<Stack spacing={2} sx={{ marginTop: 4 }}>
							<Grid container>
								<Grid item sm={4}><strong>Email</strong></Grid>
								<Grid item sm={8}>tonasdf@gmail.com</Grid>
							</Grid>
						</Stack>
					</Grid>
				</>
				: <>
					<Grid item sm={4}>
						<Skeleton width={250} height={250} />
					</Grid>
					<Grid item sm={6}>
						<Typography variant='h4'>
							<Skeleton />
						</Typography>
						<Divider />
						<Stack spacing={2} sx={{ marginTop: 4 }}>
							<Grid container>
								<Grid item sm={4}><strong>Status</strong></Grid>
								<Grid item sm={8}>
									<Skeleton />
								</Grid>
							</Grid>
							<Grid container>
								<Grid item sm={4}><strong>Email</strong></Grid>
								<Grid item sm={8}>tonasdf@gmail.com</Grid>
							</Grid>
						</Stack>
					</Grid>
				</>
			} */}
		</Grid>

	);
}

export default Art;
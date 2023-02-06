import { Container, Divider, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetArtById } from "../../api/ArtApi";

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



	return (
		<Grid container
			spacing={0}
			sx={{ marginTop: "4%" }}
			justifyContent="center"
		>
			{art
				? <>
					<Grid item sm={4}>
						<img src={art.data} alt='Painting' width='250' height='250' />
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
			}
		</Grid>

	);
}

export default Art;
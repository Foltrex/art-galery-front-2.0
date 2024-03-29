import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, Fab, useScrollTrigger, Zoom } from "@mui/material";


const ScrollTop = () => {
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 100,
	});

	const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

	return (
		<Zoom in={trigger}>
			<Box
				role="presentation"
				sx={{
					position: "fixed",
					bottom: 32,
					right: 32,
					zIndex: 1,
				}}
			>
				<Fab
					onClick={scrollToTop}
					color="primary"
					size="small"
					aria-label="scroll back to top"
				>
					<KeyboardArrowUp />
				</Fab>
			</Box>
		</Zoom>
	)
}

export default ScrollTop;
import { Card, ImageListItem, ImageListItemBar, SxProps, Theme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ImageSlider from "../../components/ui/ImageSlider";
import { Art } from "../../entities/art";

interface IArtItemProps {
    art: Art;
}

const ArtItem: React.FC<IArtItemProps> = ({ art }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <ImageListItem sx={{ height: '100% !important' }}>
                <ImageListItemBar
                    sx={{
                        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7)0%, rgba(0, 0, 0, 0.7)70%, rgba(0, 0, 0, 0)100%)'
                    }}
                    title={'Available'}
                    position='top' />
                
                <img
                    src={art.data[0]}
                    alt={art.name}
                    loading='lazy'
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/arts/${art.id}`)}
                />
                <ImageListItemBar
                    title={art.name}
                />
            </ImageListItem>
        </Card>
    );
}

export default ArtItem;
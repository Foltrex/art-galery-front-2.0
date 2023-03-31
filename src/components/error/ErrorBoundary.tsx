import { Box, Typography } from '@mui/material';
import ArtGaleryBackgroundImage from '../../assets/images/art-galery.jpeg'
import * as React from 'react';

export interface IErrorBoundaryProps extends React.PropsWithChildren {
}

export interface IErrorBoundaryState {
    hasError: boolean;
}

export default class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props: IErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error("Uncaught error: ", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2
                    }}>
                    <Typography
                        textAlign='center'
                        variant='h2'
                        sx={{
                            fontFamily: "'Lobster', cursive",
                        }}
                    >
                        You broke my app... Why did you do that?
                    </Typography>
                </Box>
            );
        }
        return this.props.children;
    }
}

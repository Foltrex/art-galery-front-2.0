import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import * as React from 'react';

export interface IErrorBoundaryProps extends React.PropsWithChildren {
}

export interface IErrorBoundaryState {
    hasError: boolean;
    errorMessage: string;
    componentStack: string;
    stackTrace?: string;
    errorName: string;
}

const bold = {fontWeight: 'bold'}
const overflow = {maxHeight: 600, overflow: "auto"};

export default class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props: IErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, componentStack: '', errorMessage: '', errorName: ''};
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error("Uncaught error: ", error, errorInfo);
        this.setState({componentStack: errorInfo.componentStack, errorMessage: error.message, stackTrace: error.stack, errorName: error.name});
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
                        Something went wrong...
                    </Typography>
                    <br/><br/>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Error Name: {this.state.errorName}</Typography>
                        </AccordionSummary>
                        <AccordionDetails style={overflow}>
                            <Typography>
                                <Typography sx={bold}>Error message: </Typography>
                                {this.state.errorMessage}
                                <Typography sx={bold}>Stack trace: </Typography>
                                {this.state.stackTrace}
                                <Typography sx={bold}>Component stack: </Typography>
                                {this.state.componentStack}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            );
        }
        return this.props.children;
    }
}

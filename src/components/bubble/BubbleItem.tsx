import React from 'react';
import {SnackbarContent} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import {amber, green} from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';

export interface BubbleProps {
    id?: number;//auto assignable
    message: any;
    duration?: number;
    variant?: 'success' | 'warning' | 'error' | 'info';
    classes?: any;
    close?: () => void;
}

const styles = {
    success: {
        marginTop: 10,
        backgroundColor: green[600],
    },
    error: {
        marginTop: 10,
        backgroundColor: '#d32f2f',
    },
    info: {
        marginTop: 10,
        backgroundColor: '#3f51b5',
    },
    warning: {
        marginTop: 10,
        backgroundColor: amber[700],
    },
}
const iconStyle = {
    fontSize: 20,
    marginRight: "8px"
};
const messageStyle = {
    display: 'flex',
    alignItems: 'center',
};

class BubbleState {
    open: boolean = true;
}

class BubbleItem extends React.Component<BubbleProps, BubbleState> {

    state = new BubbleState();

    close = () => {
        this.setState({open: false}, () => {
            if (this.props.close) {
                this.props.close();
            }
        });
    };

    render() {
        let Icon;
        const variant = this.props.variant || 'info';
        switch (variant) {
            case 'success':
                Icon = CheckCircleIcon;
                break;
            case 'warning':
                Icon = WarningIcon;
                break;
            case 'error':
                Icon = ErrorIcon;
                break;
            default:
                Icon = InfoIcon;

        }

        return <SnackbarContent
            style={styles[variant]}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" style={messageStyle}>
                        <Icon style={iconStyle}/>
                    {this.props.message}
                    </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={this.close}>
                    <CloseIcon style={iconStyle}/>
                </IconButton>,
            ]}
        />
    }
}

export default (BubbleItem);
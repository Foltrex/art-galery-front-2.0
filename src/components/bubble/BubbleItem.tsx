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
    duration?: number;//0 for infinite, 6000 default value
    variant?: 'success' | 'warning' | 'error' | 'info';//auto assignable
    close?: () => void;//callback which is called after popup is closed (manually of by timeout)
}

const styles = {
    success: {
        marginTop: 10,
        backgroundColor: green[600],
        display: "flex",
        alignItems: "baseline"
    },
    error: {
        marginTop: 10,
        backgroundColor: '#d32f2f',
        display: "flex",
        alignItems: "baseline"
    },
    info: {
        marginTop: 10,
        backgroundColor: '#3f51b5',
        display: "flex",
        alignItems: "baseline"
    },
    warning: {
        marginTop: 10,
        backgroundColor: amber[700],
        display: "flex",
        alignItems: "baseline"
    },
}
const iconStyle = {
    fontSize: 20,
    marginRight: "8px"
};
const messageStyle = {
    display: 'flex',
    alignItems: 'flex-start',
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

    componentDidMount() {
        if(!this.props.duration) {
            return;
        }
        setTimeout(() => {
            this.close();
        }, this.props.duration)
    }

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
                    <div style={{overflowWrap: "anywhere"}}>{this.props.message}</div>
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
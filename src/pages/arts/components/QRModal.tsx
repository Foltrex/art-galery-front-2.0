import {Modal} from '@mui/material';
import * as React from 'react';

interface IQRModalProps {
    open: boolean;
    onClose: () => void;
    qr?: string;
}

const QRModal: React.FunctionComponent<IQRModalProps> = ({open, onClose, qr}) => {
  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {qr
            ? <img src={qr} style={{ height: '55%', width: 'auto' }} />
            : <img />
        }
    </Modal>
  );
};

export default QRModal;

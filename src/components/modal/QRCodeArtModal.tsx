import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider} from '@mui/material';
import * as React from 'react';
import QRcode from "qrcode.react";
import { jsPDF } from 'jspdf'

interface IDeleteModalProps {
    open: boolean;
    onClose: () => void;
    value: string,
}

const DeleteModal: React.FunctionComponent<IDeleteModalProps> = ({open, onClose, value}) => {

    const download = () => {
        let pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [50, 50]
        })

        const element = document.getElementById('qr-code') as HTMLCanvasElement
        let base64Image = element.toDataURL()

        pdf.addImage(base64Image, 'png', 0, 0, 50, 50)
        pdf.save(`${value}.pdf`)
    }

    return (
        <Dialog open={open}>
            <DialogTitle>
                QR code
            </DialogTitle>
            <Divider/>
            <DialogContent>
                <div
                    style={{height: "auto", margin: "0 auto", maxWidth: 256, width: "100%"}}>
                    <QRcode
                        id={"qr-code"}
                        size={256}
                        style={{height: "auto", maxWidth: "100%", width: "100%"}}
                        value={value}
                        viewBox={`0 0 256 256`}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={download}>Download</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteModal;

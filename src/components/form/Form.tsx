import { Dialog, DialogTitle, Divider, DialogContent, Grid, TextField, FormControl, InputLabel, Select, MenuItem, DialogActions, Button } from '@mui/material';
import * as React from 'react';
import { OrganizationRoleEnum } from '../../entities/enums/organizationRoleEnum';
import facilities from '../../pages/facilities';

interface IFormProps {
    title: string;
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    children: JSX.Element[];
}


function Form({
    title,
    open,
    onClose,
    onSubmit,
    children
}: IFormProps) {

    return (
        <Dialog open={open} onClose={onClose} maxWidth='xs'>
            <DialogTitle>{title}</DialogTitle>
            <Divider />
            <DialogContent>
                <Grid container rowSpacing={2}>
                    {children.map((child, index) => (
                        <Grid key={index} item xs={12}>
                            {child}
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant='text'>Cancel</Button>
                <Button onClick={onSubmit} variant='contained'>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default Form;

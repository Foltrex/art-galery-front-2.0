import React from 'react';
import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import {observer} from "mobx-react";
import UserTable from "../../users/UserTable";

interface IOrganizationFacilitiesDialogProps {
    open: boolean;
    onClose: () => void;
    organizationId: string;
}

const OrganizationUsersDialog = observer(({open, onClose, organizationId}: IOrganizationFacilitiesDialogProps) => {

    return (
        <Dialog open={open} onClose={onClose} maxWidth={"md"} fullWidth>
            <DialogContent>
                <UserTable organizationId={organizationId}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant={"contained"}>Close</Button>
            </DialogActions>
        </Dialog>
    );
});

export default OrganizationUsersDialog;

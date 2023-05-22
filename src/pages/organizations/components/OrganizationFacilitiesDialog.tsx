import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import FacilityTable from "../../facilities/FacilityTable";
import FacilityEdit from "../../facilities/components/FacilityEdit";
import FacilityNew from "../../facilities/components/FacilityNew";

interface IOrganizationFacilitiesDialogProps {
    open: boolean;
    onClose: () => void;
    organizationId: string;
}
enum Mode {
    LIST, NEW, EDIT
}
const OrganizationFacilitiesDialog = ({open, onClose, organizationId}: IOrganizationFacilitiesDialogProps) => {
    const [mode, setMode] = useState(Mode.LIST);
    const [facilityId, setFacilityId] = useState('');

    return (
        <Dialog open={open} onClose={(e, reason) => {
            if(reason !== 'backdropClick')
                onClose();
        }} maxWidth={"lg"} fullWidth>
            <DialogContent>
                {mode === Mode.NEW && <FacilityNew back={() => setMode(Mode.LIST)}
                                                   organizationId={organizationId}
                                                   onSubmit={() => setMode(Mode.LIST)} />}
                {mode === Mode.EDIT && <FacilityEdit back={() => setMode(Mode.LIST)}
                                                     facilityId={facilityId}
                                                     onSubmit={() => setMode(Mode.LIST)} />}
                {mode === Mode.LIST && <FacilityTable organizationId={organizationId}
                                                      edit={(id) => {
                                                          setMode(Mode.EDIT);
                                                          setFacilityId(id);
                                                      }}
                                                      createNew={() => setMode(Mode.NEW)}/>}
            </DialogContent>
            {mode === Mode.LIST && <DialogActions>
                <Button onClick={onClose} variant={"contained"}>Close</Button>
            </DialogActions>}
        </Dialog>
    );
};

export default OrganizationFacilitiesDialog;

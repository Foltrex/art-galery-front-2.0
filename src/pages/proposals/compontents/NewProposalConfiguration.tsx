import {Proposal} from "../../../entities/proposal";
import {useRootStore} from "../../../stores/provider/RootStoreProvider";
import * as React from "react";
import {AccountEnum} from "../../../entities/enums/AccountEnum";
import * as yup from "yup";
import {useFormik} from "formik";
import {Alert, Box, List, ListItem, TextField} from "@mui/material";

interface NewProposalConfigurationProps {
    updateProposal: (proposal:Proposal[]) => void
    proposal: Proposal[]
}

export function NewProposalConfiguration ({proposal, updateProposal}:NewProposalConfigurationProps) {
    const { authStore } = useRootStore();
    const account = authStore.account;

    const validationShape = yup.object().shape({
        commission: yup.number()
            .min(0, "Commission can't be below zero")
            .max(100, "Commission can't be above 100%")
    });

    const formik = useFormik({
        initialValues: {
            commission: proposal[0].commission,
            comment: proposal[0].comment,
        },
        validationSchema: validationShape,
        validateOnChange: true,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            const props = [...proposal];
            props.forEach(prop => prop.commission = values.commission);
            updateProposal(props);
        },
    });

    return (
        <Box maxWidth='lg'>
            <TextField
                fullWidth={true}
                margin="normal"
                disabled
                label="Art object price"
                name={"price"}
                value={proposal[0].price}
            />
            <TextField
                fullWidth={true}
                margin="normal"
                required
                label="Commission %"
                name={"commission"}
                value={formik.values.commission}
                onChange={e => {
                    const value = e.target.value;
                    formik.setFieldValue('commission', value, true).then(() => {
                        const props = [...proposal];
                        props.forEach(f => {
                            //@ts-ignore
                            f.commission = value;
                        });
                        updateProposal(props);
                    })
                }}
                error={!!formik.errors.commission} helperText={formik.errors.commission}
            />
            {/*should be ==, not ===*/formik.values.commission == 0 && <Alert severity="info">
                <span>Facility will not benefit from sales, artist receive full payment minus bank payment commission</span>
            </Alert>}
            {formik.values.commission > 0 && <Alert severity="info"><span>Facility sales profit is {definePrice(proposal, formik.values.commission)}.
                The artist receives {proposal[0].price - definePrice(proposal, formik.values.commission)},
                minus the commission of the bank payment</span></Alert>}
            {account.accountType !== AccountEnum.ARTIST && formik.values.commission > 20 && <Alert severity="error">Seems commission too big. Our service suggest commission around 10%</Alert>}

            <TextField
                multiline={true}
                minRows={5}
                fullWidth={true}
                margin="normal"
                label="Additional notes"
                name={"comment"}
                value={formik.values.comment}
                onChange={e => {
                    formik.setFieldValue('comment', e.target.value, true).then(() => {
                        const props = [...proposal];
                        props.forEach(f => {
                            f.comment = formik.values.comment;
                        });
                        updateProposal(props);
                    })
                }}
            />
            {account.accountType === AccountEnum.ARTIST && <Alert severity={"info"}>
                <Box>You are about to send commercial proposals to the following organizations:</Box>
                <List>
                    {proposal.map(prop => <ListItem key={prop.organization.id}>
                        {prop.organization?.name}
                        &nbsp;({prop.facilities.reduce((p, f) => (p ? p + ', ' : '') + f.name, '')})
                    </ListItem>)}
                </List>
            </Alert>}
        </Box>)
}

function definePrice(prop:Proposal[], commission:number) {
    commission = commission || 0;
    const root = prop[0];
    return Math.floor(root.price * commission / 100);
}
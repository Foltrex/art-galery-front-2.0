import React, {useState} from 'react';
import {Account} from "../../../entities/account";
import {Button, TextField} from "@mui/material";
import MetadataList, {prepareAccountProperties} from "./MetadataList";
import {AccountEnum} from "../../../entities/enums/AccountEnum";
import {MetadataEnum} from "../../../entities/enums/MetadataEnum";
import {useRootStore} from "../../../stores/provider/RootStoreProvider";
import {Form, Formik} from "formik";
import * as yup from "yup";
import Bubble from "../../../components/bubble/Bubble";
import {UserTypeDropdown} from "../../../components/form/UserTypeDropdown";
import ChangePasswordDialog from "./ChangePasswordDialog";
import DeleteModal from "../../../components/modal/DeleteModal";
import {useDeleteAccountById} from "../../../api/AccountApi";
import {useNavigate} from "react-router-dom";
import {AuthService} from "../../../services/AuthService";

import {Metadata} from "../../../entities/metadata";
import {getErrorMessage} from "../../../components/error/ResponseError";

function fixMetadata(account:Account) {

    const existing = account.metadata.reduce((prev, current) => {
        prev[current.key] = current;
        return prev;
    }, {} as Record<string, Metadata>);

    const newMetadata:Metadata[] = [];
    const keys = prepareAccountProperties(account);
    for(let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const meta = existing[key] ? existing[key] : {key: key, value: ''};
        newMetadata.push(meta);
    }
    account.metadata = newMetadata;
}

const ProfileInfo = (props: {canEdit:boolean, organizationId?:string, account: Account, uploadedImage?:Metadata|null, onSubmit: (a: Account) => Promise<boolean>, back?: () => void }) => {
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);
    const navigate = useNavigate();
    const {authStore} = useRootStore();


    const validationSchema = yup.object().shape({
        email: yup.string().nullable().required("Email is required field"),
        accountType: yup.string().nullable().required("Account type is required field"),
        firstName: yup.string().nullable().required("First name is required field"),
        metadata: yup.array().of(
            yup.object().shape({
                key: yup.string().required(),
                value: yup.string().nullable().when('key', (key, field) => {
                    if (key === MetadataEnum.ORGANIZATION_ID) {
                        return field.required("Organization is required field")
                    }
                    if (key === MetadataEnum.FACILITY_ID) {
                        return field.required("Facility is required field");
                    }
                    return field;
                })
            })
        )
    })

    const mutationDelete = useDeleteAccountById((error) => getErrorMessage("Failed to delete account", error));
    const onDelete = async () => {
        return mutationDelete.mutateAsync(props.account!.id).then(() => {
            if (props.account.id === authStore.account.id) {
                AuthService.logout(authStore, navigate)
            } else {
                if (props.back) {
                    props.back();
                } else {
                    navigate("/")
                }
            }
        })
    }

    const canEditEmail = !props.account.id || authStore.account.accountType === AccountEnum.SYSTEM;

    return (
        <Formik
            validateOnChange={false}
            validateOnBlur={true}
            initialValues={props.account}
            validationSchema={validationSchema}
            onSubmit={async (values, {setSubmitting}) => {
                setSubmitting(true)
                fixMetadata(values);
                values.metadata = [...values.metadata.filter(m => m.key !== MetadataEnum.ACCOUNT_IMAGE)];
                if(props.uploadedImage) {
                    values.metadata.push(props.uploadedImage);
                }
                props.onSubmit(values).then((result) => {
                    if (result) {
                        Bubble.success(props.account.id ? "Account was updated" : "Account was created. Please check provided email address.");
                    }
                    setSubmitting(false)
                })
            }}
        >
            {formik => {console.log(formik);return (
                <Form noValidate>
                    <table className={"view-table account-table"}>
                        <tbody>
                        <tr>
                            <td className={"label"}>Email</td>
                            <td>{canEditEmail
                                ? <TextField fullWidth margin="dense" size={"small"} required
                                             name={"email"}
                                    //  label={"Email"}
                                             value={formik.values.email}
                                             onChange={formik.handleChange}
                                             error={!!formik.errors.email} helperText={formik.errors.email}
                                />
                                : props.account?.email}</td>
                        </tr>
                        {authStore.account.accountType === AccountEnum.SYSTEM && !props.organizationId && <tr>
                            <td className={"label"}>User type</td>
                            <td><UserTypeDropdown value={formik.values.accountType}
                                                  onChange={e => formik.setFieldValue("accountType", e, false)}/></td>
                        </tr>}
                        <tr>
                            <td className={"label"}>Name</td>
                            <td>{!props.canEdit && <span>{props.account?.firstName}&nbsp;{props.account?.lastName}</span>}
                                {props.canEdit && <div>
                                    <TextField fullWidth margin="dense" size={"small"} required
                                               name={"firstName"}
                                               label={"Firstname"}
                                               value={formik.values.firstName}
                                               onChange={formik.handleChange}
                                               error={!!formik.errors.firstName} helperText={formik.errors.firstName}
                                    />
                                </div>}</td>
                        </tr>
                        {props.canEdit && <tr>
                            <td/>
                            <td>
                                <TextField fullWidth margin="dense" size={"small"} required
                                           name={"lastName"}
                                           label={"Lastname"}
                                           value={formik.values.lastName}
                                           onChange={formik.handleChange}
                                />
                            </td>
                        </tr>}
                        <MetadataList formik={formik}
                                      organizationId={props.organizationId}
                                      canEdit={props.canEdit}
                                      onChange={(key, value) => {
                                          const metadata = [...formik.values.metadata];
                                          let updated = false;
                                          for (let i = 0; i < metadata.length; i++) {
                                              if (metadata[i].key === key) {
                                                  metadata[i] = {...metadata[i], value: value || ''}
                                                  updated = true;
                                                  break;
                                              }
                                          }
                                          if (!updated) {
                                              metadata.push({key: key, value: value || ''})
                                          }
                                          const values = {...formik.values, metadata: metadata}
                                          fixMetadata(values);
                                          formik.setValues(values, true);
                                      }}/>
                        {showResetPassword &&
                            <ChangePasswordDialog open={true} onClose={() => setShowResetPassword(false)}/>}
                        {showDeleteAccount && <DeleteModal open={true}
                                                           contextText={(authStore.account.id === props.account.id
                                                                   ? "You are about to delete your own account."
                                                                   : "You are about to delete " + (props.account.firstName || "") + " " + (props.account.lastName || "") + " account.")
                                                               + " All related information would be lost, and that action can not be undone. Are you sure to proceed?"
                                                           }
                                                           onClose={() => setShowDeleteAccount(false)}
                                                           onDelete={onDelete}

                        />}

                        {props.canEdit && <tr>
                            <td colSpan={2} style={{textAlign: "center"}}>
                                <div style={{display: 'flex', alignItems: 'stretch', gap: 20}}>
                                    {props.back !== undefined && <Button type={"button"} variant={"outlined"}
                                                                         onClick={() => props.back && props.back()}>Back</Button>}
                                    <div style={{display: 'flex', marginLeft: 'auto', gap: 20}}>

                                        {props.account.id &&
                                            <Button type={"button"} color={"primary"} variant={"outlined"}
                                                    style={{marginLeft: 'auto'}} onClick={() => {
                                                setShowResetPassword(true)
                                            }}>Reset password</Button>}
                                        {props.account.id &&
                                            <Button type={"button"} color={"error"} variant={"outlined"}
                                                    onClick={() => {
                                                        setShowDeleteAccount(true)
                                                    }}>Delete account</Button>}
                                        <Button type={"submit"} color={"success"}
                                                variant="outlined">Save</Button>
                                    </div>
                                </div>
                            </td>
                        </tr>}
                        </tbody>
                    </table>
                </Form>)}}
        </Formik>
    );
};

export default ProfileInfo;

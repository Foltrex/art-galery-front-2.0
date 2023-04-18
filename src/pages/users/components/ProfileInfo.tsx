import React, {useMemo, useState} from 'react';
import {Account} from "../../../entities/account";
import {Button, TextField} from "@mui/material";
import MetadataList, {prepareAccountProperties} from "./MetadataList";
import {AccountEnum} from "../../../entities/enums/AccountEnum";
import {find, findOrganizationId} from "../../../util/MetadataUtil";
import {MetadataEnum} from "../../../entities/enums/MetadataEnum";
import {OrganizationRoleEnum} from "../../../entities/enums/organizationRoleEnum";
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
import {getErrorMessage} from "../../../util/PrepareDataUtil";


const ProfileInfo = (props: { account: Account, onSubmit: (a: Account) => Promise<boolean>, back?: () => void }) => {
    const {authStore} = useRootStore();
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);
    const navigate = useNavigate();

    const isBoss = useMemo(() => {
        if (authStore.account.accountType !== AccountEnum.REPRESENTATIVE || props.account.accountType !== AccountEnum.REPRESENTATIVE) {
            return false;
        }
        if (findOrganizationId(authStore.account) !== findOrganizationId(props.account)) {
            return false;
        }
        const bossRole = find(MetadataEnum.ORGANIZATION_ROLE, authStore.account);
        if (bossRole === OrganizationRoleEnum.CREATOR) {
            return true;
        }
        const workerRole = find(MetadataEnum.ORGANIZATION_ROLE, props.account);
        return bossRole === OrganizationRoleEnum.MODERATOR && workerRole === OrganizationRoleEnum.MEMBER;
    }, [authStore.account, props.account])

    const canEdit = authStore.account.accountType === AccountEnum.SYSTEM
        || authStore.account.id === props.account.id
        || isBoss

    const validationSchema = yup.object().shape({
        email: yup.string().nullable().required("Email is required field"),
        accountType: yup.string().nullable().required("Account type is required field"),
        firstName: yup.string().nullable().required("First name is required field"),
        metadata: yup.array().of(
            yup.object().shape({
                key: yup.string().required(),
                value: yup.string().when('key', (key, field) =>
                    key === MetadataEnum.ORGANIZATION_ID || key === MetadataEnum.FACILITY_ID
                        ? field.required()
                        : field
                )
            })
        )
    })

    const mutationDelete = useDeleteAccountById();
    const onDelete = async () => {
        try {
            await mutationDelete.mutateAsync(props.account!.id);
            if (props.account.id === authStore.account.id) {
                AuthService.logout()
                navigate("/auth/signin")
            } else {
                if (props.back) {
                    props.back();
                } else {
                    navigate("/")
                }
            }
        } catch (e) {
            // add push notification
            Bubble.error("Failed to delete account. Error message is " + getErrorMessage(e));
        }
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
                const metadataMap = prepareAccountProperties(values).reduce((prev, current) => {
                    prev[current] = 1;
                    return prev;
                }, {} as Record<string, number>);

                values = {...values};
                values.metadata = values.metadata.filter(m => metadataMap[m.key]);

                props.onSubmit(values).then((result) => {
                    if (result) {
                        Bubble.success("Account was updated");
                    }
                    setSubmitting(false)
                })
            }}
        >
            {formik => (
                <Form noValidate>
                    <table className={"profile-table"}>
                        <tbody>
                        <tr>
                            <td><strong>Email</strong></td>
                            <td>{canEditEmail
                                ? <TextField fullWidth margin="dense" size={"small"} required
                                             name={"email"}
                                    //  label={"Email"}
                                             value={formik.values.email}
                                             onChange={formik.handleChange}
                                             error={!!formik.errors.email} helperText={formik.errors.email}
                                />
                                : <div style={{paddingTop: 8, marginBottom: 5}}>{props.account?.email}</div>}</td>
                        </tr>
                        {authStore.account.accountType === AccountEnum.SYSTEM && <tr>
                            <td><strong>User type</strong></td>
                            <td><UserTypeDropdown value={formik.values.accountType}
                                                  onChange={e => formik.setFieldValue("accountType", e, false)}/></td>
                        </tr>}
                        <tr>
                            <td><strong>Name</strong></td>
                            <td>{!canEdit && <span>{props.account?.firstName}&nbsp;{props.account?.lastName}</span>}
                                {canEdit && <div>
                                    <TextField fullWidth margin="dense" size={"small"} required
                                               name={"firstName"}
                                               label={"Firstname"}
                                               value={formik.values.firstName}
                                               onChange={formik.handleChange}
                                               error={!!formik.errors.firstName} helperText={formik.errors.firstName}
                                    />
                                </div>}</td>
                        </tr>
                        {canEdit && <tr>
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
                        <MetadataList account={formik.values} metadata={formik.values.metadata} canEdit={canEdit}
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
                                          formik.setFieldValue('metadata', metadata, false);
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

                        {canEdit && <tr>
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
                </Form>)}
        </Formik>
    );
};

export default ProfileInfo;

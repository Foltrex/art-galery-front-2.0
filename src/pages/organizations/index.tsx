import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import { Avatar, Container, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Tooltip, Typography } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { useGetAllOrganizations } from '../../api/OrganizationApi';
import ProposalDialog from '../../components/ui/ProposalDialog';
import { OrganizationStatusEnum } from '../../entities/enums/organizationStatusEnum';
import ArtsDialog from './ArtsDialog';

interface IOrganizationsProps {
}

const Organizations: React.FunctionComponent<IOrganizationsProps> = (props) => {
    const { data, isSuccess } = useGetAllOrganizations({
        page: 1,
        size: 9
    });

    console.log(data)

    const [openProposalModal, setOpenProposalModal] = useState(false);

    const handleOpenProposal = () => {
        setOpenProposalModal(true);
    }

    const handleCloseProposal = () => {
        setOpenProposalModal(false);
    }

    const chooseColor = (organizationStatus: OrganizationStatusEnum) => {
        switch (organizationStatus) {
            case OrganizationStatusEnum.ACTIVE: {
                return 'success.main';
            }
            case OrganizationStatusEnum.INACTIVE: {
                return 'error.main';
            }
            default: {
                return 'primary.main';
            }
        }
    }

    return (
        <>
            <Container>
                <Paper sx={{ maxWidth: '70%', mt: 10, mx: 'auto', pt: 2, px: 3 }}>
                    <h1>Organizations</h1>
                    <List>
                        {isSuccess && data.content.map(organization => (
                            <React.Fragment key={organization.id}>
                                <ListItem
                                    secondaryAction={
                                        <Tooltip title={'Propose'}>
                                            <IconButton onClick={handleOpenProposal}>
                                                <AssignmentReturnedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            L
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={organization.name ?? 'Unknown'}
                                        secondary={
                                            <>
                                                <Typography
                                                    variant='body2'
                                                    color='text.primary'
                                                    component='span'
                                                >
                                                    {organization.address?.fullName}
                                                </Typography>
                                                <br />
                                                <Typography
                                                    color={chooseColor(organization.status)}
                                                    component='span'
                                                >
                                                    {organization.status}
                                                </Typography>

                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider variant='inset' component='li' />
                            </React.Fragment>
                        ))
                        }
                    </List>

                    <ArtsDialog
                        open={openProposalModal}
                        onClose={handleCloseProposal}
                    />
                </Paper>
            </Container>
        </>
    );
};

export default Organizations;

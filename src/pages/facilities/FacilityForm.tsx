import {SelectChangeEvent} from '@mui/material';
import * as React from 'react';
import Form from '../../components/form/Form';
import Select from '../../components/form/Select';
import Switch from '../../components/form/Switch';
import TextField from '../../components/form/TextField';
import {OrganizationStatusEnum} from '../../entities/enums/organizationStatusEnum';
import {Facility} from '../../entities/facility';
import {Organization} from '../../entities/organization';

interface IFacilityFormProps {
    open: boolean;
    onClose: () => void;
    facility?: Facility;
}

function FacilityForm({open, onClose, facility}: IFacilityFormProps) {
    const [facilityObj, setFacility] = React.useState(facility ?? {} as Facility);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, checked} = e.target;
        if (name === 'active') {
            setFacility({...facilityObj, isActive: checked});
        } else {
            setFacility({...facilityObj, [name]: value});
        }
    }

    const data: Facility[] = [
        {
            id: 'asdfo-121234',
            name: 'Lidbeer',
            isActive: true,
            address: {
                id: 'w0qweqw0we',
                latitude: 12.31,
                longitude: 41.21,
                fullName: 'Bogdanovicha',
            },
            organization: {
                id: 'uasdbif',
                name: 'Roga and Kopita',
                address: {
                    id: 'w0qweqw0we',
                    latitude: 12.31,
                    longitude: 41.21,
                    fullName: 'Bogdanovicha',
                },
                status: OrganizationStatusEnum.ACTIVE,
                facilities: []
            }
        },
        {
            id: 'q0w8h9asdf',
            name: 'Pinta',
            isActive: false,
            address: {
                id: 'w0qweqw0we',
                latitude: 12.31,
                longitude: 41.21,
                fullName: 'Bogdanovicha',
            },
            organization: {
                id: 'uasdbif',
                name: 'Roga and Kopita',
                address: {
                    id: 'w0qweqw0we',
                    latitude: 12.31,
                    longitude: 41.21,
                    fullName: 'Bogdanovicha',
                },
                status: OrganizationStatusEnum.ACTIVE,
                facilities: []
            }
        }
    ];

    const handleSelectChange = (event: SelectChangeEvent<string>, selected: Organization) => {
        alert(`Changed to: ${JSON.stringify(selected)}`);
    }

    const formTitle = facility
        ? 'Edit Facility'
        : 'Create Facility';

    return (
        <Form
            title={formTitle}
            open={open}
            onClose={onClose}
            onSubmit={() => alert('Submit facility')}>

            <TextField
                name='name'
                onChange={handleChange}
                defaultValue={facility?.name}/>
            <Switch
                name='active'
                onChange={handleChange}
                defaultChecked={facility?.isActive}/>
            <TextField
                name='address'
                onChange={handleChange}
                defaultValue={facility?.address.fullName}/>
            <Select
                name='organization'
                selected={facility?.organization}
                options={[]}
                onChange={handleSelectChange}
                mapToSelectMenuItemElement={item => item.name!}
                fullWidth/>
        </Form>
    );
};

export default FacilityForm;

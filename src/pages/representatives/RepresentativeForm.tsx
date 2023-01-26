import { SelectChangeEvent } from "@mui/material";
import React, { useEffect } from "react";
import Form from "../../components/form/Form";
import Select from "../../components/form/Select";
import TextField from "../../components/form/TextField";
import { OrganizationRoleEnum } from "../../entities/enums/organizationRoleEnum";
import { Facility } from "../../entities/facility";
import { Organization } from "../../entities/organization";
import { OrganizationRole } from "../../entities/organizationRole";
import { Representative } from "../../entities/representative";

interface IRepresentativeFormProps {
	open: boolean;
	onClose: () => void;
	representative?: Representative;
}

function RepresentativeForm({ open, onClose, representative }: IRepresentativeFormProps) {
	const [representativeObj, setRepresentative] = React.useState(
        representative ?? {} as Representative
    );


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRepresentative({...representativeObj, [name]: value});
    }

    const handleSelectChange = (event: SelectChangeEvent<string>, selected: Facility | OrganizationRole) => {
		alert(`Changed to: ${JSON.stringify(selected)}`);
	}

    const formTitle = representative
        ? 'Edit Representative'
        : 'Create Representative';

	return (
		<Form
			title={formTitle}
			open={open}
			onClose={onClose}
			onSubmit={() => alert('Submit representative')}>

			<TextField
				name='firstname' 
				onChange={handleChange} 
				defaultValue={representative?.firstname} 
            />
            <TextField 
                name='lastname' 
                onChange={handleChange} 
                defaultValue={representative?.lastname} 
            />
            {representative
                ? <TextField 
                    name='organization' 
                    onChange={handleChange} 
                    defaultValue={representative?.organization?.name} />
                : <></>
            }
            <Select 
                name='facility' 
                fullWidth
                options={[]} 
                onChange={handleSelectChange} 
                mapToSelectMenuItemElement={item => item.name} 
                selected={representative?.facility}/>
            <Select 
                name='organization-role' 
                label='organizaiton role'
                fullWidth
                options={[]} 
                onChange={handleSelectChange} 
                mapToSelectMenuItemElement={item => item.name}
                selected={representative?.organizationRole} />
		</Form>
	);
};

export default RepresentativeForm;

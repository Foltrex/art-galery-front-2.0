import React, { useEffect } from "react";
import Form from "../../components/form/Form";
import TextField from "../../components/form/TextField";
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
        setRepresentative({...representativeObj!, [name]: value});
    }

    const formTitle = representative
        ? 'Edit Representative'
        : 'Create Representative';

	return (
		<Form
			title={formTitle}
			open={open}
			onClose={onClose}
			onSubmit={() => alert('Submit facility')}>

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
                {/* Select for facility */}
                {/* Select for organization role */}
		</Form>
	);
};

export default RepresentativeForm;

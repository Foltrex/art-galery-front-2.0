import React from "react";
import Form from "../../components/form/Form";
import TextField from "../../components/form/TextField";
import { Representative } from "../../entities/representative";

interface IRepresentativeFormProps {
	open: boolean;
	onClose: () => void;
	representative?: Representative;
}

function RepresentativeForm({ open, onClose, representative }: IRepresentativeFormProps) {
	const [representativeObj, setRepresentative] = React.useState(representative || {} as Representative);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRepresentative({...representativeObj, [name]: value});
    }

	return (
		<Form
			title={representativeObj ? 'Edit' : 'Create' + ' Representative'}
			open={false}
			onClose={onClose}
			onSubmit={() => alert('Submit facility')}>

			<TextField
				name='firstname' 
				onChange={handleChange} 
				defaultValue={representativeObj?.firstname} />
            <TextField 
                name='lastname' 
                onChange={handleChange} 
                defaultValue={representativeObj?.lastname} />
            {Object.keys(representativeObj).length !== 0
                ? <TextField 
                    name='organization' 
                    onChange={handleChange} 
                    defaultValue={representativeObj.organization?.name} />
                : <></>
            }
                {/* Select for facility */}
                {/* Select for organization role */}
		</Form>
	);
};

export default RepresentativeForm;

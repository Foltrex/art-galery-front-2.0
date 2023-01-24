import * as React from 'react';
import Form from '../../components/form/Form';
import TextField from '../../components/form/TextField';
import { Facility } from '../../entities/facility';

interface IFacilityFormProps {
	open: boolean;
	onClose: () => void;
	facility?: Facility;
}

function FacilityForm({ open, onClose, facility }: IFacilityFormProps) {
	const [facilityObj, setFacility] = React.useState(facility || {} as Facility);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, checked } = e.target;
		if (name === 'activity') {
			setFacility({...facilityObj, isActive: checked});
		} else {
			setFacility({...facilityObj, [name]: value});
		}
	}

	return (
		<Form
			title={facility ? 'Edit' : 'Create' + ' Facility'}
			open={false}
			onClose={onClose}
			onSubmit={() => alert('Submit facility')}>

			<TextField
				name='name' 
				onChange={handleChange} 
				defaultValue={facilityObj?.name} />
			<div></div>
			{/* active/inactive: switch */}
			{/* city and address: select */}
		</Form>
	);
};

export default FacilityForm;

import * as React from 'react';
import {ChangeEvent, useState} from 'react';
import {useDeleteFacility, useGetAllFacilities} from '../../api/FacilityApi';
import DeleteModal from '../../components/modal/DeleteModal';
import SkeletonTable from '../../components/table/SkeletonTable';
import Table, {IColumnType} from '../../components/table/Table';
import {Facility} from '../../entities/facility';
import {createEmptyPage} from '../../hooks/react-query';
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';
import {
	Avatar,
	Box,
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	IconButton,
	Radio,
	RadioGroup,
	Typography
} from '@mui/material';
import {TokenService} from '../../services/TokenService';
import {AccountEnum} from '../../entities/enums/AccountEnum';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CityDropdown from "../../components/cities/CityDropdown";
import {TypeFilter} from "../../components/form/TypeFilter";
import {Link, useNavigate} from "react-router-dom";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {Account} from "../../entities/account";
import {OrganizationsDropdown} from "../../components/form/OrganizationsDropdown";
import {isCreatorOrAdmin} from "../../util/MetadataUtil";
import {getErrorMessage} from "../../components/error/ResponseError";
import {buildImageUrl} from "../../util/PrepareDataUtil";


interface IFacilityTableProps {
	createNew?:() => void
	edit:(id:string) => void
	organizationId?:string|null
}

function getColumns(handleFacilityCheckboxClick: (s: string) => void, handleDelete: (f: Facility) => void, navigate: (s: string) => void, account: Account, canEdit:boolean, edit:(s:string) => void): IColumnType<Facility>[] {


	const result:IColumnType<Facility>[] = [];
	if(TokenService.getCurrentAccountType() === AccountEnum.ARTIST) {
		result.push({
			key: 'selected',
			title: '',
			minWidth: 10,
			render: (facility) => <Checkbox onClick={() => handleFacilityCheckboxClick(facility.id)} />
		})
	}
	result.push({
		key: 'image',
		title: 'Image',
		minWidth: 150,
		render: (f) => {
			if(!f.images) {
				return null;
			}
			let candidate = f.images.length ? f.images[0] : null;
			for(let i = 0; i < f.images.length; i++) {
				if(f.images[i].isPrimary) {
					candidate = f.images[i]
					break;
				}
			}
			return <Avatar src={candidate ? buildImageUrl(candidate.id!) : undefined} alt={"img"}>
				<MapsHomeWorkOutlinedIcon />
			</Avatar>;
		}
	});
	result.push({
		key: 'name',
		title: 'Name',
		minWidth: 150
	});
	if(account && (account.accountType === AccountEnum.SYSTEM || account.accountType === AccountEnum.ARTIST)) {
		result.push({
			key: 'organization',
			title: 'Organization',
			minWidth: 150,
			render: (facility) => facility?.organizationName
		})
	}
	result.push(
		{
			key: 'city',
			title: 'City',
			render: (facility) => facility?.address?.city?.name
		},
		{
			key: 'address',
			title: 'Address',
			minWidth: 150,
			render: (facility) => facility?.address?.name
		},
		{
			key: 'status',
			title: 'Status',
			minWidth: 150,
			render: (facility) => facility.isActive
				?  <Typography sx={{color: 'success.main'}}>Active</Typography>
				: <Typography sx={{color: 'error.main'}}>Inactive</Typography>,
		},
		{
			key: 'actions',
			title: '',
			render: (facility) => {
				return (
					<>
						{canEdit && <IconButton
							disableRipple
							aria-label='edit'
							onClick={() => edit(facility.id)}
						>
							<ModeOutlinedIcon />
						</IconButton>}
						{canEdit && <IconButton
							disableRipple
							aria-label='delete'
							onClick={() => handleDelete(facility)}
						>
							<DeleteOutlinedIcon />
						</IconButton>}
					</>
				);
			}
		}
	);
	return result;
}

const FacilityTable: React.FC<IFacilityTableProps> = (props) => {
	const [oId, setOrganizationId] = useState<string>();
	const organizationId = props.organizationId || oId;

	const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
	const [facility, setFacility] = React.useState<Facility>();
	const [selectedFacilitiesId, setSelectedFacilitiesId] = React.useState<string[]>([]);
	const [rowsPerPage, setRowsPerPage] = React.useState(25);
	const [pageNumber, setPageNumber] = React.useState(0);
	const [facilityName, setFacilityName] = useState<string>();
	const [cityId, setCityId] = useState<string>();
	const navigate = useNavigate();
	const {authStore} = useRootStore();
	const account = authStore.account;

	const statuses: {label: string, value?: boolean}[] = [
		{label: 'all'},
		{label: 'active', value: true},
		{label: 'inactive', value: false},
	];
	const [facilityStatus, setFacilityStatus] = useState(statuses[0]);

	const facilities = useGetAllFacilities(
		{
			page: pageNumber,
			size: rowsPerPage,
			sort: 'name,asc',
			cityId: cityId,
			facilityName: facilityName,
			isActive: facilityStatus.value,
			organizationId: organizationId,
		}, (error) => {
			getErrorMessage("Failed to load list of facilities", error);
		}
	);
	const {data, isFetching, isSuccess } = facilities;
	const mutationDelete = useDeleteFacility((error) => {
		getErrorMessage("Failed to delete facility", error);
	});

	if(!account) {
		return null;
	}

	const handleFacilityCheckboxClick = (selectedFacilityId: string) => {
		const indexOfFacilityId = selectedFacilitiesId.indexOf(selectedFacilityId);
		if (indexOfFacilityId === -1) {
			setSelectedFacilitiesId([...selectedFacilitiesId, selectedFacilityId]);
		} else {
			const filteredArray = selectedFacilitiesId.filter(facilityId => facilityId !== selectedFacilityId);
			setSelectedFacilitiesId(filteredArray);
		}
	}

	const handleDelete = async (data: Facility) => {
		setFacility(data);
		setOpenDeleteModal(true);
	}


	const canEdit = account.accountType === AccountEnum.SYSTEM || isCreatorOrAdmin(account);
	const columns = getColumns(handleFacilityCheckboxClick, handleDelete, navigate, account, canEdit, props.edit);


	const onDelete = async () => {
		return mutationDelete.mutateAsync(facility!.id);
	}


	const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
		const currentStatus = statuses.find(s => s.label === e.target.value);
		setFacilityStatus(currentStatus!);
	}


	return (
		<>
			<Box sx={{ display: 'flex', gap: '20px' }}>
				<CityDropdown value={cityId} onChange={setCityId} label='City' />
				<TypeFilter placeholder={"Facility name"} onChange={(text) => setFacilityName(text)} />
				{!props.organizationId && <OrganizationsDropdown onChange={setOrganizationId} label='Organizations' />}

				<FormControl>
					<RadioGroup
						name='status'
						value={facilityStatus.label}
						onChange={handleStatusChange}
						row
					>
						{statuses.map(status => (
							<FormControlLabel
								key={status.label}
								value={status.label}
								control={<Radio />}
								label={status.label}
							/>
						))}
					</RadioGroup>
				</FormControl>
				{canEdit && <FormControl style={{marginLeft: "auto"}}>
					{props.createNew && <Button variant="text" size={"large"} onClick={props.createNew}>New Facility</Button>}
					{!props.createNew && <Link to={"/facilities/new"}>
						<Button variant="text" size={"large"}>New Facility</Button>
					</Link>}
				</FormControl>}
			</Box>

			{isFetching
				? <SkeletonTable columns={columns}/>
				: <Table
					columns={columns}
					page={isSuccess && data ? data : createEmptyPage<Facility>()}
					onPageChange={setPageNumber}
					onRowsPerPageChange={setRowsPerPage}/>
			}

			<DeleteModal
				open={openDeleteModal}
				onClose={() => setOpenDeleteModal(false)}
				onDelete={onDelete} />
		</>
	);
};

export default FacilityTable;

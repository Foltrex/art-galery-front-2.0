import { DeleteOutline } from '@mui/icons-material';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import { Button, Icon, IconButton, TableBody as MuiTableBody } from '@mui/material';
import lodash from 'lodash';
import * as React from 'react';
import { IColumnType, IdentifiableRecord } from './Table';
import TableRow from './TableRow';

interface ITableBodyProps<T extends IdentifiableRecord, S extends IdentifiableRecord> {
    columns: IColumnType<T>[];
    data: S[];
    onDelete: (id: S) => void;
    onEdit: (data: S) => void;
    mapModelToTableRow: (model: S) => T;
}

function TableBody<T extends IdentifiableRecord, S extends IdentifiableRecord>({ 
	data,
	columns,
	onEdit,
	onDelete,
	mapModelToTableRow
}: ITableBodyProps<T, S>): JSX.Element {
	return (
		<MuiTableBody>
			{data.map((item, itemIndex) => (
				<TableRow 
					key={`table-row-${itemIndex}`} 
					number={itemIndex} 
					columns={columns} 
					item={item} 
					onDelete={onDelete} 
					onEdit={onEdit} 
					mapModelToTableRow={mapModelToTableRow} />
			))}
		</MuiTableBody>
	);
};

export default TableBody;

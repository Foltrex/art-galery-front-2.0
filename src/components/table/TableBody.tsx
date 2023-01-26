import { DeleteOutline } from '@mui/icons-material';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import { Button, Icon, IconButton, TableBody as MuiTableBody, TableCell, TableRow } from '@mui/material';
import lodash from 'lodash';
import * as React from 'react';
import { IColumnType, IdentifiableRecord } from './Table';

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
	// TODO: Add pagination
	return (
		<MuiTableBody>
			{data.map((item, itemIndex) => (
				<TableRow key={`table-body-${itemIndex}`} hover>
					<TableCell align='center'>
						{itemIndex + 1}
						{/* {index + 1 + pageSize * pageNumber} */}
					</TableCell>

					{columns.map((column, columnIndex) => (
						<TableCell key={`table-row-cell-${columnIndex}`} align='center'>
							{column.render
								? column.render(column, mapModelToTableRow(item))
								: lodash.get(mapModelToTableRow(item), column.key)
							}
						</TableCell>
					))}

					<TableCell key='action' align='center'>
						<div>
							<IconButton
								disableRipple
								aria-label='edit'
								onClick={() => onEdit(item)}
							>
								<ModeOutlinedIcon />
							</IconButton>
							<IconButton
								disableRipple 
								aria-label='delete'
								onClick={() => onDelete(item)}
							>
								<DeleteOutline />
							</IconButton>
							{' '}
						</div>
					</TableCell>
				</TableRow>
			))}
		</MuiTableBody>
	);
};

export default TableBody;

import { DeleteOutline } from '@mui/icons-material';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import { Button, Icon, IconButton, TableBody as MuiTableBody, TableCell, TableRow } from '@mui/material';
import lodash from 'lodash';
import * as React from 'react';
import { IColumnType } from './Table';

interface ITableBodyProps<T> {
	data: T[];
	columns: IColumnType<T>[];
    onDelete: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, data?: T) => void;
    onEdit: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, data?: T) => void;
}

function TableBody<T>({ 
	data, 
	columns,
	onEdit, 
	onDelete
}: ITableBodyProps<T>): JSX.Element {
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
								? column.render(column, item)
								: lodash.get(item, column.key)
							}
						</TableCell>
					))}

					<TableCell key='action' align='center'>
						<div>
							<IconButton
								disableRipple
								aria-label='edit'
								style={{ minWidth: '100px' }}
								onClick={(event) => onEdit(event, item)}
							>
								<ModeOutlinedIcon />
							</IconButton>
							<IconButton
								disableRipple 
								aria-label='delete'
								style={{ minWidth: '100px' }}
								onClick={(event) => onDelete(event, item)}
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

import * as React from 'react';
import { IconButton, TableCell, TableRow as MuiTableRow } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import lodash from 'lodash';
import { IdentifiableRecord, IColumnType } from './Table';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import { number } from 'yup';

interface ITableRowProps<T extends IdentifiableRecord, S extends IdentifiableRecord> {
    number: number;
    columns: IColumnType<T>[];
    item: S;
    onDelete: (id: S) => void;
    onEdit: (data: S) => void;
    mapModelToTableRow: (model: S) => T;
}

const TableRow = <T extends IdentifiableRecord, S extends IdentifiableRecord>({ 
	item,
    number,
	columns,
	onEdit, 
	onDelete,
	mapModelToTableRow
}: ITableRowProps<T, S>) => {
    return (
        <MuiTableRow hover>
            <TableCell align='center'>
                {number}
            </TableCell>

            {columns.map((column, columnIndex) => (
                <TableCell key={`table-cell-${columnIndex}`} align='center' sx={{
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '150px'
                }}>
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
        </MuiTableRow>
    );
};

export default TableRow;

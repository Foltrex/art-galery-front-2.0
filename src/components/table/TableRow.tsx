import * as React from 'react';
import {IconButton, TableCell, TableRow as MuiTableRow} from '@mui/material';
import {DeleteOutline} from '@mui/icons-material';
import {IColumnType, IdentifiableRecord} from './Table';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';

interface ITableRowProps<S extends IdentifiableRecord> {
    number: number;
    columns: IColumnType<S>[];
    item: S;
    onDelete: (id: S) => void;
    onEdit: (data: S) => void;
}

const TableRow = <S extends IdentifiableRecord>({
	item,
    number,
	columns,
	onEdit, 
	onDelete
}: ITableRowProps<S>) => {
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
                        ? column.render(item)
                        : (item as any)[column.key]
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

import * as React from 'react';
import {TableCell, TableRow as MuiTableRow} from '@mui/material';
import {IColumnType, IdentifiableRecord} from './Table';

interface ITableRowProps<S extends IdentifiableRecord> {
    number: number;
    columns: IColumnType<S>[];
    item: S;
    editable: boolean;
}

const TableRow = <S extends IdentifiableRecord>({
	item,
    editable,
    number,
	columns,
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

        </MuiTableRow>
    );
};

export default TableRow;

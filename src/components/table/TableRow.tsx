import * as React from 'react';
import {TableCell, TableRow as MuiTableRow} from '@mui/material';
import {IColumnType, IdentifiableRecord} from './Table';

interface ITableRowProps<S extends IdentifiableRecord> {
    number: number|null;
    columns: IColumnType<S>[];
    item: S;
    clazz?:string
    color?: string
}

const TableRow = <S extends IdentifiableRecord>({
	item,
    number,
	columns,
	color,
    clazz,
}: ITableRowProps<S>) => {
    return (
        <MuiTableRow hover className={clazz} style={{backgroundColor: color}}>
            <TableCell align='center'>
                {number}
            </TableCell>

            {columns.map((column, columnIndex) => {
                return (
                <TableCell key={columnIndex}
                           color={color}
                           align={column.textAlign ? column.textAlign : 'center'}
                           colSpan={column.colspan}
                           sx={{
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
            )})}

        </MuiTableRow>
    );
};

export default TableRow;

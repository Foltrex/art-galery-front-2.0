import {Skeleton, Table, TableBody, TableCell, TableContainer, TableRow} from '@mui/material';
import * as React from 'react';
import {IColumnType, IdentifiableRecord} from './Table';
import TableHeader from './TableHeader';

interface ISkeletonTableBodyProps<T extends IdentifiableRecord> {
    columns: IColumnType<T>[];
    rowsPerPage: number;
}

const SkeletonTableBody = <T extends IdentifiableRecord>({
    columns,
    rowsPerPage
}: ISkeletonTableBodyProps<T>) => {
    const data = [];
    for(let number = 0; number < rowsPerPage; number++) {
        data.push(<TableRow key={`table-row-${number}`}>
            <TableCell>
                <Skeleton variant='rounded' />
            </TableCell>
            {columns.map((column, columnIndex) => (
                <TableCell key={`table-cell-${columnIndex}`}>
                    <Skeleton variant='rounded' />
                </TableCell>
            ))}
            <TableCell>
                <Skeleton variant='rounded' />
            </TableCell>
        </TableRow>);
    }
    return (
        <TableContainer>
            <Table stickyHeader aria-label="sticky table">
                <TableHeader columns={columns} />
                <TableBody>
                    {data}
                </TableBody>
            </Table>
        </TableContainer>

    );
};

export default SkeletonTableBody;

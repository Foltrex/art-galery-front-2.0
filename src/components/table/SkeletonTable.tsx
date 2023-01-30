import { Skeleton, TableBody, TableCell, TableRow, Table, TableContainer } from '@mui/material';
import lodash from 'lodash';
import * as React from 'react';
import { IColumnType, IdentifiableRecord } from './Table';
import TableHeader from './TableHeader';

interface ISkeletonTableBodyProps<T extends IdentifiableRecord> {
    columns: IColumnType<T>[];
}

const SkeletonTableBody = <T extends IdentifiableRecord>({
    columns
}: ISkeletonTableBodyProps<T>) => {
    
    const skeletonRowsAmount = 5;

    return (
        <TableContainer>
            <Table stickyHeader aria-label="sticky table">
                <TableHeader columns={columns} />
                <TableBody>
                    {lodash.range(skeletonRowsAmount).map(number => (
                        <TableRow key={`table-row-${number}`}>
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    );
};

export default SkeletonTableBody;

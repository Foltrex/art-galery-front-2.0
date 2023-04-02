import {Table as MuiTable, TableContainer, TablePagination} from '@mui/material';
import React from 'react';
import {IPage} from '../../hooks/react-query';
import TableBody from './TableBody';
import TableHeader from './TableHeader';

export interface IdentifiableRecord {
    id: string;
}

export interface IColumnType<T extends IdentifiableRecord> {
    key: string;
    title: string;
    minWidth?: number;
    render?: (item: T) => void;
}

interface ITableProps<S extends IdentifiableRecord> {
    columns: IColumnType<S>[];
    page: IPage<S>;
    onDelete: (id: S) => void;
    onEdit: (data: S) => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
    onRowsPerPageChange:  (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function Table<S extends IdentifiableRecord>({
    columns, 
    page, 
    onEdit,
    onDelete,
    onPageChange,
    onRowsPerPageChange
}: ITableProps<S>): JSX.Element {

    return (
        <>
            <TableContainer>
                <MuiTable stickyHeader aria-label="sticky table">
                    <TableHeader columns={columns} />
                    <TableBody 
                        page={page}
                        columns={columns}
                        onEdit={onEdit}
                        onDelete={onDelete}/>
                </MuiTable>
            </TableContainer>
            <TablePagination 
                rowsPerPageOptions={[5, 10, 15, 25, 50]}
                component='div'
                count={page.totalElements}
                rowsPerPage={page.size}
                page={page.number}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </>
    );
}

export default Table;

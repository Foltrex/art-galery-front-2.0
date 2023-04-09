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
    sort?: (columnName:string, direction:'asc'|'desc'|undefined) => void
}

interface ITableProps<S extends IdentifiableRecord> {
    columns: IColumnType<S>[];
    page: IPage<S>;
    editable?: boolean;
    onDelete: (id: S) => void;
    onEdit: (data: S) => void;
    onPageChange: (page: number) => void;
    onRowsPerPageChange:  (pageSize: number) => void;
}

function Table<S extends IdentifiableRecord>({
    columns, 
    page, 
    editable = false,
    onEdit,
    onDelete,
    onPageChange,
    onRowsPerPageChange
}: ITableProps<S>): JSX.Element {

    return (
        <>
            <TableContainer>
                <MuiTable stickyHeader aria-label="sticky table">
                    <TableHeader columns={columns} showActions={editable} />
                    <TableBody 
                        page={page}
                        editable={editable}
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
                onPageChange={(e, page) => onPageChange(page)}
                onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
            />
        </>
    );
}

export default Table;

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
    colspan?: number;
    render?: (item: T) => void;
    groupBy?: (item: T) => string|undefined
    sort?: (columnName:string, direction:'asc'|'desc'|undefined) => void
}

interface ITableProps<S extends IdentifiableRecord> {
    columns: IColumnType<S>[];
    page: IPage<S>;
    editable?: boolean;
    onPageChange: (page: number) => void;
    onRowsPerPageChange:  (pageSize: number) => void;
    groupBy?:string[]
}

function Table<S extends IdentifiableRecord>({
    columns, 
    page, 
    editable = false,
    onPageChange,
    onRowsPerPageChange,
    groupBy
}: ITableProps<S>): JSX.Element {

    return (
        <>
            <TableContainer>
                <MuiTable stickyHeader aria-label="sticky table">
                    <TableHeader columns={columns} showActions={editable} />
                    <TableBody
                        groupBy={groupBy}
                        page={page}
                        editable={editable}
                        columns={columns}/>
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

import { Table as MuiTable, TableContainer, TablePagination } from '@mui/material';
import React from 'react';
import { IPage } from '../../hooks/react-query';
import TableBody from './TableBody';
import TableHeader from './TableHeader';

export interface IdentifiableRecord {
    id: string;
};

export interface IColumnType<T extends IdentifiableRecord> {
    key: string;
    title: string;
    minWidth?: number;
    render?: (column: IColumnType<T>, item: T) => void;
}

interface ITableProps<T extends IdentifiableRecord, S extends IdentifiableRecord> {
    columns: IColumnType<T>[];
    page: IPage<S>;
    onDelete: (id: S) => void;
    onEdit: (data: S) => void;
    mapModelToTableRow: (model: S) => T;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
    onRowsPerPageChange:  (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function Table<T extends IdentifiableRecord, S extends IdentifiableRecord>({
    columns, 
    page, 
    onEdit,
    onDelete,
    mapModelToTableRow,
    onPageChange,
    onRowsPerPageChange
}: ITableProps<T, S>): JSX.Element {

    const rowsPerPageOptions = [
		{ value: 1, label: '1' },
		{ value: 5, label: '5'},
		{ value: 10, label: '10'},
	];

    return (
        <>
            <TableContainer>
                <MuiTable stickyHeader aria-label="sticky table">
                    <TableHeader columns={columns} />
                    <TableBody 
                        data={page.content}
                        columns={columns}
                        onEdit={onEdit}
                        onDelete={onDelete} 
                        mapModelToTableRow={mapModelToTableRow} />
                </MuiTable>
            </TableContainer>
            <TablePagination 
                rowsPerPageOptions={rowsPerPageOptions}
                component='div'
                count={page.totalElements}
                rowsPerPage={page.size}
                page={page.number}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </>
    );
};

export default Table;

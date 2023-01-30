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
}

function Table<T extends IdentifiableRecord, S extends IdentifiableRecord>({
    columns, 
    page, 
    onEdit,
    onDelete,
    mapModelToTableRow
}: ITableProps<T, S>): JSX.Element {
	const [rowsPerPage, setRowsPerPage] = React.useState(-1);
	const [pageNumber, setPageNumber] = React.useState(0);

    // const {
    //     content,
    //     totalElements,
    //     totalPages,
    //     numberOfElements,
    //     number,
    //     first,
    //     last,
    //     empty,
    //     pageable,
    // } = page;

	const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const rowsPerPage = +event.target.value;
		setRowsPerPage(rowsPerPage);
	}

	const handlePageChange = (event: any, page: number) => {
		setPageNumber(page);	
	}


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
                rowsPerPage={rowsPerPage}
                page={pageNumber}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
        </>
    );
};

export default Table;

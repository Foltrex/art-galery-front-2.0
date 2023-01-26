import { Table as MuiTable, TableContainer } from '@mui/material';
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
    data: S[];
    onDelete: (id: S) => void;
    onEdit: (data: S) => void;
    mapModelToTableRow: (model: S) => T;
}

function Table<T extends IdentifiableRecord, S extends IdentifiableRecord>({
    columns, 
    data, 
    onEdit,
    onDelete,
    mapModelToTableRow 
}: ITableProps<T, S>): JSX.Element {

    return (
        <TableContainer>
            <MuiTable stickyHeader aria-label="sticky table">
                <TableHeader columns={columns} />
                <TableBody 
                    data={data}
                    columns={columns}
                    onEdit={onEdit}
                    onDelete={onDelete} 
                    mapModelToTableRow={mapModelToTableRow} />
            </MuiTable>
        </TableContainer>
    );
};

export default Table;

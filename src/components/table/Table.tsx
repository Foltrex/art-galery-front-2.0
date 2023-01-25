import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { default as DeleteOutlined, default as DeleteOutlinedIcon } from '@mui/icons-material/DeleteOutlined';
import Edit from '@mui/icons-material/Edit';
import FirstPage from '@mui/icons-material/FirstPage';
import LastPage from '@mui/icons-material/LastPage';
import ModeIcon from '@mui/icons-material/Mode';
import { forwardRef } from 'react';
import { Button, Table as MuiTable, TableCell, TableContainer, TableRow } from '@mui/material';
import facilities from '../../pages/facilities';
import FacilityForm from '../../pages/facilities/FacilityForm';
import DeleteModal from '../modal/DeleteModal';
import TableBody from './TableBody';
import TableHeader from './TableHeader';

export interface IColumnType<T> {
    key: string;
    title: string;
    minWidth: number;
    render?: (column: IColumnType<T>, item: T) => void;
}

interface ITableProps<T> {
    title: string;
    columns: IColumnType<T>[];
    data: T[];
    onDelete: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, data?: T) => void;
    onEdit: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>, data?: T) => void;
}

function Table<T>({ 
    title, 
    columns, 
    data, 
    onEdit,
    onDelete 
}: ITableProps<T>): JSX.Element {

    return (
        <TableContainer>
            <MuiTable stickyHeader aria-label="sticky table">
                <TableHeader columns={columns} />
                <TableBody 
                    data={data} 
                    columns={columns}
                    onEdit={onEdit}
                    onDelete={onDelete} />
            </MuiTable>
        </TableContainer>
    );
};

export default Table;

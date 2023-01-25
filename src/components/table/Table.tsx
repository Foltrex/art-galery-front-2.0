import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { default as DeleteOutlined, default as DeleteOutlinedIcon } from '@mui/icons-material/DeleteOutlined';
import Edit from '@mui/icons-material/Edit';
import FirstPage from '@mui/icons-material/FirstPage';
import LastPage from '@mui/icons-material/LastPage';
import ModeIcon from '@mui/icons-material/Mode';
import MaterialTable, { Action, Column, Icons } from 'material-table';
import { forwardRef } from 'react';

const tableIcons: Icons = {
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutlined {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />)
}


interface ITableProps<T extends object> {
    title: string;
    columns: Column<T>[];
    data: T[];
    onDelete: (event?: React.MouseEvent<HTMLElement>, data?: T) => void;
    onEdit: (event?: React.MouseEvent<HTMLElement>, data?: T) => void;
}

function Table<T extends object>({ 
    title, 
    columns, 
    data, 
    onEdit,
    onDelete 
}: ITableProps<T>): JSX.Element {
    
    const actions: Action<T>[] = [
        {
            icon: () => <ModeIcon />,
            tooltip: `Edit model`,
            onClick: (event, data) => onEdit(event, data as T)
        },
        {
            icon: () => <DeleteOutlinedIcon />,
            tooltip: 'Delete model',
            onClick: (event, data) => onDelete(event, data as T)
        }
    ]

    return (
        <MaterialTable
            title={title}
            columns={columns}
            data={data}
            icons={tableIcons}
            options={{
                search: false,
                actionsColumnIndex: -1
            }}
            actions={actions}
        />
    );
};

export default Table;

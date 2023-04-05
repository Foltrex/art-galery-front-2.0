import {TableBody as MuiTableBody} from '@mui/material';
import {IPage} from '../../hooks/react-query';
import {IColumnType, IdentifiableRecord} from './Table';
import TableRow from './TableRow';

interface ITableBodyProps<S extends IdentifiableRecord> {
    columns: IColumnType<S>[];
    page: IPage<S>;
	editable: boolean;
    onDelete: (id: S) => void;
    onEdit: (data: S) => void;
}

function TableBody<S extends IdentifiableRecord>({
	page,
	editable,
	columns,
	onEdit,
	onDelete
}: ITableBodyProps<S>): JSX.Element {
	const { content, number, size } = page;
	
	return (
		<MuiTableBody>
			{content.map((item, itemIndex) => (
				<TableRow
					key={`table-row-${itemIndex}`} 
					number={itemIndex + 1 + number * size} 
					columns={columns}
					item={item}
					editable={editable}
					onDelete={onDelete} 
					onEdit={onEdit} />
			))}
		</MuiTableBody>
	);
}

export default TableBody;

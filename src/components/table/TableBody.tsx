import { TableBody as MuiTableBody } from '@mui/material';
import { IPage } from '../../hooks/react-query';
import { IColumnType, IdentifiableRecord } from './Table';
import TableRow from './TableRow';

interface ITableBodyProps<T extends IdentifiableRecord, S extends IdentifiableRecord> {
    columns: IColumnType<T>[];
    page: IPage<S>;
    onDelete: (id: S) => void;
    onEdit: (data: S) => void;
    mapModelToTableRow: (model: S) => T;
}

function TableBody<T extends IdentifiableRecord, S extends IdentifiableRecord>({ 
	page,
	columns,
	onEdit,
	onDelete,
	mapModelToTableRow
}: ITableBodyProps<T, S>): JSX.Element {
	const { content, number, size } = page;
	
	return (
		<MuiTableBody>
			{content.map((item, itemIndex) => (
				<TableRow 
					key={`table-row-${itemIndex}`} 
					number={itemIndex + 1 + number * size} 
					columns={columns} 
					item={item} 
					onDelete={onDelete} 
					onEdit={onEdit} 
					mapModelToTableRow={mapModelToTableRow} />
			))}
		</MuiTableBody>
	);
};

export default TableBody;

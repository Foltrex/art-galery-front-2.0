import { TableCell, TableHead, TableRow } from '@mui/material';
import { IColumnType } from './Table';

interface ITableHeaderProps<T> {
	columns: IColumnType<T>[];
}

function TableHeader<T>({columns}: ITableHeaderProps<T>): JSX.Element {
	return (
		<TableHead>
			<TableRow>
				<TableCell
					align='center'
					style={{minWidth: 5}}>
						#
				</TableCell>

				{columns.map((column) => (
					<TableCell
						key={column.key}
						align='center'
						style={{minWidth: column.minWidth}}
					>
						<b>{column.title}</b>
					</TableCell>
				))}
				
				<TableCell
					align='center'
					style={{minWidth: 150}}>
						<b>Actions</b>
				</TableCell>
			</TableRow>
		</TableHead>
  	);
};

export default TableHeader;

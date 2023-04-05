import { TableCell, TableHead, TableRow } from '@mui/material';
import { IColumnType, IdentifiableRecord } from './Table';

interface ITableHeaderProps<T extends IdentifiableRecord> {
	columns: IColumnType<T>[];
	showActions?: boolean;
}

function TableHeader<T extends IdentifiableRecord>({columns, showActions = false}: ITableHeaderProps<T>): JSX.Element {
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
						style={{minWidth: column.minWidth || 150}}
					>
						<b>{column.title}</b>
					</TableCell>
				))}
				
				<TableCell></TableCell>
			</TableRow>
		</TableHead>
  	);
};

export default TableHeader;

import {TableCell, TableHead, TableRow} from '@mui/material';
import {IColumnType, IdentifiableRecord} from './Table';
import {useState} from "react";
import TableSortLabel from '@mui/material/TableSortLabel';

interface ITableHeaderProps<T extends IdentifiableRecord> {
	columns: IColumnType<T>[];
	showActions?: boolean;
}

function TableHeader<T extends IdentifiableRecord>({columns, showActions = false}: ITableHeaderProps<T>): JSX.Element {

	const [sortDirection, setSortDirection] = useState<'asc'|'desc'|undefined>();
	const [sortKey, setSortKey] = useState<string>('');

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
						sortDirection={sortDirection}
						onClick={() => {
							if(!column.sort) {
								return;
							}
							const newSort = sortDirection === undefined ? 'asc' : (sortDirection === 'asc' ? 'desc' : undefined);
							setSortDirection(newSort);
							setSortKey(column.key);
							column.sort(column.key, newSort);
						}}
					>
						{column.sort && <TableSortLabel direction={sortDirection} active={
							sortKey === column.key && sortDirection !== undefined}/>}
						<b>{column.title}</b>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
  	);
};

export default TableHeader;

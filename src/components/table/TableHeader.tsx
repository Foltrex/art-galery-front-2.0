import {TableCell, TableHead, TableRow} from '@mui/material';
import {IColumnType, IdentifiableRecord} from './Table';
import {useState} from "react";
import TableSortLabel from '@mui/material/TableSortLabel';

interface ITableHeaderProps<T extends IdentifiableRecord> {
	columns: IColumnType<T>[];
}

function TableHeader<T extends IdentifiableRecord>({columns}: ITableHeaderProps<T>): JSX.Element {

	const [sortDirection, setSortDirection] = useState<'asc'|'desc'|undefined>();
	const [sortKey, setSortKey] = useState<string>('');

	const renderTableTitle = (tableTitle: string | JSX.Element) => {
		if (tableTitle instanceof String) {
			return <b>{tableTitle}</b>;
		} else {
			return tableTitle;
		}
	}

	return (
		<TableHead>
			<TableRow>
				<TableCell
					align='center'
					style={{minWidth: 5}}>
						#
				</TableCell>

				{columns.filter(c => !c.groupBy).map((column) => (
					<TableCell
						colSpan={column.colspan}
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
						{/* <b>{column.title}</b> */}
						{renderTableTitle(column.title)}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
  	);
};

export default TableHeader;

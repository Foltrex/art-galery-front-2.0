import {TableBody as MuiTableBody} from '@mui/material';
import {IPage} from '../../hooks/react-query';
import {IColumnType, IdentifiableRecord} from './Table';
import TableRow from './TableRow';
import {ReactNode, useMemo, useState} from "react";
import TableSortLabel from "@mui/material/TableSortLabel";

interface ITableBodyProps<S extends IdentifiableRecord> {
    columns: IColumnType<S>[];
    page: IPage<S>;
	groupBy?:string[]
}
enum BucketType {
	CONTAINER, WRAPPER
}

interface Bucket<S extends IdentifiableRecord> {
	id: string,
	name: string,
	type: BucketType
	bucketsSize: number
	column: IColumnType<S>
	sample: S
	content:{item: S, index: number}[]
	buckets: Record<string, Bucket<S>>
}

const UNKNOWN = "[unknown]";

function prepareBuckets<S extends IdentifiableRecord>(columns:IColumnType<S>[], data:{item: S, index: number}[], groupBy:string[], index:number) {
	const group = groupBy[index];
	const buckets:Record<string, Bucket<S>> = {};
	const lastIteration = index == groupBy.length - 1;
	data.forEach(item => {
		let column:IColumnType<S>|undefined = undefined;
		for(let i = 0; i < columns.length; i++) {
			const col = columns[i];
			if(col.key === group) {
				column = col;
				break;
			}
		}

		if(!column || !column.groupBy) {
			throw new Error("Table not properly configured, column with group key not found - " + group);
		}
		let name = column.groupBy(item.item);
		if(name === undefined) {
			name = "[unknown]";
		}
		if(buckets[name] === undefined) {
			buckets[name] = {
				id: 'b' + Math.random(),
				name: name,
				bucketsSize: 0,
				type: lastIteration ? BucketType.CONTAINER : BucketType.WRAPPER,
				sample: item.item,
				column: column,
				content: [],
				buckets: {},
			}
		}
		//@ts-ignore
		buckets[name].content.push(item);
	})
	if(buckets[UNKNOWN]) {
		//set unknown group to the end of list
		const u = buckets[UNKNOWN]
		delete(buckets[UNKNOWN]);
		buckets[UNKNOWN] = u;
	}

	if (!lastIteration) {
		for(let key in buckets) {
			const bucket = buckets[key];
			bucket.buckets = prepareBuckets(columns, bucket.content, groupBy, index + 1);
			bucket.content = [];
		}
	}
	if(index === 0) {
		const bIndex:[number] = [1];
		for(let key in buckets) {
			reindexBucket(buckets[key], bIndex);
		}
	}
 	return buckets;
}

function reindexBucket<S extends IdentifiableRecord>(b:Bucket<S>, index:[number]) {
	b.content?.forEach(function(c) {
		c.index = index[0];
		index[0] = index[0] + 1;
	})
	let bucketsSize = 0;
	const toDelete:string[] = [];
	for(let bIndex in b.buckets) {
		const child = b.buckets[bIndex];
		reindexBucket(child, index);
		if(child.content?.length === 1) {
			b.content = b.content.concat(child.content);
			toDelete.push(bIndex);
		} else {
			bucketsSize++;
		}
	}
	toDelete.forEach(index => delete(b.buckets[index]));
	b.bucketsSize = bucketsSize;
}


function buildGroupColumn<S extends IdentifiableRecord>(column:IColumnType<S>, toggle:ReactNode, depth:number, colspan:number):IColumnType<{id:string, content:ReactNode}> {
	return {
		key: 'id',
		title: column.title,
		colspan: colspan,
		render: (data) => {
			return <div style={{paddingLeft: depth * 20, textAlign: "left"}}>
				{toggle}&nbsp;{data.content}
			</div>
		}
	}
}

function GroupRow<S extends IdentifiableRecord> ({bucket, columns, level, clazz}:{
	bucket:Bucket<S>
	columns: IColumnType<S>[],
	level: number
	clazz?: string
}) {
	const [isOpen, setIsOpen] = useState(true);
	const [isShown, setIsShown] = useState(isOpen);

	if(bucket.content?.length === 1 && bucket.bucketsSize === 0) {
		return <TableRow key={bucket.content[0].item.id} number={bucket.content[0].index} columns={columns} item={bucket.content[0].item} />
	}

	let mainContent = bucket.column.render
		? bucket.column.render(bucket.sample)
		: (bucket.sample as any)[bucket.column.key];
	if(!mainContent) {
		mainContent = UNKNOWN;
	}
	const toggle = <TableSortLabel active={true} direction={isOpen ? 'desc' : 'asc'} onClick={() => {
		setIsOpen(!isOpen);
		setTimeout(function() {
			setIsShown(!isOpen);
		}, 200)
	}}/>
	const bucketsContent = [];
	const childClazz = clazz || (isOpen ? 'table-group-visible' : 'table-group-invis');
	if(isShown) {
		for(let bIndex in bucket.buckets) {
			const b = bucket.buckets[bIndex];
			bucketsContent.push(<GroupRow key={b.id} bucket={b} columns={columns} level={level + 1} clazz={childClazz}/>)
		}
	}
	return <>
		<TableRow key={bucket.id} number={null} clazz={clazz} columns={[buildGroupColumn(bucket.column, toggle, level, columns.length)]} item={({
			id: "r" + Math.random(),
			content: mainContent
		})}/>
		{isShown && bucket.content?.map((item) => {
			return <TableRow key={item.item.id} clazz={childClazz} number={item.index} columns={columns} item={item.item} />
		})}
		{bucketsContent}
	</>
}

function TableBody<S extends IdentifiableRecord>({
	page,
	columns,
    groupBy
}: ITableBodyProps<S>): JSX.Element {
	const { content, number, size } = page;
	const data:ReactNode[] = useMemo(() => {
		if(!groupBy || groupBy.length === 0) {
			return content.map((item, itemIndex) => <TableRow
				key={item.id}
				number={itemIndex + 1 + number * size}
				columns={columns}
				item={item}/>)
		}
		const result:ReactNode[] = []
		const buckets = prepareBuckets<S>(columns, content.map((c, i) => ({item: c, index: i + 1 + number * size})), groupBy, 0);

		for(let key in buckets) {
			result.push(<GroupRow bucket={buckets[key]} columns={columns} level={0}/>);
		}

		console.log(result)
		return result;
	}, [groupBy, content, columns]);

	return (
		<MuiTableBody>
			{data}
		</MuiTableBody>
	);
}

export default TableBody;

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Table, Icon, Segment, Dimmer, Loader, Image, ItemHeader, Form, Input, Button } from 'semantic-ui-react'
import _ from 'lodash';
import PersonEditModule from './PersonEditModule';
import SubTable from './SubTable';


const tableData = [
	{
		name: 'Laddar...', email: 'Laddar...', active: 'Laddar...', phone_id: 'Laddar...', sith: 'Laddar...',
		admin: 'Laddar...', east: 'Laddar...', angered: 'Laddar...', lundby: 'Laddar...', id: 'Laddar...',
		care_id_1: 'Laddar...', care_id_2: 'Laddar...', comment: 'Laddar...'
	},
]



function Main() {
	const [fetching, setFetching] = useState(true);
	const [people, setPeople] = useState([
		{
			name: 'Laddar...', email: 'Laddar...', active: 'Laddar...', phone_id: 'Laddar...', sith: 'Laddar...',
			admin: 'Laddar...', east: 'Laddar...', angered: 'Laddar...', lundby: 'Laddar...', id: 'Laddar...',
			care_id_2: 'Laddar...', comment: 'Laddar...'
		},
	]);
	const [fakePeople, setFakePeople] = useState([{ name: 'Loading', email: 'Loading', active: 'Loading', phone_id: 'Loading', sith: 'Loading', admin: 'Loading', id: 'Loading', care_id_2: 'Loading' }])
	const [formName, setFormName] = useState('hello');
	const [controlledExpanded, setControlledExpanded] = useState({ 0: true });
	const [expandedRows, setExpandedRows] = useState([]);
	const [refresher, setRefresher] = useState(false);
	const [tableSize, setTableSize] = useState(0);



	useEffect(() => {
		fetch('http://localhost:8000/api/employees')
			.then(response => response.json())
			.then(data => {
				setFetching(false);
				setPeople([...data]);
			});
	}, [refresher]);

	function exampleReducer(state, action) {
		switch (action.type) {
			case 'CHANGE_SORT':
				if (state.column === action.column) {
					setPeople([...people.slice().reverse(),])
					return {
						...state,
						data: people.slice().reverse(),
						direction:
							state.direction === 'ascending' ? 'descending' : 'ascending',
					}

				}

				setPeople([..._.sortBy(people, [action.column]),])
				return {
					column: action.column,
					data: _.sortBy(people, [action.column]),
					direction: 'ascending',
				}
			default:
				throw new Error()
		}
	}

	function handleSubmit(event) {

	}
	function handleInputChange(event) {
		const target = event.target;
		if (target.name === 'name') setFormName(target.value);
	}


	let [state, dispatch] = React.useReducer(exampleReducer, {
		column: null,
		data: people,
		direction: null,
	})
	let { column, data, direction } = state

	function handleRowClick(rowId) {
		const currentExpandedRows = expandedRows;
		const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

		const newExpandedRows = isRowCurrentlyExpanded
			? currentExpandedRows.filter(id => id !== rowId)
			: currentExpandedRows.concat(rowId);

		setExpandedRows(newExpandedRows);
	}

	function renderRow(item, index) {
		const itemRows = [
			<Table.Row key={item.id} onClick={() => handleRowClick(index)}>
				<Table.Cell textAlign='center'>{renderItemCaret(index)}</Table.Cell>
				<Table.Cell>{item.name}</Table.Cell>
				<Table.Cell>{item.email}</Table.Cell>
				<Table.Cell textAlign='center'>{item.active === 0 ? '❌' : '✔️'}</Table.Cell>
				<Table.Cell textAlign='center'>{item.phone_id}</Table.Cell>
				<Table.Cell textAlign='center'>{item.sith === 'Yes' ? '✔️' : item.sith === 'N Never' ? '❌' : item.sith === 'To Install' ? '🕑' : item.sith === 'Ordered' ? '✉️' : item.sith === 'To Order' ? '❗' : item.sith === 'Delete' ? '🗑️' : item.sith === 'Deleted' ? '🗑️' : '???'}</Table.Cell>
				<Table.Cell textAlign='center'>{item.admin === 0 ? '❌' : '✔️'}</Table.Cell>
				<Table.Cell textAlign='center'>{item.east === 0 ? '❌' : '✔️'}</Table.Cell>
				<Table.Cell textAlign='center'>{item.angered === 0 ? '❌' : '✔️'}</Table.Cell>
				<Table.Cell textAlign='center'>{item.lundby === 0 ? '❌' : '✔️'}</Table.Cell>
				<Table.Cell>{item.id}</Table.Cell>
				<Table.Cell>{item.care_id_2}</Table.Cell>
				<Table.Cell>{item.policy_it_signed === 'N Do' ? 'Ej Klar' : item.policy_it_signed}</Table.Cell>
				<Table.Cell>{item.comment}</Table.Cell>
			</Table.Row>
		];

		if (expandedRows.includes(index)) {
			itemRows.push(
				<Table.Row key={"row-expanded-" + index}>
					<Table.Cell colSpan="16">{renderItemDetails(item)}</Table.Cell>
				</Table.Row>
			);
		}

		return itemRows;
	}

	function handleSizeChange(value) {
		setTableSize(value);
	}

	const headers = [['name', 'Namn', 8], ['mail', 'Mejl', 6], ['active', 'Aktiv', 2], ['phone_id', 'Tele', 2], ['sith', 'SITH', 2], ['admin', 'Adm.', 2], ['east', 'Östra', 2],
	['angered', 'Ang.', 2], ['lundby', 'Lund.', 2], ['id', 'ID', 2], ['care_id_2', 'Carefox ID', 3], ['policy_it_signed', 'IT Policy', 3], ['comment', 'Kommentar', 16]];

	return (
		<React.Fragment>
			<Form float="left">
				<h3>Storlek</h3>
				<Button.Group>
					<Button active={tableSize === 0} onClick={() => handleSizeChange(0)}>Stor</Button>
					<Button active={tableSize === 1} onClick={() => handleSizeChange(1)}>Mellan</Button>
					<Button active={tableSize === 2} onClick={() => handleSizeChange(2)}>Kompakt</Button>
				</Button.Group>

			</Form>
			<Form>
				<h3>Sök...</h3>
				<Input
					icon={{ name: 'search', circular: true, link: true }}
					placeholder='Search...'
				/>
			</Form>
			<SubTable data={{ tableSize: tableSize, headers: headers }} />
		</React.Fragment>

	);
}

export default Main;
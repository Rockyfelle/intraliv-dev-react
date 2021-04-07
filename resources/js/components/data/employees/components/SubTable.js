import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Table, Icon, Segment, Dimmer, Loader, Image, ItemHeader, Form, Input, Button } from 'semantic-ui-react'
import _ from 'lodash';
import PersonEditModule from './PersonEditModule';
import SubTable from './SubTable';
import TableFunctionCaret from './TableFunctionCaret';


const tableData = [
	{
		name: 'Laddar...', email: 'Laddar...', active: 'Laddar...', phone_id: 'Laddar...', sith: 'Laddar...',
		admin: 'Laddar...', east: 'Laddar...', angered: 'Laddar...', lundby: 'Laddar...', id: 'Laddar...',
		care_id_1: 'Laddar...', care_id_2: 'Laddar...', comment: 'Laddar...'
	},
]



function Main(props) {
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
				<TableFunctionCaret data={{index: index, expandedRows: expandedRows}}/>
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

	let renderAllRows = [];
	people.forEach((item, index) => {
		const perItemRows = renderRow(item, index);
		renderAllRows = renderAllRows.concat(perItemRows);
	});



	function sendDataToParent(newPerson) {
		if (newPerson.status === 'updated') {
			setPeople((oldPeople) => {
				const newPeople = [...oldPeople];
				const index = newPeople.findIndex(x => x.id === newPerson.id);
				if (index !== -1) {
					newPeople[index] = newPerson;
				} else {
					setFetching(true);
					setRefresher(!refresher);
				}
				return newPeople;
			});
		} else {
			setPeople((oldPeople) => {
				const newPeople = [...oldPeople];
				const index = newPeople.findIndex(x => x.id === newPerson.id);
				newPeople.splice(index, 1);
				return newPeople;
			});
		}
	}

	function renderItemDetails(item) {
		return (
			<Segment basic>
				<PersonEditModule data={item} className="m-5" sendDataToParent={sendDataToParent}></PersonEditModule>
			</Segment>
		);
	}

	const headerHtml = props.data.headers.map((item, index) => {
		return (
			<Table.HeaderCell
				key={index}
				width={item[2]}
				sorted={column === item[0] ? direction : null}
				onClick={() => dispatch({ type: 'CHANGE_SORT', column: item[0] })}
			>
				{item[1]}
			</Table.HeaderCell>
		)
	})

	return (
		<React.Fragment>
			<Table sortable celled fixed striped selectable compact={props.data.tableSize === 0 ? false : props.data.tableSize === 1 ? true : 'very'}>
				{/*<Dimmer active={fetching}>
					<Loader size="large">Laddar...</Loader>
				</Dimmer>*/}
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell
							width={2}
						>
							Öppna
                        </Table.HeaderCell>
						{headerHtml}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{renderAllRows}
				</Table.Body>
			</Table>
		</React.Fragment>

	);
}

export default Main;
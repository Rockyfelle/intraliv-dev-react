import { initial } from 'lodash';
import React, { useState, useEffect } from 'react';
import {
	Checkbox,
	Form,
	TextArea,
	Button,
	Confirm,
	Message,
} from 'semantic-ui-react'




const optionsStatus = [
	{ key: 'Usable', text: 'Användbar', value: 'Usable' },
	{ key: 'Need Checkup', text: 'Måste Undersökas', value: 'Need Checkup' },
	{ key: 'Does not Work', text: 'Fungerar Ej', value: 'Does not Work' },
	{ key: 'To Register', text: 'Ska Registreras', value: 'To Register' },
	{ key: 'To Install', text: 'Ska Installeras', value: 'To Install' },
	{ key: 'Waiting for Mail', text: 'Väntar på Post', value: 'Waiting for Mail' },
	{ key: 'Missing Case', text: 'Saknar Skal', value: 'Missing Case' }
];

const optionsPhoniro = [
	{ key: 'Yes', text: 'Finns med Stadsdel', value: 'Yes' },
	{ key: 'Half', text: 'Finns utan Stadsdel', value: 'Half' },
	{ key: 'No', text: 'Finns Ej', value: 'No' },
];


function PersonEditModule(props) {
	const [form, setForm] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [uploadingStatus, setUploadingStatus] = useState({ status: 'standby', text: '' });
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const initialEmployeeList = props.data.employees.map((item) => {
		return(item.id);
	});
	const [formUser, setFormUser] = useState([...initialEmployeeList]);
	const [employeeList, setEmployeeList] = useState([]);
	const [userPhoneLog, setUserPhoneLog] = useState([]);

	useEffect(() => {
		fetch('/api/employees')
			.then(response => response.json())
			.then(data => {
				setEmployeeList(data.map((item) => {
					return (
						{ key: item.id, text: item.name, value: item.id, phone_id: item.phone_id, phone_name: item.phone.name }
					);
				}));
			});
	}, []);

	if (props.data !== undefined && isLoading === true) {
		setIsLoading(false);
		const newForm = { ...props.data };
		newForm.free = props.data.free === 1 ? true : false;
		newForm.personal = props.data.personal === 1 ? true : false;
		newForm.east = props.data.east === 1 ? true : false;
		newForm.angered = props.data.angered === 1 ? true : false;
		newForm.lundby = props.data.lundby === 1 ? true : false;
		setForm({ ...newForm });
	}

	function handleInputChange(e) {
		const target = e.target;
		form[target.name] = target.value;
		setForm({ ...form });
	}

	function handleUserInputChange(e, data) {
		const target = e.target; console.log(data);
		setFormUser(data.value);
		const newPhoneLog = data.value.map((item) => {
			if (item.phone_id !== '') {
				return (
					<Message negative key={'message ' + item}>
						<Message.Header>Varning, {employeeList.find(x => x.key === item).text} har redan telefon WP{employeeList.find(x => x.key === item).phone_name}</Message.Header>
						<p>
							Om du lägger till denna telefonen på han kommer den gamla att överskrivas då en anställd endast kan ha en telefon registrerad på sig.
					</p>
					</Message>
				);
			}
		});
		setUserPhoneLog([...newPhoneLog]);
	}

	function handleSelectChange(e, name, val) {
		const target = e.target;
		form[name] = val.value;
		setForm({ ...form });
	}

	function handleCheckboxChange(e, name) {
		const target = e.target;
		form[name] = !form[name];
		setForm({ ...form });
	}

	function handleSubmit(event) {
		event.preventDefault();
		setUploadingStatus({ status: 'uploading', text: 'Updaterar data, vänligen vänta...' });
		const postMethod = (props.data.id !== '') ? 'PUT' : 'POST';
		fetch('/api/phones', {
			method: postMethod,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: form.name,
				status: form.status,
				employees: formUser,
				phoniro_status: form.phoniro_status,
				free: form.free,
				personal: form.personal,
				east: form.east,
				angered: form.angered,
				lundby: form.lundby,
				comment: form.comment,
			}),
		})
			.then(response => response.json())
			.then(data => {
				if (data.status === 'success') {
					setUploadingStatus(form.id !== '' ? { status: 'success', text: 'Telefonen har blivit uppdaterad' } : { status: 'success', text: 'Telefonen har lags till' });
					const newForm = { ...form };
					newForm.free = newForm.free === true ? 1 : 0;
					newForm.personal = newForm.personal === true ? 1 : 0;
					newForm.east = newForm.east === true ? 1 : 0;
					newForm.angered = newForm.angered === true ? 1 : 0;
					newForm.lundby = newForm.lundby === true ? 1 : 0;
					props.sendDataToParent({ status: 'updated', newForm: newForm });
				} else {
					setUploadingStatus({ status: 'error', text: 'Error: ' + data.text });
				}
			});
	}

	function handleRemovePress(event) {
		event.preventDefault();
		setDeleteConfirmOpen(true);
	}

	function handleRemoveConfirm() {
		setDeleteConfirmOpen(false);
		fetch('/api/phones', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: form.id }),
		})
			.then(response => response.json())
			.then(data => {
				if (data.status === 'success') {
					setUploadingStatus({ status: 'success', text: 'Telefonen har tagits bort' });
					props.sendDataToParent({ status: 'deleted', id: form.id });
				} else {
					setUploadingStatus({ status: 'error', text: 'Error: ' + data.text });
				}
			});
	}


	return (
		<>
			<Form>
				<Form.Group widths='equal'>
					<Form.Input
						name='name'
						fluid
						label='Telefonsiffra WPXX (Skriv bara numret, ej WP)'
						placeholder='99'
						value={form.name}
						onChange={e => handleInputChange(e)}
					/>
					<Form.Select
						name='status'
						options={optionsStatus}
						fluid
						label='Status'
						defaultValue={form.status}
						onChange={(e, val) => handleSelectChange(e, 'status', val)}
					/>
				</Form.Group>
				<Form.Group widths='equal'>
					<Form.Dropdown
						name='user'
						label='Användare'
						placeholder='Klas Bertilsson'
						disabled={employeeList.length === 0}
						fluid
						multiple
						selection
						options={employeeList}
						value={formUser}
						onChange={(e, data) => handleUserInputChange(e, data)}
					/>
					<Form.Select
						name='phoniro_status'
						options={optionsPhoniro}
						fluid
						label='Phoniro Status'
						defaultValue={form.phoniro_status}
						onChange={(e, val) => handleSelectChange(e, 'phoniro_status', val)}
					/>
				</Form.Group>
				{userPhoneLog}
				<Form.Field
					control={Checkbox}
					label='Ledig'
					name='free'
					defaultChecked={form.free}
					onChange={e => handleCheckboxChange(e, 'free')}
				/>
				<Form.Field
					control={Checkbox}
					label='Personlig'
					name='personal Telefon'
					defaultChecked={form.personal}
					onChange={e => handleCheckboxChange(e, 'personal')}
				/>
				<Form.Field
					control={Checkbox}
					label='Östra'
					name='east'
					defaultChecked={form.east}
					onChange={e => handleCheckboxChange(e, 'east')}
				/>
				<Form.Field
					control={Checkbox}
					label='Angered'
					name='angered'
					defaultChecked={form.angered}
					onChange={e => handleCheckboxChange(e, 'angered')}
				/>
				<Form.Field
					control={Checkbox}
					label='Lundby'
					name='lundby'
					defaultChecked={form.lundby}
					onChange={e => handleCheckboxChange(e, 'lundby')}
				/>
				<Form.Field
					control={TextArea}
					label='Kommentar'
					name='comment'
					placeholder='Kommentar'
					value={form.comment}
					onChange={e => handleInputChange(e)}
				/>
				<Button type='submit' className="w-100 mb-3" disabled={isLoading} onClick={event => handleSubmit(event)}>{(props.data.id !== '') ? 'Uppdatera Telefon' : 'Lägg Till Telefon'}</Button>
				{props.data.id !== '' &&
					<div>
						<Button type='submit' color="red" className="w-100" onClick={event => handleRemovePress(event)}>Ta Bort Telefonen Från Systemet</Button>
						<Confirm
							open={deleteConfirmOpen}
							onConfirm={() => handleRemoveConfirm()}
							onCancel={() => setDeleteConfirmOpen(false)}
							cancelButton="Avbryt"
							confirmButton="Ta Bort Telefon"
							content="Ta inte bort en telefon för att den inte används, ändra istället telefonens status till ledig. 
							Är du säker på att du vill ta bort telefonen? Detta går inte att ångra."
							header="Ta Bort Telefonen"
						/>
					</div>
				}
			</Form>
			<center>
				<h2 className="mt-3">{uploadingStatus.text}</h2>
			</center>
		</>
	);
}

export default PersonEditModule;
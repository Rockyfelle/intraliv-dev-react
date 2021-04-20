import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { UserContext } from './components/UserContext';

const Login = function () {
	const [loginEmail, setLoginEmail] = useState('felixlinne@livara.se');
	const [loginPassword, setLoginPassword] = useState('password');
	const [loadingStatus, setLoadingStatus] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errorText, setErrorText] = useState('');
	const [isError, setIsError] = useState(false);
	const { user, setUser } = useContext(UserContext);
	const history = useHistory();

	function postLogin(e) {
		setIsError(false);
		setErrorText('');
		e.preventDefault();
		setLoadingStatus('uploading');
		setIsLoading(true);
		fetch(`/api/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email: loginEmail, password: loginPassword })
		})
			.then(res => res.json())
			.then(
				(result) => {
					setLoadingStatus('');
					if (result.status === "success") {
						setIsLoading(false);
						result.user.token = result.token;
						setUser(result.user);
						localStorage.setItem('user', JSON.stringify(result.user));
						localStorage.setItem('token', result.user.token);
						history.push('/data/employees/view');
					} else {
						setErrorText(result.text);
						setIsError(true);
						setIsLoading(false);
					}
				},
				(error) => {
					alert("error");
				}
			);
	}

	function handleEmailChange(e) {
		setLoginEmail(e.target.value);
	}
	function handlePasswordChange(e) {
		setLoginPassword(e.target.value);
	}

	return (
		<Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
			<Grid.Column style={{ maxWidth: 450 }}>
				<Header as='h2' color='teal' textAlign='center'>
					<Image src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png' /> Log-in to your account
				</Header>
				<Form size='large' loading={isLoading}>
					<Segment stacked disabled={isLoading}>
						<Form.Input
							fluid
							icon='user'
							iconPosition='left'
							placeholder='E-mail address'
							value={loginEmail}
							onChange={(e) => handleEmailChange(e)}
						/>
						<Form.Input
							fluid
							icon='lock'
							iconPosition='left'
							placeholder='Password'
							type='password'
							value={loginPassword}
							onChange={(e) => handlePasswordChange(e)}
						/>
						<Message
							error
							visible={isError}
							header='Could Not Login'
							content={errorText}
						/>
						<Button color='teal' fluid size='large' onClick={(e) => postLogin(e)}>
							Login
						</Button>
					</Segment>
				</Form>
				<Message>
					New to us? <a href='#'>Sign Up</a>
				</Message>
			</Grid.Column>
		</Grid>
	);
}

export default Login;
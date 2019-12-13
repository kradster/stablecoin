import React from 'react';
import InputField from '../Common/textField';
import { connect } from 'react-redux';
import { login } from '../../Actions/loginAction';
import PropTypes from 'prop-types';
import ErrorLabel from '../Common/errorLabel';
import SHA256 from "crypto-js/sha256";
import Navbar from '../../containers/navbar';
import { Link } from 'react-router-dom';
import ForgotPasswordModal from 'react-responsive-modal';
import ResetPasswordModal from 'react-responsive-modal';
import ActivatePasswordModal from 'react-responsive-modal';
import { Alert } from 'reactstrap';
import { forgotPasswordAction, resetPasswordAction, activateAccountAction,activateEmpAccountAction } from '././../../Actions/userAction'
import {verifyCorrectPassword} from '../../common/__helper'
import { messages } from '../../common/message';
import MultipleError from '../Common/multiplrError';
import * as MessagePop from '../Common/messagePop';
var JWT = require('jsonwebtoken')

/**
 * Class to perform login operation.
 */
class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			error: '',
			isError: false,
			isLoading: false,
			forgotPasswordModal: false,
			flashMessageSuccess: '',
			flashMessageError: '',
			forgot_email: '',
			resetPasswordModal: false,
			activePasswordModal:false,
			reset_password: '',
			confirm_password: '',
			callAPI: false,
			successAlert: '',
			IspasswordOk:true, 
			passwordActivation:false,
			isSubmitted:false,
			"userSubmited":false
		};
		this.handelEmail = this.handelEmail.bind(this);
		this.handelPassword = this.handelPassword.bind(this);
		this.handelLogin = this.handelLogin.bind(this);
	}

	/**
	 * Method to handle email input
	 * @param {*} event 
	 */
	handelEmail(event) {
		this.setState({
			flashMessageError: '',
			email: event.target.value.trim(),
			isError: false
		});
	};

	/**
	 * Method to handle password input
	 */
	handelPassword(event) {
		this.setState({
			flashMessageError: '',
			error: '',
			password: event.target.value.trim(),
			isError: false
		});
	};

	/**
	 * Method to handle login operation.
	 * @param {*} event 
	 */
	handelLogin(event) {
		event.preventDefault();
		this.setState({isSubmitted:true});
		if (this.state.email.length > 0 && this.state.password.length > 0) {
			
				var data = {
					email: this.state.email,
					password: SHA256(this.state.password).toString()
				}
				this.props.login(data);
				this.setState({
					isLoading: true
				});
			
		}
		else {
			this.setState({
				error: messages.FIELD_MENDATORY,
				isError: true,
				isLoading: false
			});
		}
	}

	/**
	 * Lifecycle method
	 */
	componentWillMount() {
		let self = this
		try {
			if (localStorage.getItem('isLogin')) {
				self.props.history.push('/dashboard');
			}
			if (window.location.href.includes('forgot_password')) {
				if (window.location.href.split("=")[1] !== undefined && window.location.href.split("=")[1] !== '') self.setState({ resetPasswordModal: true });
			}
			if (window.location.href.includes('activate_account')) {
				if (window.location.href.split("=")[1] !== undefined && window.location.href.split("=")[1] !== '') {
					self.setState({ callAPI: true })
					self.props.activateAccountAction({ "id": window.location.href.split("=")[1] })
				}
			}
			if (window.location.href.includes('user_activate_account')) {
				if (window.location.href.split("=")[1] !== undefined && window.location.href.split("=")[1] !== '') {
					self.setState({ activePasswordModal:true });
				}
			}
		} catch (e) { }
	}

	/**
	 * Lifecycle method to handle api's response
	 */
	componentWillReceiveProps(nextProps) {
		try {
			if (nextProps.loginstate.data !== undefined) {
				if (nextProps.loginstate.data.success) {
					localStorage.setItem('JWT_TOKEN', nextProps.loginstate.data.data.jwt_token_for_user);
					localStorage.setItem('USER_EMAIL', nextProps.loginstate.data.data.user_email);
					localStorage.setItem('isLogin', nextProps.loginstate.data.success);
					var role = JWT.decode(nextProps.loginstate.data.data.jwt_token_for_user).role
					console.log("role========", role);
					this.setState({"isSubmitted":false});
					if (role ==="other") {
						localStorage.setItem('isEmplLogin', true);
						return this.props.history.push('/user/Dashboard');
					}
					if (role ==="admin") 
					localStorage.setItem('nextstep', false);

					this.props.history.push('/dashboard');
				} else {
					this.setState({
						isError: !nextProps.loginstate.data.success,
						error: nextProps.loginstate.data.message
					});
				}
			}
			if (nextProps.forgotPasswordData !== undefined && nextProps.forgotPasswordData.data !== undefined) {
				if (nextProps.forgotPasswordData.success === true) {
					this.setState({ flashMessageSuccess: messages.ForgotPasswordLinkSucces });
					setTimeout(() => { this.setState({ forgotPasswordModal: false, flashMessageSuccess: '' }) }, 3000);
				} else {
					this.setState({ flashMessageError: nextProps.forgotPasswordData.message });
					setTimeout(() => { this.setState({ flashMessageError: '' }) }, 3000);
				}
			}
			if (nextProps.resetPasswordData !== undefined && nextProps.resetPasswordData.data === true) {
				this.setState({ flashMessageSuccess: messages.ResetPasswordSucces });
				setTimeout(() => {
					this.setState({ resetPasswordModal: false, flashMessageSuccess: '' });
					this.props.history.push('/');
				}, 3000);
			}
			if (nextProps.activateAccountData !== undefined && this.state.callAPI) {
				if (nextProps.activateAccountData.success === true) {
					this.setState({ successAlert: messages.AccountActivateSuccess, callAPI: false })
					setTimeout(() => {
						this.props.history.push('/');
						this.setState({ successAlert: '' })
					}, 3000);
				} else {
					this.setState({ isError: true, error: nextProps.activateAccountData.message, callAPI: false })
					setTimeout(() => {
						this.setState({ isError: false, error: '' })
					}, 3000);
				}
			}
			if (nextProps.activateAccountData !== undefined && this.state.passwordActivation) {
				if (nextProps.activateAccountData.success === true) {
					this.setState({ successAlert: messages.AccountActivateSuccess, passwordActivation: false })
					setTimeout(() => {
						this.props.history.push('/');
						this.setState({ successAlert: '' })
					}, 3000)
				} else {
					this.setState({ isError: true, error: nextProps.activateAccountData.message, passwordActivation: false })
					setTimeout(() => {
						this.setState({ isError: false, error: '' })
					}, 3000)
				}
			}
			
		} catch (e) {

		}
	}

	/**
	 * Method to open forgot password modal
	 */
	openForgotModal = () => {
		let self = this
		self.setState({
			isError: false,
			forgotPasswordModal: true,
			forgot_email: ''
		})
	}

	/**
	 * Method to close forgot password modal
	 */
	closeForgotPasswordModal() {
		let self = this
		self.setState({
			forgotPasswordModal: false,
		})
	}

	/** 
	 * Method to handle forgot password operation
	*/
	onSubmitForgotPassword(e) {
		e.preventDefault()
		let self = this
		if (self.state.forgot_email === '') return self.setState({ flashMessageError: "Email address can't be blank" })
		self.props.forgotPasswordAction({ "email": self.state.forgot_email, "front_end_url": window.location.origin + "/forgot_password" })
	}

	/**
	 * Method to set input values as per input name
	 */
	setValue = (e) => {
		this.setState({
			isError:false,
			flashMessageError: '',
			flashMessageSuccess: '',
			"userSubmited":false,
			[e.target.name]: e.target.value.trim()
		})
	}

	/**
	 * Function to handle reset password operation
	 */
	onSubmitResetPassword = (e) => {
		e.preventDefault()
		let self = this
		let { confirm_password, reset_password } = self.state
		if (confirm_password === '' && reset_password === '')  {
			self.setState({ flashMessageError: "Fields can't be blank" })
			return 0
		}
		if (confirm_password !== reset_password) { 
			self.setState({ flashMessageError: "Confirm password and password should match" }) 
			return 0
		}
		if(!verifyCorrectPassword(confirm_password)) {
			this.setState({IspasswordOk:false,isError:true })
			return 0
		} else {
			this.setState({IspasswordOk:true,isError:false })

		}
		
		// Call API
		let id = window.location.href.split("=")[1]
		self.props.resetPasswordAction({ id, "password": SHA256(reset_password).toString() })
		self.setState({
			resetPasswordModal: false,
		});
		self.props.history.push("/");
	}


	onSubmitActivePassword = (e) => {
		e.preventDefault()
		let self = this
		let { confirm_password, reset_password } = self.state
		if (confirm_password === '' && reset_password === '')  {
			self.setState({ flashMessageError: "Fields can't be blank","userSubmited":true })
			return 0
		}
		if (confirm_password !== reset_password) { 
			self.setState({ flashMessageError: "Confirm password and password should match","userSubmited":true }) 
			return 0
		}
		if(!verifyCorrectPassword(confirm_password)) {
			this.setState({IspasswordOk:false,isError:true })
			return 0
		} else {
			this.setState({IspasswordOk:true,isError:false })

		}
		
		// Call API
		let id = window.location.href.split("=")[1]
		self.props.activateEmpAccountAction({ id, "password": SHA256(reset_password).toString() })
		self.setState({
			activePasswordModal: false,
			passwordActivation:true
		});
		self.props.history.push("/");
	}

	/**
	 * Method to call reset password modal
	 */
	closeResetPasswordModal = () => {
		let self = this
		self.setState({
			resetPasswordModal: false,
		})
		self.props.history.push("/")
	}

	closeActivatePasswordModal = () => {
		let self = this
		self.setState({
			activePasswordModal: false,
		})
		self.props.history.push("/")
	}

	render() {
	
		return (
			<div className="cover_bg">
				<Navbar />
				<div className="col s12 no-padding">
					<div className="col s12 l4 offset-l4 m6 radius-5px offset-m3 card mrgt50px padding-20px login_section">
						<div className="primary-color-text login_section_heading font-wight-100">Create Balance</div>

						{
							this.state.isError && this.state.error !== undefined && Object.entries(this.state.error).length > 0
								?
								MessagePop.errorMessage(this.state.error)
								: null
						}
						
						{
							this.state.successAlert !== '' ? MessagePop.succussMessage(this.state.successAlert) : void 0
						}
						<div id="loginf" className="col s12 no-padding">
							<form className="form-style-9" action="#" onSubmit={this.handelLogin}>
								<InputField 
									label="Enter Initial Balance" type="number" 
									value={this.state.email} 
									handler={this.handelEmail} 
									className={`validate field-style ${this.state.email.length === 0  && this.state.isSubmitted ?' mandatory_field' :'' }` }
									maxLength = {100}
									/>
								<input className="ui button primary-color white-text col s12 h50px " type="submit" value="Login" />
							</form>
						</div>
					</div>
				</div>

			</div>
		);
	}
}

Login.propTypes = {
	login: PropTypes.func.isRequired,

}

const mapStateToProps = state => ({
	loginstate: state.login,
	forgotPasswordData: state.userpanel.forgotPasswordData,
	resetPasswordData: state.userpanel.resetPasswordData,
	activateAccountData: state.userpanel.activateAccountData
});

export default connect(mapStateToProps, { login, forgotPasswordAction, resetPasswordAction, activateAccountAction,activateEmpAccountAction })(Login);

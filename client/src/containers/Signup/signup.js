import React from 'react';
import SHA256 from "crypto-js/sha256";
import { connect } from 'react-redux';
import { signup } from '../../Actions/signupAction';
import PropTypes from 'prop-types';
import { get_country_list } from '../../Actions/userAction';
import Navbar from '../../containers/navbar';
import { Link } from 'react-router-dom';
import MultipleError from '../Common/multiplrError';
import { messages } from '../../common/message';
import * as MessagePop from '../Common/messagePop';

/**
 * Class to perform signup functionality. It include the inpult handler to handle the input values, validation methods to validate the user inputs
 */
class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            passwordConfirm: "",
            organization_name: "",
            user_designation: "",
            organization_url: "",
            country: "",
            countryCode: "",
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            isError: false,
            isLoading: false,
            error: [],
            countryList: [],
            flashMessageSuccess: '',
            IspasswordOk: true,
            isSignup:false,
            isSubmitted:false,
            
        };
        this.inputHandeler = this.inputHandeler.bind(this);
    }


    /**
     * Method for allwo only alpha and space  in user name 
     * @param {password}
     * @return  { boolean}
     */
    validateUserName = (name) => {
        if (typeof name === "string") {
            let userNamrRegx = /^[a-zA-Z]*$/
            if (name.match(userNamrRegx)) {
                return true
            }
            return false
        } else {
            throw new Error("type error")
        }
    }

    /**
     * Method for validating password 
     * @param { password }
     * @returns { boolean }
     * 
     */
    verifyCorrectPassword = (password) => {
        if (typeof password === 'string') {
            //Contains atleast digit 
            let regxD = /([0-9])+/g;
            let regxW = /([a-z])+/g;
            let regxWC = /([A-Z])+/g;
            let specialChar = '~!@#$%^&*()_+'.split('')
            let isSpecial = false
            let cond1 = !password.match(regxD)
            let cond2 = !password.match(regxW)
            let cond3 = !password.match(regxWC)
            specialChar.map(car => {
                console.log("test", password.includes(car), car)
                if (password.includes(car)) {
                    isSpecial = true
                }
            })
            if (password.length < 6 || !isSpecial || cond1 || cond2 || cond3) {
                this.setState({ IspasswordOk: false, isError: true })
                return false
            } else {
                this.setState({ IspasswordOk: true })
                return true
            }
        } else {
            throw new Error('Type error ')
        }
    }

    /**
     * Method to handle user input.It sets the state based on the input target name
     */
    inputHandeler = event => {
        this.setState({ isError: false, IspasswordOk: true })
        let {name, value} = event.target
        if (name === "first_name" || name === "last_name") {
            if (!this.validateUserName(value) ) {
                this.setState({ error: messages.userNameError, isError: true })
                return 0
            } else {
                this.setState({ error: [], isError: false })
            }
        }
        this.setState({
            [name]: name === 'user_designation' || name === 'organization_name' ? value : value.trim(),
            isError: false
        });
    }

    /***
     * Method for test email format 
     * @parma {email}
     * @retirn {boolean}
     */
    isValidEmail = (email) => {
        if (typeof email === "string") {
            let emailRegx = /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/g;
            if (email.match(emailRegx)) {
                return true
            } else {
                return false
            }
        } else {
            throw new Error("type error")
        }
    }

    /**
     * Method to handle signup operation. It will call signup api and register user in application 
     */
    signupFormHandler = event => {
        event.preventDefault();
        var state = this.state
        this.setState({isSubmitted:true})
        if (state.first_name === "" || state.last_name === "" || state.password === '' || state.passwordConfirm === '' || state.email == '' ) {
            this.setState({
                isError: true,
                error: messages.FIELD_MENDATORY
            });
            return 0
        } else {
            if (!this.isValidEmail(state.email)) {
                this.setState({ isError: true, error: messages.invalidEmail });
                return 0
            } else {
                this.setState({ isError: false, error: "" });

            }
            if (state.passwordConfirm === state.password) {
                if (!this.verifyCorrectPassword(this.state.password)) return 0
                let data = {
                    "password": state.password,
                    "organization_name": state.organization_name,
                    "user_designation": state.user_designation,
                    "organization_url": state.organization_url,
                    "country": state.country,
                    "first_name": state.first_name,
                    "last_name": state.last_name,
                    "email": state.email,
                    "phone_number": state.phone_number,
                    "front_end_url": window.location.origin + "/activate_account",
                };
                data.password = SHA256(data.password).toString();
                delete data.passwordConfirm;

                let tmp = data;
                let param_name = Object.keys(tmp);
                param_name.forEach(p => {
                    if (tmp[p] === "") {
                        delete tmp[p];
                    }
                });
                data = tmp;
                this.setState({isSignup:true});
                this.props.signup(data);
            } else {
                this.setState({ isError: true, error: messages.passwordMissmatch });
            }
        }
    }

    /**
     * Method to handle api's response
     * @param {*} new_Prop 
     */
    componentWillReceiveProps(new_Prop) {
        if (new_Prop !== undefined && this.state.isSignup) {

            if (new_Prop.success) {
                this.setState({
                    "password": "",
                    "passwordConfirm":"",
                    "organization_name": "",
                    "user_designation": "",
                    "organization_url": "",
                    "country": "",
                    "first_name": "",
                    "last_name": "",
                    "email": "",
                    "phone_number": "",
                    "front_end_url": "",
                    "isSubmitted":false,
                    flashMessageSuccess: messages.signupSuccess
                })
                setTimeout(() => {
                    this.props.history.push('/login');
                }, 3000)
            }
            else if (new_Prop.message) {
                this.setState({
                    isError: true,
                    error: new_Prop.message
                });
                // let k = Object.keys(new_Prop.message);
                // k.map(f=>{
                //     this.setState({[f]:""});
                // })
            }

        }
        if (new_Prop !== undefined ) {
            if (new_Prop !== undefined && new_Prop.getCountryList != undefined) {
                this.setState
                    ({
                        countryList: new_Prop.getCountryList.data.data
                    });
            }
        }
    }

    /**
     * Lifecycle method 
     */
    componentWillMount() {
        this.props.get_country_list();
    }

    render() {
        console.log("state==========", this.state)
        let { countryList } = this.state
        var dialCode = ''
        countryList ? countryList.map((country) => {
            if (country.country_id == this.state.country)
                dialCode = country.country_dial_code
        }) : ''
        return (
            <div className="row mrbt cover_bg">
                <Navbar />
                <div className="row mrbt">
                    <div className="col l6 offset-l3 s12 m8 offset-m2">
                        <div className="all_details">
                            <h2>signup</h2>
                        </div>
                        
                        <div className="card pad_20 pdt30px">
                            <div className="row form-style-9">
                               
                                <div className="col s6">
                                <label htmlFor="first_name">First Name <span>*</span></label>
                                    <input 
                                        id="first_name" 
                                        name="first_name"
                                        type="text" 
                                        className={`validate field-style ${this.state.first_name.length === 0  && this.state.isSubmitted  ?' mandatory_field' :'' }` } 
                                        value={this.state.first_name} 
                                        onChange={this.inputHandeler} 
                                        maxLength={30}
                                    />
                                   
                                </div>
                                <div className="col s6">
                                <label htmlFor="last_name">Last Name <span>*</span></label>
                                    <input 
                                        id="last_name" 
                                        name="last_name" 
                                        type="text" 
                                        className={`validate field-style ${this.state.last_name.length === 0  && this.state.isSubmitted ?' mandatory_field' :'' }` }
                                        value={this.state.last_name} 
                                        onChange={this.inputHandeler}
                                        maxLength = {30}
                                     />
                                    
                                </div>
                                <div className="col s12">
                                <label htmlFor="email">Email <span>*</span></label>
                                    <input 
                                        id="email" 
                                        name="email"
                                        type="text" 
                                        className={`validate field-style ${this.state.email.length === 0  && this.state.isSubmitted ?' mandatory_field' :'' }` }
                                        value={this.state.email}
                                        onChange={this.inputHandeler} 
                                        maxLength = {100}
                                        />
                                    
                                </div>
                                <div className="col s6">
                                <label htmlFor="password">Password <span>*</span></label>
                                    <input 
                                        id="password" 
                                        name="password" 
                                        type="password" 
                                        className={`validate field-style ${this.state.password.length === 0  && this.state.isSubmitted ?' mandatory_field' :'' }` }
                                        value={this.state.password} 
                                        onChange={this.inputHandeler}  
                                        maxLength={50}
                                        />
                                </div>
                                <div className="col s6">
                                <label htmlFor="passwordConfirm">Confirm Password <span>*</span></label>
                                    <input 
                                        id="passwordConfirm"
                                        name="passwordConfirm"
                                        type="password" 
                                        className={`validate field-style ${this.state.passwordConfirm.length === 0  && this.state.isSubmitted ?' mandatory_field' :'' }` }
                                        value={this.state.passwordConfirm} 
                                        onChange={this.inputHandeler} 
                                        maxLength ={50}
                                        />
                                   
                                </div>
                                <div className="col s12">
                                <label className="password-info">
                                        Password tips  <i class="fa fa-info-circle" aria-hidden="true"></i>
                                        <div className="password-info-modal">
                                            {messages.passwordTips.map(t=>(<span>{t}</span>))}
                                        </div>
                                </label>
                                </div>
                               
                                {/* <div className="col s12 l6">
                                <label htmlFor="organization_name">Oraganization Name</label>
                                    <input 
                                        id="organization_name" 
                                        name="organization_name" 
                                        type="text" 
                                        className="validate field-style" 
                                        value={this.state.organization_name} 
                                        onChange={this.inputHandeler} 
                                        maxLength = {50}
                                        />
                                   
                                </div>
                                <div className="col s12 l6">
                                <label htmlFor="organization_url">Oraganization Website</label>
                                    <input 
                                        id="organization_url" 
                                        name="organization_url" 
                                        type="text" 
                                        className="validate field-style" 
                                        value={this.state.organization_url} 
                                        onChange={this.inputHandeler} 
                                        maxLength = {50}
                                    />
                                   
                                </div>
                                <div className="col s12">
                                <label htmlFor="organization_url">Select option</label>
                                    <select className="display-block field-style" name="country" onChange={this.inputHandeler}>
                                        <option selected disabled>Country</option>
                                        {
                                            this.state.countryList ? this.state.countryList.map((country) => {
                                                return <option value={country.country_id} onChange={this.inputHandeler}> {country.country_name}</option>
                                            }) : ''
                                        }
                                    </select>
                                </div>
                                <div className="col s3">
                                <label htmlFor="countryCode">Dial Code</label>
                                    <input id="countryCode" name="countryCode" type="number" value={dialCode} className="validate field-style" />
                                   
                                </div>
                                <div className="col s9">
                                <label htmlFor="phone_number">Mobile No</label>
                                    <input id="phone_number" name="phone_number" type="number" value={this.state.phone_number.length > 10 ? this.state.phone_number.slice(0, 10) : this.state.phone_number} maxlength="10" className="validate field-style" onChange={this.inputHandeler} />
                                    
                                </div>
                                <div className="col s12">
                                <label htmlFor="user_designation">Designation</label>
                                    <input 
                                        id="user_designation" 
                                        name="user_designation" 
                                        type="text" 
                                        className="validate field-style" 
                                        onChange={this.inputHandeler} 
                                        maxLength={50}
                                    />
                                   
                                </div> */}
                                {
                                    this.state.isError && this.state.IspasswordOk === false ? <MultipleError errors={messages.passwordTips} /> : null
                                }

<div className="col s12 error_mt">
                                {
                            this.state.isError && typeof this.state.error === "string" && this.state.error !== "" ?
                                MessagePop.errorMessage(this.state.error)
                                :
                                ''
                        }
                        {
                            this.state.isError && typeof this.state.error === "object" ?
                                <MultipleError errors={this.state.error} />
                                :
                                ''
                        }
                        
                        {this.state.flashMessageSuccess ?
                           MessagePop.succussMessage(this.state.flashMessageSuccess)
                            : <span></span>
                        }
                                </div>

                         
                                
                                <div className="col s12 padding-10px fsz1rem red-text"><i>* Fields are mandatory</i>
                                </div>
                                <div className="col s12">
                                <p>
                                <label>
                                    <input type="checkbox" class="filled-in" />
                                    <span className="grey-text">I consent to receiving promotional and marketing emails from simplyblock and its affiliates and agree to their <a href="" target="_blank">Privacy Policy</a> .</span>
                                </label>
                                </p>
                                </div>
                               
                                <a class="all_btn_custome" onClick={this.signupFormHandler}>REGISTER</a>
                                
                                
                               <br className="show-on-small hide-on-med-and-up" />
                                <Link className="mrgb20px center-align Already" to="/login">Already have a account? Login</Link>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Signup.propTypes = {
    signup: PropTypes.func.isRequired,
    getCountryList: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    success: state.signup.data.success,
    message: state.signup.data.message,
    isLoading: state.signup.data.isLoading,
    getCountryList: state.userpanel.getCountryList
})

export default connect(mapStateToProps, { signup, get_country_list })(Signup);
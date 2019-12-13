import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { initializeAccount,requestLoan,getPeers,getMe,getInfo } from '../../src/Actions/cordaAction';
import PropTypes from 'prop-types';
import ImageContainer from "../../src/components/imageContainer";
import InitializeModal from 'react-responsive-modal';
import RequestLoanModal from 'react-responsive-modal';
import InfoModal from 'react-responsive-modal';
import { messages } from '../common/message'
import * as MessagePop from './Common/messagePop'
import {partyName} from '../common/constants';

class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            InitializeModal: false,
            requestLoanModal:false,
            infoModal:false,
            panNo:'',
            accountNo:'',
            partyName:'PARTY-NAME',
            "creditScore":'',
            "balance":'',
            loanParty:"",
            loanAmt:'',
            isError: false,
            showDropDown: false,
            isSubmited:false,
            peersDropdown:[],
            isRegistered:false,
            flashMessageSuccess:'',
            flashMessageError:'',
            apiCalled:false,

        };

       
        this.showDropDown = this.showDropDown.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        

    }

    componentDidMount(){
        this.props.getPeers();
       
    }

   

  
    componentWillReceiveProps(nextProps) {
        console.log('nextProps-------++++++++', nextProps)

        if(nextProps.getPeersData!==undefined){
            this.setState({peersDropdown:nextProps.getPeersData.peers});
           
        }

        if(nextProps.initializeData!==undefined){
            let {statusInfo}  = nextProps.initializeData;
            console.log('statusInfo',statusInfo);
            if(statusInfo==='CREATED'){
                this.setState({flashMessageSuccess:'Account Created Succesfully'});
                localStorage.setItem('isLogin',true);
                    this.setState({
                        isRegistered:true,
                        InitializeModal: false,
                        isSubmited:false,
                       flashMessageSuccess:''
                    });
            }else{
                localStorage.setItem('isLogin',false);
                this.setState({isRegistered:false,flashMessageError:'Error in Account initialization'});
            }
        }

        if(nextProps.requestLoanData!==undefined){
            let {statusInfo}  = nextProps.requestLoanData;
            console.log('statusInfo',statusInfo);
            if(statusInfo==='CREATED'){
                this.setState({flashMessageSuccess:'Loan Requested Successfully'});
                setTimeout(()=>{
                    this.setState({
                        isRegistered:true,
                        requestLoanModal: false,
                        isSubmited:false,
                        flashMessageSuccess:''
                    });
                },3000);
            }else{
                this.setState({isSubmited:false,flashMessageError:'Error in Loan Requesting !!'});
            }
        }

        if(nextProps.infoData!==undefined){
            if(nextProps.infoData.state!==undefined){
                localStorage.setItem('isLogin',true);
                let {organisation,creditScore,balance} = nextProps.infoData.state.data;
                this.setState({
                    "partyName":organisation,
                    "creditScore":creditScore,
                    "balance":balance,
                    'isRegistered':true
                });
            }
        }else{
                localStorage.setItem('isLogin',false);
                this.setState({'isRegistered':false});
        }

        if(nextProps.meData!==undefined && !this.state.apiCalled){ 
            let {me} = nextProps.meData;
            this.props.getInfo({peer:me});
            this.setState({'partyName':me,apiCalled:true});
        }

       
       

    }

    /**
     * Method for show drop down
     * @param {event}
     */



    showDropDown(event) {

        event.preventDefault();
        this.setState({ showDropDown: true }, () => {
            document.addEventListener('click', this.closeMenu);
        });





    }

    closeMenu(event) {

        if (!this.dropdown.contains(event.target)) {
            document.removeEventListener('click', this.closeMenu);
            this.setState({ showDropDown: false });
        }
    }
    closeInitializeModal() {
        this.setState({
            InitializeModal: false,
            currentPassword: '',
            newPassword: '',
            rePassword: '',
            flashMessageError: '',
            flashMessageSuccess: ''
        })
    }
    closeRequestLoanModal() {
        this.setState({
            requestLoanModal: false,
            flashMessageError: '',
            flashMessageSuccess: ''
        })
    }

    closeInfoModal(){
        this.setState({
            infoModal: false,
            flashMessageError: '',
            flashMessageSuccess: ''
        })
    }

    openChangePassword() {this.setState({InitializeModal: true});}
    openRequestLoanModal() {this.setState({requestLoanModal: true});}
    openInfoModal(){this.setState({infoModal:true});}



    /***Function to Handle inputs*/
    inputHandeler = event => {
        console.log(event.target.value)
        this.setState({ isError: false,isSubmited:false })
        this.setState({ [event.target.name]: event.target.value.trim(), flashMessageError: '', })

    }

    changePassword() {
        console.log('change password', this.state)
        var state = this.state
        if (state.panNo == "" || state.accountNo == "") {
            this.setState({
                flashMessageError: messages.FIELD_MENDATORY,
                isSubmited:true,
            })
        } else {
           
                var json = {
                    "panNo": state.panNo,
                    "acctNo": state.accountNo
                };
                this.props.initializeAccount(json);

            

        }


    }

    /**
     * Method for handle Enter button in Input filed 
     * @param {event} 
     * @return {undefined}
     */
    submited(e) {
        try {
            if (e.which === 13) {
                this.changePassword()
            }
        } catch (e) { console.log("#error in submited", e) }

    }

    requestLoan(e){
        console.log('change password', this.state)
        var state = this.state
        if (state.loanParty == "" || state.loanAmt == "") {
            this.setState({
                flashMessageError: messages.FIELD_MENDATORY,
                isSubmited:true,
            })
        } else {
                var json = {
                    "lender": state.loanParty,
                    "amount": state.loanAmt
                };
                this.props.requestLoan(json);
        } 
    }

    





    render() {
        console.log('IM STATE ',this.state);
        return (
         
                <div className="navbar-fixed">
                <nav>
                <div className="nav-wrapper blue">
                    <Link to={"/user/Dashboard"} className="brand-logo">
                        <span className="white-text">{this.state.partyName.includes("=")?this.state.partyName.split(',')[0].split('=')[1]:"PartyName"}</span>
                    </Link>
                    <ul className="right">
                        {this.state.isRegistered && (<li className="white-text"><span className="cursor-pointer mrgr20px " onClick={this.openRequestLoanModal.bind(this)}>Request Loan</span></li>)}
                        {this.state.isRegistered && (<li className="white-text"><span className="cursor-pointer mrgr20px " onClick={this.openInfoModal.bind(this)}>Account</span></li>)}
                        {!this.state.isRegistered &&(<li className="white-text"><span className="cursor-pointer mrgr20px " onClick={this.openChangePassword.bind(this)}>Register</span></li>)}
                    
                     
                                    
                    </ul>
                    <div className="modal-box" id="">
                            <InitializeModal open={this.state.InitializeModal} onClose={this.closeInitializeModal.bind(this)} className="modal-dialog-box" center classNames={{ overlay: 'LoginFormoverlay', modal: 'LoginFormModel modal_container addEmployee' }} closeOnOverlayClick={false}>
                            <div className="confirm-popup AddUserModelform modal_container Employee_container">
                                        <div className="modal-header modal-header giftcart_title_header"><h3 className="modal-title simpleblock">Initialize Account</h3></div>
                                        <div className="modal-body Employee_select">
                                            {this.state.flashMessageSuccess !== undefined && this.state.flashMessageSuccess !== '' ? MessagePop.succussMessage(this.state.flashMessageSuccess) : ""}
                                            {this.state.flashMessageError !== undefined && this.state.flashMessageError !== '' ? MessagePop.errorMessage(this.state.flashMessageError) : ""}
                                            <div className="row form-style-9" >
                                                <div className="col s12">
                                                    <label htmlFor="rePassword">Account No</label>
                                                    <input
                                                        id="currentPassword"
                                                        type="text" name="accountNo"
									                    className={`validate field-style field-split align-left ${this.state.isSubmited ?' mandatory_field' :'' }` }
                                                        value={this.state.accountNo}
                                                        onChange={this.inputHandeler}
                                                        onKeyPress={(e) => { this.submited(e) }}
                                                        maxLength={50}
                                                    />

                                                </div>
                                                <div className="col s12">
                                                    <label htmlFor="rePassword">Pan No</label>
                                                    <input
                                                        id="newPassword"
                                                        type="text"
                                                        name="panNo"
									                    className={`validate field-style field-split align-left ${this.state.isSubmited ?' mandatory_field' :'' }` }                                                        
                                                        value={this.state.panNo}
                                                        onChange={this.inputHandeler}
                                                        onKeyPress={(e) => { this.submited(e) }}
                                                        maxLength={50}

                                                    />
                                                </div>


                                               
                                               

                                               
                                                <div className="col s12">
                                                    <input className="waves-effect all_btn_custome mar20" type="button" value="Submit" onClick={this.changePassword.bind(this)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </InitializeModal>

                            <RequestLoanModal open={this.state.requestLoanModal} onClose={this.closeRequestLoanModal.bind(this)} className="modal-dialog-box" center classNames={{ overlay: 'LoginFormoverlay', modal: 'LoginFormModel modal_container addEmployee' }} closeOnOverlayClick={false}>
                                    <div className="confirm-popup AddUserModelform modal_container Employee_container">
                                        <div className="modal-header modal-header giftcart_title_header"><h3 className="modal-title simpleblock"> Request Loan</h3></div>
                                        <div className="modal-body Employee_select">
                                            {this.state.flashMessageSuccess !== undefined && this.state.flashMessageSuccess !== '' ? MessagePop.succussMessage(this.state.flashMessageSuccess) : ""}
                                            {this.state.flashMessageError !== undefined && this.state.flashMessageError !== '' ? MessagePop.errorMessage(this.state.flashMessageError) : ""}
                                            <div className="row form-style-9" >
                                                <div className="col s12">
                                                    <label htmlFor="rePassword">Choose Party</label>
                                                    <select value={this.state.loanParty} name='loanParty' onChange={this.inputHandeler} style={{display:'block'}}>
                                                        <option defaultValue>Choose Party</option>
                                                        {this.state.peersDropdown.length ?
                                                        this.state.peersDropdown.filter(
                                                            (v,k)=> v.split(',')[0].split('=')[1]!=='Oracle'
                                                            ).map((v,k)=>(<option key={k}>{v}</option>)):''}
                                                    </select>

                                                </div>
                                                <div className="col s12">
                                                    <label htmlFor="rePassword">Enter Amount</label>
                                                    <input
                                                        id="loanAmt"
                                                        type="text"
                                                        name="loanAmt"
									                    className={`validate field-style field-split align-left ${this.state.isSubmited ?' mandatory_field' :'' }` }                                                        
                                                        value={this.state.loanAmt}
                                                        onChange={this.inputHandeler}
                                                        maxLength={50}

                                                    />
                                                </div>


                                               
                                               

                                               
                                                <div className="col s12">
                                                    <input className="waves-effect all_btn_custome mar20" type="button" value="Request" onClick={this.requestLoan.bind(this)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </RequestLoanModal>
                            


                                <InfoModal open={this.state.infoModal} onClose={this.closeInfoModal.bind(this)} className="modal-dialog-box" center classNames={{ overlay: 'LoginFormoverlay', modal: 'LoginFormModel modal_container addEmployee' }} closeOnOverlayClick={false}>
                                    <div className="confirm-popup AddUserModelform modal_container Employee_container">
                                        <div className="modal-header modal-header giftcart_title_header"><h3 className="modal-title simpleblock">Account Info</h3></div>
                                        <div className="modal-body Employee_select">
                                            {this.state.flashMessageSuccess !== undefined && this.state.flashMessageSuccess !== '' ? MessagePop.succussMessage(this.state.flashMessageSuccess) : ""}
                                            {this.state.flashMessageError !== undefined && this.state.flashMessageError !== '' ? MessagePop.errorMessage(this.state.flashMessageError) : ""}
                                            <div className="row" >
                                            <div className="col s12">
                                                    <div className="grey-text">Party Name</div>
                                                    <div className="fsz1-5rem">{this.state.partyName.includes("=")?this.state.partyName.split(',')[0].split('=')[1]:""}</div>

                                                </div>
                                                <div className="col s12">
                                                    <div className="grey-text">Party Locality</div>
                                                    <div className="fsz1-5rem">{this.state.partyName.includes("=")?this.state.partyName.split(',')[1].split('=')[1]:""}</div>

                                                </div>
                                                <div className="col s12">
                                                    <div className="grey-text">Party Country</div>
                                                    <div className="fsz1-5rem">{this.state.partyName.includes("=")?this.state.partyName.split(',')[2].split('=')[1]:""}</div>

                                                </div>
                                                <div className="col s12 mrgt20px">
                                                    <div className="grey-text">Balance</div>
                                                   <div className="fsz1-5rem">{this.state.balance}</div>
                                                </div>

                                                <div className="col s12 mrgt20px">
                                                    <div className="grey-text">Credit Score</div>
                                                   <div className="fsz1-5rem">{this.state.creditScore}</div>
                                                </div>

                                               
                                               

                                               
                                               
                                            </div>
                                        </div>
                                    </div>
                                </InfoModal>
                            
                            
                            </div>
                </div>
                </nav>
            </div>
                
                
                
               
                        

                 
                    


        );
    }
}

Navbar.propTypes = {
   initializeAccount:PropTypes.func.isRequired,
   requestLoan:PropTypes.func.isRequired,
   getPeers:PropTypes.func.isRequired,
   getMe:PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        infoData:state.corda._getInfoData,
        initializeData:state.corda.initializeData,
        getPeersData:state.corda._getPeersData,
        requestLoanData:state.corda.requestLoanData,
        meData:state.corda._getMeData
    }
}


export default connect(mapStateToProps, {initializeAccount,requestLoan,getPeers,getMe,getInfo})(Navbar);
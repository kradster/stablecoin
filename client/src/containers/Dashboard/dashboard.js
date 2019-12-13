import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {getInfo,getLoanData,getMe,getPendingCount,getApprovedCount,getRejectedCount,getSettledCount} from '../../Actions/cordaAction';
import * as constants from '../../common/constants';
import PropTypes from 'prop-types';
import Navbar from '../../containers/navbar';
import Highcharts from 'highcharts';
import * as MessagePop from '../Common/messagePop';
import { messages } from '../../../src/common/message';

var jwt = require('jsonwebtoken');

import "react-datepicker/dist/react-datepicker.css";
import * as HelperUtil from "../../common/__helper";
import SHA256 from "crypto-js/sha256";


class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loanData: [],
      flashMessageSuccess: '',
      flashMessageError: '',
      testFlashMessageError: '',
      callAPI: false,
      sideBarToggle: false,
      statsCount: {
        authtoken_count: 0,
        employees_count: 0,
        request_count: 0
      },
      newUser: false,
      openTestNetModal: false,
      openCompleteModal: false,
      chartData: [],
      fliterStartDate: 'From',
      fliterEndDate: 'To',
      startDataObj: '',
      endDateObj: '',
      password: '',
      conf_password: '',
      chartDuration: 86400,
      chartAPIError: '',
      pendingCountData:'',
      approvedCountData:'',
      rejectedCountData:'',
      settledCountData:'',
      apiCalled:false,
      countApiCalled:false,
      isRegistered:false
      

    };
   
  }

  componentDidMount(){
    this.props.getMe();
    this.setState({isRegistered:localStorage.getItem('isLogin')});
  }

  
  componentWillReceiveProps(newProps){
    if(newProps.infoData!==undefined){
      localStorage.setItem('isLogin',true);
      this.setState({
        isRegistered:true,
    });
    }else{
      localStorage.setItem('isLogin',false);
      this.setState({
        isRegistered:false,
    })};
    

    if(newProps.loanData!==undefined && newProps.loanData.length){
      this.setState({loanData:newProps.loanData});
    }

    if(newProps.pendingCountData!==undefined){
      this.setState({pendingCountData:newProps.pendingCountData});
    }
    if(newProps.approvedCountData!==undefined){
      this.setState({approvedCountData:newProps.approvedCountData});
    }
    if(newProps.rejectedCountData!==undefined){
      this.setState({rejectedCountData:newProps.rejectedCountData});
    }
    if(newProps.settledCountData!==undefined){
      this.setState({settledCountData:newProps.settledCountData});
    }

    if(newProps.meData!==undefined && !this.state.apiCalled){ 
      this.setState({apiCalled:true});
      let {me} = newProps.meData;
      this.props.getInfo({peer:me});
      this.props.getLoanData();
      this.props.getPendingCount();
      this.props.getApprovedCount();
      this.props.getRejectedCount();
      this.props.getSettledCount();

    }

    if(newProps.requestLoanData!==undefined && !this.state.countApiCalled){
      let {statusInfo}  = newProps.requestLoanData;
      this.setState({countApiCalled:true});
      if(statusInfo==='CREATED'){
        this.props.getPendingCount();
      }else{
        this.setState({countApiCalled:true});
      }
    }

    if(newProps.initializeData!==undefined){
      let {statusInfo}  = newProps.initializeData;
      if(statusInfo==='CREATED'){
          this.setState({flashMessageSuccess:'Account Created Succesfully'});
          localStorage.setItem('isLogin',true);
              this.setState({
                  isRegistered:true,
              });
      }
    }else{
      localStorage.setItem('isLogin',false);
              this.setState({
                  isRegistered:true,
              });
    }


    
  }

  /**
   * Lifecycle method to handle api's response
   * @param {*} nprops 
   */
 

  

  toggleNavbar = () => {
    let self = this
    self.setState({ sideBarToggle: !self.state.sideBarToggle })
  }




 

  /****
   *Method for formatting date  
   * @param {date}
   */
 


  inputHandeler = event => {
    this.setState({
      chartAPIError: '',
      testFlashMessageError: '',
      [event.target.name]: event.target.value.trim(),
    });
  }

  createLoanDataTable(loanData){
    let myStyle = { overflowWrap: "break-word", wordBreak: "break-all", maxWidth: "200px" };
    const ele = loanData ? loanData.map(loan =>
      (
        <tr key={loan.length}>
          <td className="position-relative" style={myStyle}>{loan.state.data.borrower.split(',')[0].split('=')[1]}</td>
          <td className="position-relative" style={myStyle}>{loan.state.data.lender.split(',')[0].split('=')[1]}</td>
          <td className="position-relative" style={myStyle}>{loan.state.data.amount}</td>
          <td className="position-relative" style={myStyle}>{loan.state.data.creditScore}</td>
          <td className="position-relative" style={myStyle}>{loan.state.data.timestamp!==undefined?loan.state.data.timestamp:new Date().toUTCString()}</td>
          <td className="position-relative" style={myStyle}>{loan.state.data.status}</td>
          <td className="position-relative" style={myStyle}>{loan.state.data.linearId.id}</td>
          <td className="position-relative" style={myStyle}>{loan.ref.txhash}</td>
        </tr>
      )
    ) :
      <tr>
        <td className="position-relative" style={{ overflowWrap: "break-word", wordBreak: "break-all", maxWidth: "200px" }}>No record found</td>
      </tr>
      ;

      return ele

  }


  

  render() {
    let {pendingCountData,approvedCountData,rejectedCountData,settledCountData} = this.state
    const ele = this.createLoanDataTable(this.state.loanData);
   
    return (

      <div className="main">
        <Navbar/>
        <div className={"main-container"}>
         
          <div className="container mrgt20px">
            <div className="col s12">
              {this.state.flashMessageSuccess !== '' ? MessagePop.succussMessage(this.state.flashMessageSuccess) : ""}
              {this.state.flashMessageError !== '' ? MessagePop.errorMessage(this.state.flashMessageError) : ""}
              {!this.state.isRegistered&&(
                <div className="grey lighten-5 padding-20px border-1px mrgt50px">
                  <h3 className="center-align black-text">You have register your account first</h3>
                </div>
              )}
              
              {
                this.props.data != undefined && this.props.data.data !== undefined && this.props.data.data.email_verified === false ? (
                  <div className="col s12 orange padding-10px radius-5px mt30 mtorange_40 ">
                    <div className="left fsz1-4rem white-text"> Seems, your email is not verified </div>
                    <button className="ui button orange white-text right" onClick={() => this.sendEmailForVerification()}>VERIFY NOW</button>
                  </div>
                ) : ''
              }
              <div className="col s12 no-padding card-stats ">
                <div className="row">
                  {
                    this.state.isRegistered&&(<div className="col l3 m4 s12 ">
                    <Link to="/pending">
                    <div className="ViewAddressToken card newcard cyan">
                      <div className="row padding-10px">
                       
                        <div className="col s5 m8  white-text ">
                          <div className="padding-right-10px fsz4rem">{pendingCountData !== '' ? pendingCountData : 0}</div>
                          <p className="card-heading padding-right-10px">Pending Loan</p>
                        </div>
                        <div className="col s7 m4  white-text">
                          <p className="card-stats-title  padding-left-10px"><i className="material-icons">people</i> </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="card-action cyan darken-1"> <a href="#" className="card-stats-compare white-text "> </a> </div>
                      </div>
                    </div>
                    </Link>
                  </div>)
                  }
                  
                  {
                    this.state.isRegistered&&(
                  <div className="col l3 m4 s12 ">
                  <Link to="/approved">
                    <div className="ViewAddressToken card newcard orange">
                      <div className="row padding-10px">
                      <div className="col s5 m8 white-text ">
                          <div className="padding-right-10px fsz4rem">{approvedCountData !== '' ? approvedCountData : 0}</div>
                          <p className="card-heading padding-right-10px">Approved Loan</p>
                        </div>
                        <div className="col s7 m4  white-text">
                          <p className="card-stats-title  padding-left-10px"><i className="material-icons">location_searching</i> </p>
                        </div>
                        
                      </div>
                      <div className="row">
                        <div className="card-action orange darken-1"> <a href="#" className="card-stats-compare white-text "> </a> </div>
                      </div>
                    </div>
                  </Link>
                  </div>
                    )}
                  
                  {
                    this.state.isRegistered&&(
                  <div className="col l3 m4 s12 ">
                  <Link to="/sattled">
                    <div className="ViewAddressToken card newcard green">
                      <div className="row padding-10px">
                       
                        <div className="col s5 m8  white-text ">
                          <div className="padding-right-10px fsz4rem">{settledCountData !== '' ? settledCountData : 0}</div>
                          <p className="card-heading padding-right-10px">Settled Loan</p>
                        </div>
                        <div className="col s7 m4  white-text">
                          <p className="card-stats-title  padding-left-10px"><i className="material-icons">touch_app</i> </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="card-action green darken-1"> <a href="#" className="card-stats-compare white-text "> </a> </div>
                      </div>
                    </div>
                  </Link>
                  </div>)}

                  {
                    this.state.isRegistered&&(
                
                  <div className="col l3 m4 s12 ">
                  <Link to="/rejected">
                    <div className="ViewAddressToken card newcard indigo">
                      <div className="row padding-10px">
                      <div className="col s5 m8  white-text ">
                          <div className="padding-right-10px fsz4rem">{rejectedCountData !== '' ? rejectedCountData : 0}</div>
                          <p className="card-heading padding-right-10px">Rejected Loan</p>
                        </div>
                        <div className="col s7 m4  white-text">
                          <p className="card-stats-title  padding-left-10px"><i className="material-icons">touch_app</i> </p>
                        </div>
                       
                      </div>
                      <div className="row">
                        <div className="card-action indigo darken-1"> <a href="#" className="card-stats-compare white-text "> </a> </div>
                      </div>
                    </div>
                  </Link>
                  </div>
                          )}
                
                </div>
              </div>
            </div>

            

            {
                    this.state.isRegistered&&(
            <div className="col s12">
              <div className="card">
                <div className="card-content pb-1">
                  <h4 className="card-title marign-none mar0">BlockChain History</h4>
                </div>
                <table className="add_employee_list responsive-table  highlight">
                  <thead>
                    <tr>
                      <th>Borrower</th>
                      <th>Lender</th>
                      <th>Amount</th>
                      <th>Credit Score</th>
                      <th>Timestamp</th>
                      <th>Status</th>
                      <th>Linear Id</th>
                      <th>TxHash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ele}
                  </tbody>

                </table>
              </div>
            </div>)}

          </div>
        </div>
        
      </div>
    )
  }
}

DashBoard.propTypes = {
 
}

const mapStateToProps = state => {
  return {
    initializeData:state.corda.initializeData,
    infoData:state.corda._getInfoData,
    loanData:state.corda._getLoanData,
    pendingCountData:state.corda._getPendingCountData,
    approvedCountData:state.corda._getApprovedCountData,
    rejectedCountData:state.corda._getRejectedCountData,
    settledCountData:state.corda._getSettledCountData,
    meData:state.corda._getMeData,
    requestLoanData:state.corda.requestLoanData,
  }
}


export default connect(mapStateToProps, {getInfo,getLoanData,getMe,getPendingCount,getApprovedCount,getRejectedCount,getSettledCount})(DashBoard) 
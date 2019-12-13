import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {getApprovedLoanData,settleLoan} from '../../Actions/cordaAction';
import Navbar from '../navbar';
import 'react-confirm-alert/src/react-confirm-alert.css';
import * as MessagePop from '../Common/messagePop'


class Approved extends Component {
    constructor(prop) {
        super(prop);
        this.DEBUG = true;

        this.state = {
            "emplist": [],
            partyName:'',
            flashMessageSuccess: '',
            flashMessageError: '',
            dpages: [],
            activePage: 0,
            alertMessageSuccess: '',
            alertMessageError: '',
            search: '',
            asc: true,
            showPagination: true,
            apiCalled:false,
            loanTransferApiCalled:false
        };
        
        this.searchHandler = this.searchHandler.bind(this);
       
    };

    componentDidMount() {
        this.props.getApprovedLoanData();
    }

    
    componentWillReceiveProps(nextProps){
        if(nextProps.approvedLoanData!==undefined && nextProps.approvedLoanData.length>0){
         this.setState({emplist:nextProps.approvedLoanData});   
        }

        
        if(nextProps.settleLoanData!==undefined  && !this.state.loanTransferApiCalled){
            console.log('statusInfoaaaaaaaaaaaaaaaapppppppp',nextProps.settleLoanData);
            let {statusInfo}  = nextProps.settleLoanData;
            if(statusInfo==='CREATED'){
                this.setState({flashMessageSuccess: 'Loan Transferd Successfully',loanTransferApiCalled:true});
                setTimeout(()=>{
                    this.setState({flashMessageSuccess: ''});
                },3000);
                this.props.getApprovedLoanData();
            }else{
                this.setState({flashMessageError: 'Error in Loan Transfering',});
                setTimeout(()=>{
                    this.setState({flashMessageError: '',});
                },3000);
            }
        }

        if(nextProps.meData!==undefined){ 
            this.setState({
                'partyName':nextProps.meData.me,
            });
            
            
          }

        
       
    }



    

   

    






    searchHandler(e) {
        let f = e.target.value;
        if (f.length > 0) {
            this.setState({ showPagination: false });
        } else {
            this.setState({ showPagination: true });
        }
        let fd = this.props.data.data;
        let fl = fd.filter(item => {
            return Object.keys(item).some(key =>
                typeof item[key] === "string" ? item[key].toLowerCase().includes(f.toLowerCase()) : false
            );
        });
        this.setState({ emplist: fl });
    }

   

    approveLoan(lender,loanid){
       
        this.props.settleLoan({"lender":lender,"loanId":loanid});
        this.setState({loanTransferApiCalled:false});
    }

    createCard(){
        const el = this.state.emplist;
        return el.length ? el.map(e =>
            (
                <div className="col s12 l3 m6">
                    <div className="ViewAddressToken card equal_height radius-5px ">
                    <div className="col s12 mrgt30px ">
                        <span className="fsz08rem  left">borower</span>
                        <div className="blue-text  right">{e.state.data.borrower}</div>
                    </div>
                    <div className="col s12 mrgt20px ">
                        <span className=" fsz08rem   left">lander</span>
                        <div className="blue-text  right">{e.state.data.lender}</div>
                    </div>
                    <div className="col s12 mrgt20px ">
                        <span className="fsz08rem  left">Amount</span>
                        <div className="blue-text  right">{e.state.data.amount}</div>
                    </div>
                    <div className="col s12 mrgt20px ">
                        <span className=" fsz08rem   left">Credit Score</span>
                        <div className="blue-text  right">{e.state.data.creditScore}</div>
                    </div>
                    <div className="col s12 mrgt20px "> 
                        <span className=" fsz08rem   left">status</span>
                        <div className="blue-text  right">{e.state.data.status}</div>
                    </div>
                    <div className="col s12 mrgt20px ">
                        <span className=" fsz08rem left">Linearid</span>
                        <div className="blue-text  right">{e.state.data.linearId.id}</div>
                    </div>
                        <div className="col s12 mrgt20px mrgb20px nopadd">

                        {
                                
                                e.state.data.borrower.split(',')[0].split('=')[1]===this.state.partyName.split(',')[0].split('=')[1] ?
                                    (
                                        <div className="">
                                            <button onClick={() => this.approveLoan(e.state.data.lender,e.state.data.linearId.id)} className="ui button red white-text right mini radius-50px "> <i className="fas fa-trash-alt    "></i>Approve</button>

                                        </div>

                                    ) : (<></> )
                            }
                        </div>
                </div>
                    </div>
            )
        ) : <div className="white mrg10px"><p className="mrgl10px">No record found</p></div>
        
    }

    


    render() {
        
        let cond  =  false;

        return (
            <div className="main ">
                <Navbar  />
                <div className={"main-container"}>
                    
                    <div className="container employee-detials">
                        <div className="h100  mrgt40px">
                            
                            <h4 className="col s12 fsz1-5rem grey-text all_mar0">All Approved Loans</h4>
                            
                            <div className="col s12">
                                {this.state.alertMessageSuccess !== '' ? MessagePop.succussMessage(this.state.alertMessageSuccess) : ""}
                                {this.state.alertMessageError !== '' ? MessagePop.errorMessage(this.state.alertMessageError) : ""}
                                <div className="col s12 no-padding">
                                    {this.createCard()}
                                </div>
                                
                            </div>
                        </div>



                </div>
            </div>
            </div>
        )
    }
}





const mapPropToState = state => {
    return {
        approvedLoanData:state.corda._getApprovedLoanData,
        settleLoanData:state.corda.settleLoanData,
        meData:state.corda._getMeData
    }
}

export default connect(mapPropToState, {getApprovedLoanData,settleLoan})(Approved);


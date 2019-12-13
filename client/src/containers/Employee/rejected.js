import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {getRejectedLoanData} from '../../Actions/cordaAction';
import Navbar from '../navbar';
import 'react-confirm-alert/src/react-confirm-alert.css';
import * as MessagePop from '../Common/messagePop'


class Rejected extends Component {
    constructor(prop) {
        super(prop);
        this.DEBUG = true;

        this.state = {
            "emplist": [],
            "first_name": "",
            "last_name": "",
            "employee_category": "viewer",
            "other_role": "",
            "email": "",
            flashMessageSuccess: '',
            flashMessageError: '',
            dpages: [],
            activePage: 0,
            alertMessageSuccess: '',
            alertMessageError: '',
            search: '',
            asc: true,
            showPagination: true,
            apiCalled:false
        };
        this.paginate = this.paginate.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
        this.sorting = this.sorting.bind(this);
    };

    componentDidMount() {
        this.props.getRejectedLoanData();
    }

   

    componentWillReceiveProps(nextProps){
        if(nextProps.rejectedLoanData!==undefined && nextProps.rejectedLoanData.length>0){
         this.setState({emplist:nextProps.rejectedLoanData});   
        }

        
       
    }



    

   

    paginate = (num, id) => {
        this.setState({ activePage: id });
       
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

    sorting(param) {
        console.log('sorting');
        let sa = this.state.emplist.sort((a, b) => {
            const isReversed = this.state.asc ? 1 : -1;
            return isReversed * a[param].localeCompare(b[param]);
        });
        this.setState({ emplist: sa, asc: !this.state.asc });
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
                            
                            <h4 className="col s12 fsz1-5rem grey-text all_mar0">All Rejected Loans</h4>
                           
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
        rejectedLoanData:state.corda._getRejectLoanData
    }
}

export default connect(mapPropToState, {getRejectedLoanData})(Rejected);


import React, { Component } from 'react';
import { connect } from 'react-redux';
import {abi} from '../Common/abi';
import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
var bigNumber = require('bignumber.js');
var Tx = require('ethereumjs-tx');

export class AbiMethods extends Component {

        constructor(props){
        super(props);
        this.state = {
            methodNames:[],
            selectedMethodName:undefined,
            methodfieldObject:undefined,
            param:[],
            paramLength:0,
            res:''
        };

        this.web3 = web3;
        this.transection = this.transection.bind(this);
        this.setParam = this.setParam.bind(this);
        this.param = [];
        this.address = '0x02009a21Df9b9647aA6f02f72830318fADF1D281';
        this.abi = require('./abi.json');
        this.contract = new this.web3.eth.Contract(this.abi,this.address);
        this.initAccount();
        
    }
    initAccount = async()=>{
        this.accounts = await this.web3.eth.getAccounts();
    }

    componentDidMount(){
        let name = abi.map((e)=>{return e.name;});
        this.setState({methodNames:name});
        
    }  

    renderMethodName(){
       
        return this.state.methodNames.length?this.state.methodNames.map(o=>(
        <option value={o} >{o}</option>
        )):'';
    }

   showMethodInput(e){
        let obj = abi.filter((o)=>{ return o.name===e.target.value})[0];
        this.setState({'paramLength':obj.inputs.length});
        this.setState({selectedMethodName:e.target.value,methodfieldObject:obj});
    }

    transection = async () => {
        // this.param = [];
        if(this.param.length>this.state.paramLength){
            this.param.pop();
        }
        let a = this.state.paramLength>1
        ?   Object.keys(this.param).map(e=>{return this.param[e];})
        :   this.state.paramLength<1
        ?   null
        :   this.param[0];
        
        console.log(this.param);
        
        
        
        
       
       
       
        try {
            // ***************************************** Contract Call
            let n = this.state.selectedMethodName;
            let decimals = null;
            if(this.state.paramLength>1){
                
               
                decimals = await this.contract.methods[n](...a).send({from: this.accounts[0]})
                ;
            }
            if(this.state.paramLength===1){
                
               
                decimals = await this.contract.methods[n](a).send({from: this.accounts[0]});
              

            }
            if(this.state.paramLength===0){
                
                
                decimals = await this.contract.methods[n]().send({from: this.accounts[0]});
               


            }
            // ***************************************** Contract Call
            
            this.setState({res:decimals,param:[]});
           
        }
        catch (err) {
            this.setState({res:err});
            return 0
        }
    }

    setParam = (e)=>{
        this.param[e.target.name] = e.target.value;
        this.setState({'param':this.param});
    }

    renderInputFields(){
        let {constant,inputs,name,outputs,payable,stateMutability,type} = this.state.methodfieldObject;
        return (
            <div style={{marginLeft:"50px"}}>
            <label>Name of function : {name}</label>
            {inputs.map((i,index)=>( <div style={{margin:"10px"}}><input onChange={(e)=>this.setParam(e)} name={index} placeholder={i.name+" "+i.type}/></div>))}
            <button onClick={()=>this.transection()} >make transection</button>
            </div>
        )
    }

    render() {
        
        return (
            <div>
                <h1>Your Methods</h1>
                <div style={{display:"flex"}}>
                    <div>
                        <select onChange={(e)=>this.showMethodInput(e)}>
                            <option disabled>Choose Method</option>
                            {this.renderMethodName()}
                        </select>
                    </div>
                    <div>
                        {!!this.state.methodfieldObject&&this.renderInputFields()}
                        <div style={{margin:"20px"}}>
                        {this.state.res.toString()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default AbiMethods
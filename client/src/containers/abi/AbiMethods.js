import React, { Component } from 'react';
import { connect } from 'react-redux';
import {abi} from '../Common/abi';
import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");

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
    initAccount = ()=>{
        if (window.ethereum) {
            try{
                window.ethereum.enable().then((a)=>{
                    this.account = a[0];
                  console.log('LATEST ',a);
                });
            }catch(e) {
                // User has denied account access to DApp... 
                console.log('ERROR ',e);
            }
        }     
        else if (window.web3){ 
                 console.log('NO METAMASK FOUND')

        } 
    }

    componentDidMount(){
        let name = abi.map((e)=>{return e.name;});
        console.log(name);
        
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
        try {
            let n = this.state.selectedMethodName;
            let decimals = null;
            let parameter = this.state.param.slice(0,this.state.paramLength);
            var result = web3.eth.sign(web3.utils.sha3(parameter.toString()),this.account).then(d=>{
                console.log('results2',d);
                this.setState({res:d});
                web3.eth.sendTransaction({
                    from: this.account,
                    data: d // deploying a contracrt
                },(error,hash)=>{
                    console.log('After send transection',hash);
                    this.setState({res:hash});
                    if (error){
                        console.log('error send transection',e);
                        this.setState({res:e});
                    }
                })
                
            }) 

            // decimals = await this.contract.methods[n](...parameter).call();
            // this.setState({res:decimals});
        }
        catch (err) {
            this.setState({res:err});
            return 0
        }
    }

    setParam = (e)=>{
        this.param[e.target.name] = e.target.value;
        // let arr = this.param.slice(0,this.state.paramLength);
        this.setState({'param':this.param});
        // console.log('PARAMS',arr);
    }

    renderInputFields(){
        let {constant,inputs,name,outputs,payable,stateMutability,type} = this.state.methodfieldObject;
        let inputFields = inputs.map((i,index)=>(<input className="myinput" onChange={(e)=>this.setParam(e)} name={index} placeholder={i.name+" "+i.type}/>))
        return (
            <div style={{marginLeft:"50px"}}>
            <label>Name of function : {name}</label>
            <div className="inputFieldBox">{inputFields}
            <button onClick={()=>this.transection()} >make transection</button>
            </div>
            </div>
        )
    }

    render() {
        
        return (
            <div className="mygrid">
                <div className="grid-item">
                    <div className="selectBox">
                    <label>Choose Function</label>
                    <select onChange={(e)=>this.showMethodInput(e)}>
                            <option selected disabled>Choose Method</option>
                            {this.renderMethodName()}
                        </select>
                    </div>
                    </div>
                    <div className="grid-item">
                    <div className="inputBox">
                    {!!this.state.methodfieldObject&&this.renderInputFields()}
                    </div>
                    <div className="output">
                        
                        <div>
                        {this.state.res.toString()}
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}
export default AbiMethods
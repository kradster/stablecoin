import React, { Component } from 'react';
import { connect } from 'react-redux';
import {abi} from '../Common/abi'

export class AbiMethods extends Component {

    constructor(props){
        super(props);
        this.state = {
            methodNames:[],
            selectedMethodName:undefined,
            methodfieldObject:undefined
        };

    }

    componentDidMount(){
        let name = abi.map((e)=>{return e.name;});
        this.setState({methodNames:name});
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            console.log('No web3? You should consider trying MetaMask!');
            web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        }
    }  

    renderMethodName(){
        return this.state.methodNames.length?this.state.methodNames.map(o=>(
        <option value={o} >{o}</option>
        )):'';
    }

    showMethodInput(e){
       
        let obj = abi.filter((o)=>{ return o.name===e.target.value})[0];
        this.setState({selectedMethodName:e.target.value,methodfieldObject:obj});
    }

    renderInputFields(){
        let {constant,inputs,name,outputs,payable,stateMutability,type} = this.state.methodfieldObject;

        return (
            <div>
            <span>constant : {constant?'True':'False'}</span>
            <label>Name of function : {name}</label>
            {inputs.map((i)=>( <div><input placeholder={i.name+" "+i.type}/></div>))}
            {outputs.map((o)=>(<div>{o.name+" "+o.type}</div>))}
            <span>constant : {constant}</span><br/>
            <span>payable : {payable}</span><br/>
            <span>stateMutability : {stateMutability}</span><br/>
            <span>type : {type}</span><br/>

            </div>
        )
    }

    render() {
        
        return (
            <div>
                <h1>Your Methods</h1>
                <select onChange={(e)=>this.showMethodInput(e)}>
                    <option>Choose Method</option>
                    {this.renderMethodName()}
                </select>
                <div>
                    {!!this.state.methodfieldObject&&this.renderInputFields()}

                </div>
            </div>
        )
    }
}

// const mapStateToProps = (state) => ({
    
// })

// const mapDispatchToProps = {
    
// }

// export default connect(mapStateToProps, mapDispatchToProps)(AbiMethods)
export default AbiMethods
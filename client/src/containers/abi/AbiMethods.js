import React, { Component } from 'react';
import { connect } from 'react-redux';
import {abi} from '../Common/abi';
import {desc} from '../Common/desc';
import Web3 from 'web3';
import Notification from '../Common/Notification';
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
            success:false,
            isError:false,
            res:'',
            txType:0,
            errorMsg:'',
            showConfig:false,
            config_nonce:"",
            config_gasPrice:""
        };

        this.web3 = web3;
        this.setParameter = this.setParameter.bind(this);
        this.setParam = this.setParam.bind(this);
        this.getRawTransection = this.getRawTransection.bind(this);
        this.getSignTransection = this.getSignTransection.bind(this);
        this.signAndBroadCast = this.signAndBroadCast.bind(this);
        this.doOperation = this.doOperation.bind(this);
        this.param = [];
        this.address = '0x02009a21Df9b9647aA6f02f72830318fADF1D281';
        this.abi = require('./abi.json');
        this.contract = new this.web3.eth.Contract(this.abi,this.address);
        this.initAccount();
        this.renderConfigInput = this.renderConfigInput.bind(this)
        
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
       this.element = [];
        let obj = abi.filter((o)=>{ return o.name===e.target.value})[0];
        this.constant = obj.constant;
        this.setState({'paramLength':obj.inputs.length});
        this.setState({selectedMethodName:e.target.value,methodfieldObject:obj});

        setTimeout(()=>{
            for (let index = 0; index < obj.inputs.length; index++) {
                this.element.push(document.querySelector(`input[name='${index}']`));
            }
            console.log("this . element ===>",this.element)
        },100)


    }

    getRawTransection = async ()=>{
        this.setParameter();
        try{
            let contractData = await this.contract.methods[this.state.selectedMethodName](...this.parameter).encodeABI()
            console.log('contractData',contractData);
            var gas = 500000;
               
             this.nonce  = "no";
             this.gasPrice = "no";

             if(this.state.config_nonce!==""){
                this.nonce = this.state.config_nonce;
             }else{
                await web3.eth.getTransactionCount(this.account).then(nonce=>{
                    this.nonce = nonce;
                 }).catch(e=>{
                    let o = typeof e==='object'?JSON.stringify(e):e;
                    this.setState({errorMsg:o,isError:true,outputClass:'error'});
                 });
             }

             if(this.state.config_gasPrice!==""){
                this.nonce = this.state.config_gasPrice;
             }else{
                await web3.eth.getGasPrice().then(gasPrice=>{
                    this.gasPrice = gasPrice;
                 }).catch(e=>{
                    let o = typeof e==='object'?JSON.stringify(e):e;
                    this.setState({errorMsg:o,isError:true,outputClass:'error'});
                 });
             }

            

             await web3.eth.getGasPrice().then(gasPrice=>{
                this.gasPrice = gasPrice;
                // this.setState({res:gasPrice,success:true,outputClass:'success'});
                console.log('GAS_PRICE',this.gasPrice);
             })
            
            let rawTx = {
                gasLimit:gas,
                data: contractData,
                from: this.account,
                to: this.address,
                nonce :this.nonce,
                gasPrice : this.gasPrice
            };

            this.setState({res:JSON.stringify(rawTx),success:true,outputClass:'success'});
        }catch(e){
            let o = typeof e==='object'?JSON.stringify(e):e;
            this.setState({errorMsg:o,isError:true,outputClass:'error'});
        };
    }

    getSignTransection = async ()=>{
        this.setParameter();
        try{
            await web3.eth.sign(this.tr,this.account).then(d=>{
                console.log('results2',d);
                let o = d;
                this.setState({res:o,success:true,outputClass:'success'});
            }) 
        }catch(e){
            let o = typeof e==='object'?JSON.stringify(e):e;
            this.setState({errorMsg:o,isError:true,outputClass:'error'});
        }
    }

    signAndBroadCast = async ()=>{
        this.setParameter();
        try{
        let d  = ""; 
        if( this.constant){d  = await this.contract.methods[this.state.selectedMethodName](...this.parameter).call();}
        else{d  = await this.contract.methods[this.state.selectedMethodName](...this.parameter).send({from:this.account});}
        let o = d;
        this.setState({res:o,success:true,outputClass:'success'});
    }catch(e){
        let o = typeof e==='object'?JSON.stringify(e):e;
        this.setState({errorMsg:o,isError:true,outputClass:'error'});
    }
    }

    setParameter = () => {
        this.parameter = this.state.paramLength>0?this.state.param.slice(0,this.state.paramLength):'';
        this.tr = web3.utils.sha3(this.parameter.toString());
            // decimals = await this.contract.methods[n](...parameter).call();
            // this.setState({res:decimals});
       
    }

    setParam = (e)=>{
        event.target.classList.remove('error-input');
        this.param[e.target.name] = e.target.value;
        // let arr = this.param.slice(0,this.state.paramLength);
        this.setState({'param':this.param,errorMsg:'',});

        // console.log('PARAMS',arr);
    }

    renderRadioBox(){
        return (
            <div className="txRadioBox">
            <label>
            <input type="radio" name="txType" onChange={()=>this.setState({txType:1})}/> 
            raw transaction
            </label>
            <label>
            <input type="radio" name="txType" onChange={()=>this.setState({txType:2})}/>
            sign transaction
            </label>
            <label>
            <input type="radio" name="txType" onChange={()=>this.setState({txType:3})}/>
            broadcast transaction
            </label>
            </div>
        )
    }

    doOperation = ()=>{
        this.setState({res:'Performing '+this.state.selectedMethodName+"".toUpperCase()});
        if(!this.constant){

            if(this.element.length>0){
                this.element.forEach(input=>{
                    console.log("input=====>",typeof input.value , input.value)
                    if(input.value===""){
                        input.classList.add('error-input')
                        this.isValid = false;
                        this.setState({errorMsg:'Enter required parameters !!',isError:true,outputClass:'error'});
                    }else{
                        this.isValid = true;
                        input.classList.remove('error-input')
                    }
                })
            }else{
                this.isValid = true; 
            }
            
            if(!this.state.txType>0){
            this.setState({errorMsg:'Choose Transection type',isError:true,outputClass:'error'});
            }
            if(!this.isValid){
            this.setState({errorMsg:'Enter required parameters !!',isError:true,outputClass:'error'});
            }
            if(this.state.txType>0 && this.isValid){
                switch(this.state.txType){
                    case 1: this.getRawTransection(); break;
                    case 2: this.getSignTransection(); break;
                    case 3: this.signAndBroadCast(); break;
                    default : this.setState({'error':'Choose Transection type'})
                }
            }


        

            



        }else{
            this.signAndBroadCast();
        }


    }

    closeNotification = ()=>{
        this.setState({errorMsg:'',});
    }

    renderInputFields(){
        let {inputs,name} = this.state.methodfieldObject;
        let description = desc.filter((d,k)=>{return Object.keys(d)[0].toLowerCase()=== name.toLowerCase()});
        let key  = Object.keys(description[0]);
        let value = description[0][key]
        console.log('description',description);
        let inputFileds = inputs.map((i,index)=>(
            <div>
                 <label className="myinput-label">Enter {i.name.replace("_","")}</label>
                <input className="myinput" onChange={(e)=>this.setParam(e)} name={index}/>
            </div>))
        return (
            <div>
            <label className="fsz07rem">Name of function</label>
            <div className="functionName">{name.toUpperCase()} <span data-desc={value} className="help"><i class="fa fa-question" aria-hidden="true"></i></span> </div>
            <div className="inputFieldBox ">
            <div className="">
                    <label htmlFor="configInputs">
                    <span className="fsz07rem"> SHOW CONFIG</span>
                    <input id="configInputs" type="checkbox" onChange={()=>this.setState({showConfig:!this.state.showConfig})}/>
                    </label>
                    {this.state.showConfig && <this.renderConfigInput/>}
            </div>
            {inputFileds}
            {!this.constant && this.renderRadioBox()}
            <button onClick={()=>this.doOperation()} >{name}</button>
            </div>
            </div>
        )
    }

    renderConfigInput(){
        return (
            <>
            <div>
                 <label className="myinput-label">Enter nonce</label>
                <input className="myinput" onChange={(e)=>this.setState({config_nonce:e.target.value})} name="config_nonce"/>
            </div><br/>
            <div>
             <label className="myinput-label">Enter gasPrice</label>
            <input className="myinput" onChange={(e)=>this.setState({config_gasPrice:e.target.value})} name="config_gasPrice"/>
            </div>
       </>
        )
    }

    render() {
        console.log(this.state)
        return (
            <div className="mygrid">
                {this.state.isError && <Notification isError={this.state.isError} close={this.closeNotification.bind(this)} msg={this.state.errorMsg} />  }
                <div className="grid-item">
                <div className="selectBox">
                <label>Choose function</label>
                        <select onChange={(e)=>this.showMethodInput(e)}>
                            <option selected disabled>Choose function</option>
                            {this.renderMethodName()}
                        </select>
                </div>
                
                <div className="inputBox">
                        {!!this.state.methodfieldObject && this.renderInputFields()}
                </div>
                </div>
               
                    <div className="grid-item">
                    <div className="mynavbar">
                    <img src="/public/img/dcex.png"/>
                    </div>
                    <div className={`output`}>
                        
                        <code>
                        {
                        typeof this.state.res === 'object'
                        ? Object.keys(this.state.res).map((v,k)=>{
                        <p key={k}>{v}</p>
                        })
                        :this.state.res.toString()
                        }
                        </code>
                    </div>
                   
                </div>
                
            </div>
        )
    }
}
export default AbiMethods
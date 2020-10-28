import React, { Component } from 'react';
import { connect } from 'react-redux';
import { abi } from '../Common/abi';
import { desc } from '../Common/desc';
import Web3 from 'web3';
import Notification from '../Common/Notification';
const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
import BigNumber from 'bignumber.js';

export class AbiMethods extends Component {

    constructor(props) {
        super(props);
        this.state = {
            methodNames: [],
            selectedMethodName: undefined,
            methodfieldObject: undefined,
            param: [],
            paramLength: 0,
            success: false,
            isError: false,
            res: 'RESPONSE',
            txType: 0,
            errorMsg: '',
            showConfig: false,
            config_nonce: "",
            config_gasPrice: "",
            userType: ""
        };

        this.web3 = web3;
        this.setParameter = this.setParameter.bind(this);
        this.setParam = this.setParam.bind(this);
        this.getRawTransection = this.getRawTransection.bind(this);
        this.getSignTransection = this.getSignTransection.bind(this);
        this.signAndBroadCast = this.signAndBroadCast.bind(this);
        this.doOperation = this.doOperation.bind(this);
        this.setUserType = this.setUserType.bind(this);
        this.param = [];
        this.paramwithkey = [];
        // this.address = '~'; /**0 decimals**/
        this.address = "0xe4dc5aabb6d9d590ae0dda59215f2fdf4609d9a9" /**2 decimals **/
        // this.address = "0xbb3b83ceb13ec61c07e0783496922c6455b168e7"
        // this.address = "0xffb1b23293eef8ffdaf26c1964d4a8a7b86eecab"
        this.abi = require('./abi.json');
        this.contract = new this.web3.eth.Contract(this.abi, this.address);
        this.initAccount();
        this.renderConfigInput = this.renderConfigInput.bind(this)

    }
    initAccount = () => {
        if (window.ethereum) {
            try {
                window.ethereum.enable().then((a) => {
                    this.account = a[0];
                    console.log('LATEST ', a);
                });
            } catch (e) {
                // User has denied account access to DApp... 
                console.log('ERROR ', e);
            }
        }
        else if (window.web3) {
            console.log('NO METAMASK FOUND')

        }
    }

    // componentDidMount(){
    //     let name = abi.map((e)=>{return e.name;});
    //     console.log(name);

    //     this.setState({methodNames:name});
    // }  

    renderMethodName() {
        //    let methodNames = abi.filter(m=>{return m.user===this.state.userType}).map(n=>{return n.name});
        return this.state.methodNames.length ? this.state.methodNames.map(o => (
            <option value={o} >{o}</option>
        )) : '';
    }

    showMethodInput(e) {
        this.element = [];
        let obj = abi.filter((o) => { return o.name === e.target.value })[0];
        this.constant = obj.constant;
        this.setState({ 'paramLength': obj.inputs.length });
        this.setState({ selectedMethodName: e.target.value, methodfieldObject: obj, res: 'RESPONSE', });

        setTimeout(() => {
            for (let index = 0; index < obj.inputs.length; index++) {
                this.element.push(document.querySelector(`input[name='${index}']`));
            }
            console.log("this . element ===>", this.element)
        }, 100)


    }

    getRawTransection = async () => {
        this.setParameter();
        try {
            let contractData = await this.contract.methods[this.state.selectedMethodName](...this.parameter).encodeABI()
            console.log('contractData', contractData);
            var gas = 500000;

            this.nonce = "no";
            this.gasPrice = "no";

            if (this.state.config_nonce !== "") {
                this.nonce = this.state.config_nonce;
            } else {
                await web3.eth.getTransactionCount(this.account).then(nonce => {
                    this.nonce = nonce;
                }).catch(e => {
                    let o = typeof e === 'object' ? JSON.stringify(e) : e;
                    this.setState({ errorMsg: o, isError: true, outputClass: 'error' });
                });
            }

            if (this.state.config_gasPrice !== "") {
                this.nonce = this.state.config_gasPrice;
            } else {
                await web3.eth.getGasPrice().then(gasPrice => {
                    this.gasPrice = gasPrice;
                }).catch(e => {
                    let o = typeof e === 'object' ? JSON.stringify(e) : e;
                    this.setState({ errorMsg: o, isError: true, outputClass: 'error' });
                });
            }



            await web3.eth.getGasPrice().then(gasPrice => {
                this.gasPrice = gasPrice;
                // this.setState({res:gasPrice,success:true,outputClass:'success'});
                console.log('GAS_PRICE', this.gasPrice);
            })

            let rawTx = {
                gasLimit: gas,
                data: contractData,
                from: this.account,
                to: this.address,
                nonce: this.nonce,
                gasPrice: this.gasPrice
            };

            this.setState({ res: { type: "object", data: rawTx }, success: true, outputClass: 'success' });
        } catch (e) {
            let o = typeof e === 'object' ? JSON.stringify(e) : e;
            this.setState({ errorMsg: o, isError: true, outputClass: 'error' });
        };
    }

    getSignTransection = async () => {
        this.setParameter();
        try {
            await web3.eth.sign(this.tr, this.account).then(d => {
                console.log('results2', d);
                let o = d;
                this.setState({ res: { type: "string", data: o }, success: true, outputClass: 'success' });
            })
        } catch (e) {
            let o = typeof e === 'object' ? JSON.stringify(e) : e;
            this.setState({ errorMsg: o, isError: true, outputClass: 'error' });
        }
    }

    signAndBroadCast = async () => {
        this.setParameter();
        try {
            console.log("zdsfghDF<SHTIX", this.parameter[1])
            let d = "";
            if (this.constant) { d = await this.contract.methods[this.state.selectedMethodName](...this.parameter).call(); }
            else { d = await this.contract.methods[this.state.selectedMethodName](...this.parameter).send({ from: this.account }); }
            // console.log('signAndBroadCast', typeof d, d, typeof d === "boolean");
            console.log('signAndBroadCast', d);
            if (d === true || d === false) {
                console.log('signAndBroadCast5', d);
                this.setState({ res: { type: typeof d, data: d }, success: true, outputClass: 'success' });
            }
            else if (isNaN(d) || d.startsWith("0x") || d === true || d === false) {
                console.log('signAndBroadCast1', d);
                this.setState({ res: { type: typeof d, data: d }, success: true, outputClass: 'success' });
            } else {
                let o2 = this.state.selectedMethodName !== "decimals" ? new BigNumber(d) / this.decimals : d;
                // if (isNaN(o2)) {
                //     console.log('signAndBroadCast2', d);
                //     this.setState({ res: { type: typeof d, data: d }, success: true, outputClass: 'success' });
                // } else {
                console.log('signAndBroadCast2', o2);
                this.setState({ res: { type: typeof o2, data: o2 }, success: true, outputClass: 'success' });
                // }

            }
            // console.log('signAndBroadCast', typeof Number(o.toString()), o);
            // this.paramwithkey = [];
        } catch (e) {
            console.log('signAndBroadCast_error', e);

            let o = typeof e === 'object' ? JSON.stringify(e) : e;
            this.setState({ errorMsg: o, isError: true, outputClass: 'error' });
        }

    }

    setParameter = () => {
        this.parameter = this.state.paramLength > 0 ? this.param.slice(0, this.state.paramLength) : '';
        this.tr = web3.utils.sha3(this.parameter.toString());
        // decimals = await this.contract.methods[n](...parameter).call();
        // this.setState({res:decimals});

    }

    setParam = (e) => {
        event.target.classList.remove('error-input');
        this.paramwithkey[event.target.name] = { key: e.target.dataset.input, value: event.target.value, changed: false }
        this.param[e.target.name] = e.target.value;
        // let arr = this.param.slice(0,this.state.paramLength);
        this.setState({ 'param': this.param, errorMsg: '', });

        // console.log('PARAMS',arr);
    }

    renderRadioBox() {
        return (
            <div className="txRadioBox">
                <label>
                    <input type="radio" name="txType" onChange={() => this.setState({ txType: 1 })} />
                    raw transaction
            </label>
                <label>
                    <input type="radio" name="txType" onChange={() => this.setState({ txType: 2 })} />
                    sign transaction
            </label>
                <label>
                    <input type="radio" name="txType" onChange={() => this.setState({ txType: 3 })} />
                    broadcast transaction
            </label>
            </div>
        )
    }

    doOperation = async () => {
        try {


            console.log('PARM', 'doOperation');
            let d = await this.contract.methods.decimals().call();
            let decimal10 = new BigNumber('10');
            let newdecimal10 = decimal10.pow(d);
            this.decimals = newdecimal10;

            this.paramwithkey.forEach(pk => {
                // console.log('paramwithkey', pk);
                if ((pk.key === "_amount" || pk.key === "minterAllowedAmount" || pk.key === "_value")) {
                    let bigD = new BigNumber(pk.value);
                    // let decimal10 = new BigNumber('10');
                    console.log('PARM1', bigD.toString())
                    // let newdecimal10 = decimal10.pow(d);
                    this.decimals = newdecimal10;
                    bigD = bigD.multipliedBy(newdecimal10)
                    console.log('PARM', d, bigD.toString());
                    let intD = parseInt(bigD.toString())
                    console.log('PARM11', bigD)
                    pk.value = bigD
                }
                // pk.value = (pk.key === "_amount" || pk.key === "minterAllowedAmount" || pk.key === "_value") && !pk.changed ? (intD) : pk.value;
                // pk.value = parseInt(bigD.toString());
                pk.changed = true;
            })
            this.param = this.paramwithkey.map(p => { return p.value });
            console.log('PARM', this.value);




            this.setState({ res: 'Performing ' + this.state.selectedMethodName + "".toUpperCase() });
            if (!this.constant) {

                if (this.element.length > 0) {
                    this.element.forEach(input => {
                        console.log("input=====>", typeof input.value, input.value)
                        if (input.value === "") {
                            input.classList.add('error-input')
                            this.isValid = false;
                            this.setState({ errorMsg: 'Enter required parameters !!', isError: true, outputClass: 'error' });
                        } else {
                            this.isValid = true;
                            input.classList.remove('error-input')
                        }
                    })
                } else {
                    this.isValid = true;
                }

                if (!this.state.txType > 0) {
                    this.setState({ errorMsg: 'Choose Transection type', isError: true, outputClass: 'error' });
                }
                if (!this.isValid) {
                    this.setState({ errorMsg: 'Enter required parameters !!', isError: true, outputClass: 'error' });
                }
                if (this.state.txType > 0 && this.isValid) {
                    switch (this.state.txType) {
                        case 1: this.getRawTransection(); break;
                        case 2: this.getSignTransection(); break;
                        case 3: this.signAndBroadCast(); break;
                        default: this.setState({ 'error': 'Choose Transection type' })
                    }
                }








            } else {
                this.signAndBroadCast();
            }

        } catch (err) {
            console.log('doOperation_error', err);

        }


    }

    closeNotification = () => {
        this.setState({ errorMsg: '', });
    }

    renderInputFields() {
        let { inputs, name } = this.state.methodfieldObject;
        let description = desc.filter((d, k) => { return Object.keys(d)[0].toLowerCase() === name.toLowerCase() });
        let key = Object.keys(description[0]);
        let value = description[0][key]
        console.log('description', description);
        let inputFileds = inputs.map((i, index) => (
            <div>
                <label className="myinput-label">Enter {i.name.replace("_", "")}</label>
                <input className="myinput" data-input={i.name} onChange={(e) => this.setParam(e)} name={index} />
            </div>))
        return (
            <div>
                <label className="fsz07rem">Name of function</label>
                <div className="functionName">{name.toUpperCase()} <span data-desc={value} className="help"><i class="fa fa-question" aria-hidden="true"></i></span> </div>
                <div className="inputFieldBox ">
                    <div className="">
                        <label htmlFor="configInputs">
                            <span className="fsz07rem"> SHOW CONFIG</span>
                            <input id="configInputs" type="checkbox" onChange={() => this.setState({ showConfig: !this.state.showConfig })} />
                        </label>
                        {this.state.showConfig && <this.renderConfigInput />}
                    </div>
                    {inputFileds}
                    {!this.constant && this.renderRadioBox()}
                    <button onClick={() => this.doOperation()} >{name}</button>
                </div>
            </div>
        )
    }

    renderConfigInput() {
        return (
            <>
                <div>
                    <label className="myinput-label">Enter nonce</label>
                    <input className="myinput" onChange={(e) => this.setState({ config_nonce: e.target.value })} name="config_nonce" />
                </div><br />
                <div>
                    <label className="myinput-label">Enter gasPrice</label>
                    <input className="myinput" onChange={(e) => this.setState({ config_gasPrice: e.target.value })} name="config_gasPrice" />
                </div>
            </>
        )
    }

    setUserType(e) {
        this.element = [];
        this.constant = {};
        let methodNames = abi.filter(m => { return m.user === e.target.value }).map(n => { return n.name });
        this.setState({
            userType: e.target.value,
            methodNames: methodNames,
            paramLength: 0,
            selectedMethodName: undefined,
            methodfieldObject: undefined
        });
    }

    renderNumberType(d) {
        switch (d.type) {
            case "object": return <p>{JSON.stringify(d)}</p>
            case "number": return <p>{d.data}</p>
            case "boolean": return <p>{d.data ? "True" : "False"}</p>
            case "string": return <p>{d.data}</p>
        }
    }

    render() {
        console.log('render--------', this.state)
        return (
            <div className="mygrid">
                {this.state.isError && <Notification isError={this.state.isError} close={this.closeNotification.bind(this)} msg={this.state.errorMsg} />}
                <div className="grid-item">
                    <div className="selectBox">
                        <label>Choose User Type</label>
                        <select onChange={(e) => this.setUserType(e)}>
                            <option selected disabled>Choose User type</option>
                            <option value="User">User</option>
                            <option value="Minter">Minter</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    {
                        this.state.userType !== "" && (
                            <div className="selectBox">
                                <label>Choose function</label>
                                <select onChange={(e) => this.showMethodInput(e)}>
                                    <option selected disabled>Choose function</option>
                                    {this.renderMethodName()}
                                </select>
                            </div>
                        )
                    }

                    <div className="inputBox">
                        {!!this.state.methodfieldObject && this.renderInputFields()}
                    </div>
                </div>

                <div className="grid-item">
                    <div className="mynavbar" style={{ display: "flex", alignItems: "center", padding: "55px 0px 0px" }}>
                        <img style={{width:"200px"}} src="/public/img/buyucoin-full-logo-white.svg" />
                    </div>
                    <div className={`output`}>

                        <code>
                            {this.state.res !== "RESPONSE" && this.renderNumberType(this.state.res)}
                        </code>
                    </div>

                </div>

            </div>
        )
    }
}
export default AbiMethods
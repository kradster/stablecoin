var bigNumber = require('bignumber.js');
var Tx = require('ethereumjs-tx');


function ContractERC20(contractAddress, filePath, web3Instance) {
    var compiled = require(filePath);
    this.address = contractAddress;
    this.abi = JSON.parse(compiled.interface);
    this.web3 = web3Instance
    this.contract = new this.web3.eth.Contract(this.abi, this.address)
}


ContractERC20.prototype.balanceOf = async function (address) {
    try {
        // ***************************************** Contract Call
        let decimals = await this.contract.methods.decimals().call()

        // ***************************************** Contract Call
        let bal = await this.contract.methods.balanceOf(address).call()
        bal = bigNumber(parseInt(this.web3.utils.toBN(bal))).div((10 ** decimals)).toString()
        return bal
    }
    catch (err) {
        console.log(err);
        return 0
    }

}

async function GetERCFee() {

    // Get Fee
    var gasPrice = await web3.eth.getGasPrice()
    var fee = (4000000 * gasPrice)

    return fee
}

var convPriv = (privKey) => {
    return Buffer.from(privKey, 'hex')
}

async function GetETHBalance(address) {

    // Get Balance
    var balance = await web3.eth.getBalance(address)
  
    return balance
  
}

var signTx = (rawTxObject, privKey) => {
    try {
        let tx = new Tx(rawTxObject);
        tx.sign(convPriv(privKey));
        let serializedTx = tx.serialize();
        var signedTx = "0x" + serializedTx.toString('hex');
        return signedTx
    } catch (err) {
        console.log('signTx_error')
        throw err
    }
}

var submitTransaction = function (signedTx) {
    return new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction(signedTx, (err, txHash) => {
            if (err) {
                console.log('submitTransaction_error');
                return reject(err)
            }
            else return resolve(txHash)
        })
    })
}

var getTxInfo = async (acc) => {
    try {
        let nonce = await web3.eth.getTransactionCount(acc)
        let gasPrice = await web3.eth.getGasPrice()
        if (!gasPrice) throw Error('Gas Price issue')
        return { gasPriceHex: web3.utils.toHex(gasPrice), nonceHex: web3.utils.toHex(nonce), gasPrice: gasPrice, nonce: nonce }
    } catch (err) {
        console.log('getTxInfo_error')
        throw err
    }
}


ContractERC20.prototype.transfer = async function (privKey, address, _amount) {

    try {

        let pk = '0x' + privKey
        let sender = await this.web3.eth.accounts.privateKeyToAccount(pk).address;

        // Check for Insufficient Balance
        var balance = await GetETHBalance(sender)
        var fee = await GetERCFee()
        if (balance < fee){
            console.log("Insufficient Balance")
        }

        // Create the contract object

        let decimals = await this.contract.methods.decimals().call()
        let amount = bigNumber(parseInt(_amount * (10 ** decimals)));

        // Generate the Data
        // ***************************************** Contract Call
        let contractData = this.contract.methods.transfer(address, this.web3.utils.toHex(amount)).encodeABI()

        // Create a raw transaction
        let rawTx = {
            gasLimit: this.web3.utils.toHex(4000000),
            data: contractData,
            from: sender,
            to: this.address
        };
        txInfo = await getTxInfo(sender);
        rawTx.nonce = txInfo.nonceHex;
        rawTx.gasPrice = txInfo.gasPriceHex;

        // Signing of transaction
        let signedTx = signTx(rawTx, privKey)

        // Check Transaction By Calling
        try {
            // ***************************************** Contract Call
            await this.contract.methods.transfer(address, this.web3.utils.toHex(amount)).call({from: sender, nonce: txInfo.nonceHex})
        } catch (error) {
            console.log("TransactionNotValid")
        }
        
        // ***************************************** Contract Call
        let txHash = await submitTransaction(signedTx)

        return {txHash, sender, fee}

    } catch (error) {
        console.log("error :", error)
         
    }
}

// Inputs
smart_contract_json = "/home/devesh/Downloads/FixedSupplyToken.json"
node_url = "http://163.172.34.156:8545"
smart_contract_address = "0x11D63F21638De859E1283837845581648D49A05d"

// Web3 Connection
var Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(node_url));

// 1 - Get Balance
async function getBalance(user_address){
    var contractObj = new ContractERC20(smart_contract_address, smart_contract_json, web3)
    let bal = await contractObj.balanceOf(user_address)
    console.log("balance :", bal)
}
user_address = "0x7b70222Ae3050EC5D32C181FDc227672679a650D"
getBalance(user_address)


// 2 - Transfer 
// async function transfer(){
//     privatekey = "16089060b85b88d9d23ad8ac2d0b856713ea8cb86536560750a96856ae96d9b6"
//     toAddress = "0x4A31f866B4ED00C9096A6795262d3FD34eE721f8"
//     amount = "10"
//     var contractObj = new ContractERC20(smart_contract_address, smart_contract_json, web3)
//     var {txHash, sender, fee} = await contractObj.transfer(privatekey, toAddress, amount)
//     console.log("txHash :", txHash)
// }
// transfer()

// Note - Other Functions can be developed like Get balance and Transfer
// Contract Call is highlighted with *****************************************
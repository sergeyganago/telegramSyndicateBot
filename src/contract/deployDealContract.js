const { web3 } = require('../w3');
var Tx = require('ethereumjs-tx');
var abi = require('../../contracts/abi/presale.abi.json');
const { presale } = require('../../contracts/abi/bytecode');
const { getFundAddress, getFundPrivateKey } = require('../database/fund');

async function deployDealContract(username) {
  const fundPrivateKey = await getFundPrivateKey(username);
  const fundAddress = await getFundAddress(username);
  let contract = new web3.eth.Contract(abi);
  let instance = await contract.deploy({data:  presale});
  let gasEstimate = await instance.estimateGas();
  var privateKey = new Buffer(fundPrivateKey, 'hex');
  var txcount = await web3.eth.getTransactionCount(fundAddress);
  var rawTx = {
    nonce: web3.utils.toHex(txcount),
    gasPrice: web3.utils.toHex(1000099000),
    gasLimit: gasEstimate * 4,
    data:  presale
  }
  var tx = new Tx(rawTx);
  tx.sign(privateKey);
  
  var serializedTx = tx.serialize();
  
  receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
  return receipt['contractAddress'];
}

module.exports = deployDealContract;

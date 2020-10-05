const Web3 = require('web3');
const web3 = new Web3();
const assert = require('assert');

const recipients = process.argv[2].split(',');
const values = process.argv[3].split(',');

assert.strictEqual(recipients.length, values.length, 'Length of recipients and values should be equal');

console.log('Transfers:')
for (var i = 0; i < recipients.length; i++) {
  console.log(recipients[i], ':', values[i]);
}

const transactionData = web3.eth.abi.encodeFunctionCall({
    name: 'groupTransfer',
    type: 'function',
    inputs: [{
        type: 'address[]',
        name: 'recipients'
    },{
        type: 'uint256[]',
        name: 'values'
    }]
}, [recipients, values]);

console.log('Group transfer data:', transactionData);

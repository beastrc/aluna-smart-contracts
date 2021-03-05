const HDWalletProvider = require('@truffle/hdwallet-provider')
// ganache wallet - DO NOT USE IN PRODUCTION
const mnemonic = () => {
    return process.env.MNEMONIC || 'day behind kiss talent bonus unfold expire hidden sorry culture collect layer'
}
// address '0: 0x3Ed68019F385A51FA92E6e1009C4Afa2e4Cc3e1F

const ONE_GWEI = 1000000000

module.exports = {
  networks: {
    development: {
      protocol: 'http',
      host: 'localhost',
      port: 8545,
      gas: 5000000,
      gasPrice: 5e9,
      networkId: '*',
    },
    ropsten: {
      provider: function() {
          return new HDWalletProvider(mnemonic(), 'https://ropsten.infura.io/v3/cab9930f8ed349d0b3a3b9bba5a00bd5')
      },
      network_id: 3,
      gas: 8000000,
      gasPrice: 43.81359 * ONE_GWEI
    },
    kovan: {
      provider: function() {
          return new HDWalletProvider(mnemonic(), 'https://kovan.infura.io/v3/26f99ccfafad4957abdf77c323779acc')
      },
      network_id: 42,
      gas: 12400000,
      gasPrice: 1 * ONE_GWEI
    },
    mainnet: {
      provider: function() {
          return new HDWalletProvider(mnemonic(), 'https://mainnet.infura.io/v3/cab9930f8ed349d0b3a3b9bba5a00bd5')
      },
      network_id: 1,
      gas: 8000000,
      gasPrice: 20 * ONE_GWEI
    },
  },
};
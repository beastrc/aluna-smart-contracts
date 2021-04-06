const HDWalletProvider = require("@truffle/hdwallet-provider");

const infura_key = ""
const mnemonic = () => {
  return "";
};

const ONE_GWEI = 1000000000;

module.exports = {
  networks: {
    development: {
      protocol: "http",
      host: "localhost",
      port: 8545,
      gas: 5000000,
      gasPrice: 5e9,
      networkId: "*",
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic(),
          "https://ropsten.infura.io/v3/" + infura_key
        );
      },
      network_id: 3,
      gas: 8000000,
      gasPrice: 43.81359 * ONE_GWEI,
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic(),
          "https://kovan.infura.io/v3/" + infura_key
        );
      },
      network_id: 42,
      gas: 12400000,
      gasPrice: 1 * ONE_GWEI,
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic(),
          "https://mainnet.infura.io/v3/" + infura_key
        );
      },
      network_id: 1,
      gas: 4000000,
      gasPrice: 190 * ONE_GWEI,
      timeoutBlocks: 200,
    },
  },
};

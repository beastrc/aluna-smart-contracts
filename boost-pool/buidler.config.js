usePlugin("@nomiclabs/buidler-truffle5");
usePlugin("@nomiclabs/buidler-web3");
usePlugin("@nomiclabs/buidler-etherscan");
usePlugin("solidity-coverage");


require('./scripts/deployGovernance');
require('./scripts/deployPool');
require('./scripts/deployMockTokens');

require('dotenv').config();

module.exports = {
  defaultNetwork: 'buidlerevm',
  networks: {
    kovan: {
      url: `https://kovan.infura.io/v3/cab9930f8ed349d0b3a3b9bba5a00bd5`,
      accounts: ['0xfb7bacb863436010ff2e5d9a8363e62f0ec353ff55a6e552675b6a7ec2faa5bd'],
      timeout: 20000
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/cab9930f8ed349d0b3a3b9bba5a00bd5`,
      accounts: ['0xfb7bacb863436010ff2e5d9a8363e62f0ec353ff55a6e552675b6a7ec2faa5bd'],
      timeout: 20000
    },
    coverage: {
      url: 'http://localhost:8555'
    }
  },
  solc: {
    version: "0.6.2",
    optimizer: {
      enabled: true,
      runs: 10000
    }
  },
  etherscan: {
    url: "https://api-kovan.etherscan.io/api",
    apiKey: ['R34BTU67C6VP7TWP7GH2514PHRJ3J6G3F1']
  },
  paths: {
    sources: './contracts',
    tests: './test',
  },
  mocha: {
    enableTimeouts: false,
  },
};

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
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      timeout: 20000
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
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
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  paths: {
    sources: './contracts',
    tests: './test',
  },
  mocha: {
    enableTimeouts: false,
  },
};

# 🚀 Aluna Boosted Finance 🚀

Aluna Boosted Finance is a fork of [Boosted Finance](https://github.com/Boosted-Finance/smart-contracts)'s
Smart Contracts.

## Development

### Building and Tests
This project uses [buidler](https://buidler.dev/).

Make sure to install required dependencies:
```
$ npm install
```

To compile the contracts:
```
$ npm run compile
```

To run the tests:
```
$ npm run test
```

To run a single test:
```
$ npx buidler test test/<file>
```

## Testing

This project uses [buidler](https://buidler.dev/) and [solidity-coverage](https://blog.colony.io/code-coverage-for-solidity-eecfa88668c2/) to test.

to run tests

```
$ npx buidler coverage --network coverage
```


## Deploying

This project uses [buidler](https://buidler.dev/) to deploy. you have to configure a .env file to deploy. 

1. to create mock tests (testnet only, we may use kovan to consider uniswap contracts)

```
$ npx buidler deployMockTokens --network --kovan
```

2. to create Aluna Governance smart contracts, you need to define on ./scripts/_settings.js newOwner, boostToken, alunaTokenAddress and stableCoin adresses.

```
$ npx buidler deployGovernance --network --{kovan or mainnet}
```

3. to create Aluna Governance smart contracts, you need to define on ./scripts/_settings.js all settings

```
$ npx buidler deployPool --pool {your pool name} --network --{kovan or mainnet}
```
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

```
$ npx buidler coverage --network coverage
```


## Deploying

This project uses [buidler](https://buidler.dev/) scripts to deploy. 

In order to run the deploy scripts you need to create an `.env` file, please refer to our `.env.example`

Tests were done on the KOVAN network in order to interact with uniswap contracts.

1. deploy mock tokens

```
$ npx buidler deploy:mock-tokens --network kovan
```

- kovan tests
BoostToken - 0x15A1714400e6aF8b82e4612C5BA36Da88dA717a3
AlunaToken - 0x005882F1334f76e798fFBE7ec3a220e1Fd0175fd
Stable     - 0x4004c6CEB0871dE5F202334A4036700B015aa5f2

2. In order to deploy Aluna Governance, you need to setup `gov` settings on ./scripts/_settings.js.

```
$ npx buidler deploy:governance --network {kovan or mainnet}
```

- kovan tests
Treasury   - 0xA8572E81A2043D87A9CBa0c46E279671B0A8cc4A
Governance - 0x6eA81B3F1152e63DFf43F5C87eda55574502b0Ee

3. In order to deploy Pools you need to define the pool on ./scripts/_settings.js 

```
$ npx buidler deploy:pool --pool {your pool name} --network {kovan or mainnet}
```

-kovan tests
ALN_ETH Pool - 0x0B1b5eD98935a7bd304385e5E90f84501FD60082

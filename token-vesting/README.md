<img src="https://aluna.social/Aluna-Circle2%403x.png" align="right" width="200"/>

# Aluna Token Vesting


Source code for [Openzeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package/blob/update-v2.3.0/contracts/drafts/TokenVesting.sol)'s Token Vesting contract

Also you can find the [Audit](https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package/tree/update-v2.3.0/audit) at Openzeppelin repository


## Development

### Building and Tests
This project uses [oz cli](https://docs.openzeppelin.com/cli/2.7/).

Make sure to install required dependencies:
```
$ npm install
```

To compile the contracts:
```
$ npx oz compile
```

To run the tests:
```
$ npm run test
```

## Deploying

This project uses [oz cli](https://docs.openzeppelin.com/cli/2.7/).

In order to deploy use  the folowing parameters.

```
$ npx oz deploy
? Choose the kind of deployment upgradeable
? Pick a network {Any network}
? Pick a contract to deploy AlunaTokenVesting
All implementations are up to date
? Call a function to initialize the instance after creating it? Yes
? Select which function * init(beneficiary: address, start: uint256, cliffDuration: uint256, duration: uint256, revocable: bool)
? beneficiary: address: {Insert Beneficiary}
? start: uint256: {Insert Start}
? cliffDuration: uint256: {Insert CliffDuration}
? duration: uint256: {Insert Duration}
? revocable: bool: {True or False}
✓ Instance created at {Contract Address}
```







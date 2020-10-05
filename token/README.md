<img src="https://aluna.social/Aluna-Circle2%403x.png" align="right" width="200"/>

[![Coverage Status](https://codecov.io/gh/alunacrypto/aluna-token/branch/master/graph/badge.svg)](https://codecov.io/gh/alunacrypto/aluna-token)


- [Introduction](#aluna-smart-contracts)
- [Contracts](#contracts)
    - [AlunaCrowdsale.sol](#alunacrowdsalesol)
    - [AlunaToken.sol](#alunatokensol)
    - [TokenTimelockFactor.sol](#tokentimelockfactorsol)
    - [PaymentReceiver.sol](#paymentreceiversol)
      - [::setRewardsPoolPercentage](#rewardspooldeposit)
      - [::setRewardsPoolAddress](#rewardspoolsendrewards)
      - [::processPayment](#rewardspoolsendrewards)
      - [::refundPayment](#rewardspoolsendrewards)
    - [RewardsPool.sol](#rewardspoolsol)
      - [::deposit](#rewardspooldeposit)
      - [::sendRewards](#rewardspoolsendrewards)
      - [Checking Balance of Rewards Pool](#rewardspoolsendrewards)
    - [AlunaToken.sol](#alunatokensol)
    - [AlunaToken.sol](#alunatokensol)
- [Testing Project Locally](#testing-the-project-locally)
- [Deploying the project to Ropsten](#deploying-the-project-to-ropsten)
- [Platform Links](#platform-links)

# Aluna Smart Contracts

This repository powers the [Aluna](https://token.aluna.social) smart contract network.

[AlunaToken](#alunatokensol) implements the ERC-20 standard with added
functionalty which allows the Token to receive payments on behalf of the
[Aluna Platform](https://aluna.social).

This extra functionality is implemented on [PaymentProcess](#paymentprocessorsol).

When receiving payments, the [PaymentProcess](#paymentprocessorsol) will automatically
forward part of the payment to the [RewardsPool](#rewardspoolsol).

The RewardsPool will be responsible for holding all the ALN which will
be used to reward users for their performance on the leaderboard, among other
actions that are being implemented on [Aluna Social](https://aluna.social).

## Contracts

### AlunaCrowdsale.sol

The Aluna crowdsale contract will receive eth and give ALN tokens in exchange, it doesn't have a minimum goal but it has a maximum goal of ETH to be raised, the tokens will be distributed after the closingTime.

### AlunaToken.sol
  - Implements the ERC-20 standard
  - Provides additional functionality to process payments using the PaymentProcessor contract
  - Provices additional groupTransfer function

#### AlunaToken::groupTransfer(address[] memory recipients, uint256[] memory values)

 - [source code](https://github.com/levelkdev/aluna-smart-contracts/blob/readme-updates/contracts/AlunaToken.sol#L39-L51)

ZeppelinOS-based initializable ugradable ERC-20 token. Provides additional functionality to process payments using the PaymentProcessor contract.


### PaymentReceiver.sol
 - ZeppelinOS-based initializable ugradable contract

#### PaymentReceiver::setRewardsPoolPercentage(uint256 _rewardsPoolPercentage)

This method allows Aluna Org to set the percentage of tokens received as payment
that will be forwarded to the Rewards Pool.

````javascript

  const web3 = new Web3()

  // sets the Pool Percentage to 50%
  const tokenContract = new web3.eth.Contract(tokenABI, tokenProxyAddress)

  // sets 50% of payments to be forwarded to Rewards Pool
  await tokenContract.methods.setRewardsPoolPercentage(50).send({ from: alunaOrg });
````

#### PaymentReceiver::setRewardsPoolAddress(address _rewardsPoolAddress)

This method allows Aluna Org to set the address of the Rewards Pool.

````javascript

  const web3 = new Web3()

  const tokenContract = new web3.eth.Contract(tokenABI, tokenProxyAddress)

  // sets 50% of payments to be forwarded to Rewards Pool
  await tokenContract.methods.setRewardsPoolAddress(rewardsPoolAddress).send({ from: alunaOrg });
````

#### PaymentReceiver::processPayment(uint256 _value, bytes32 _paymentId)

This method allows Aluna Org to process a payment.

Part of the payment is automatically sent to the Rewards Pool.

````javascript

  const web3 = new Web3()

  const tokenContract = new web3.eth.Contract(tokenABI, tokenProxyAddress)

  await tokenContract.methods.processPayment(tokenAmount, paymentId).send();
````

#### PaymentReceiver::refundPayment(address _sender, uint256 _value, bytes32 _paymentId)

This method allows Aluna Org to refund a total or partial payment.

````javascript

  const web3 = new Web3()

  const tokenContract = new web3.eth.Contract(tokenABI, tokenProxyAddress)

  await tokenContract.methods.refundPayment(sender, tokenAmount, paymentId).send();
````


### RewardsPool.sol
 - ZeppelinOS-based initializable ugradable contract

The [Rewards Pool](contracts/RewardsPool.sol) is responsible for keeping all the ALN intended to be
used as rewards on the website.



#### RewardsPool::deposit

This method allows anyone to deposit ALN Tokens in the RewardsPool.

In order to deposit tokens in the RewardsPool you need to first call `approve`
on the Token contract and then `deposit` in the RewardsPool contract.
````javascript

  const web3 = new Web3()

  const tokenContract = new web3.eth.Contract(tokenABI, tokenProxyAddress)
  const rewardsContract = new web3.eth.Contract(tokenABI, rewardsProxyAddress)

  await tokenContract.methods.approve(rewardsProxyAddress, 1000).send()
  await rewardsContract.methods.deposit(100).send()
````

#### RewardsPool::sendRewards

This method allows Aluna Org to send ALN Tokens to reward users.

````javascript

  const web3 = new Web3()

  const rewardsContract = new web3.eth.Contract(tokenABI, rewardsProxyAddress)

  await rewardsContract.methods.sendRewards([receiver1, receiver2], [50, 40]).send({ from: alunaOrg });
````

#### Checking the balance of the RewardsPool

In order to know how much is currently in the Rewards Pool you can simply
check its balance in the Token Contract.
````javascript

  const web3 = new Web3()

  const tokenContract = new web3.eth.Contract(tokenABI, tokenProxyAddress)

  const balance = await tokenContract.methods.balanceOf(rewardsProxyAddress).call()
````

ZeppelinOS-based initializable ugradable contract that receives the rewards cut of each payment. Provides withdrawal functionality to administrators.

### Build groupTransferData

```
node scripts/buildGroupTransfer.js "ADDRESS_1,ADDRESS_2" "VALUE_1,VALUE_2"
```

## Requirements

Node 10 is required for running the tests and contract compilation.

## Development

```sh
git clone https://github.com/levelkdev/aluna-smart-contracts
nvm install
npm install
npm test
```

## Deployment

We are using the upgradeability proxy from [openzeppelin](https://docs.openzeppelin.com/sdk/2.5/)
and the deployment pipeline is using their system as well. You can read more
about the [publishing process](https://docs.openzeppelin.com/sdk/2.5/publish) and
[upgrading](https://docs.openzeppelin.com/sdk/2.5/api/upgrades) in `openzeppelin`
documentation.

In order to interact with "real" networks such as `mainnet`, `ropsten` or others,
you need to setup a `keys.json` file used by [truffle](https://truffleframework.com/)
that does the heavy lifting for openzeppelin.

```json
{
  "mnemonic": "<SEED_PHRASE>",
  "infura_projectid": "<PROJECT_ID>"
}
```

Example command for AlunaToken and RewardsPool contract creation from upgradeable instances:
```
npx openzeppelin create AlunaToken --network ropsten --init initialize --args 25000000000000000000000000,0x0000000000000000000000000000000000000000,10,0x00bBe1f8F6F8032609F151B59ea20a686fbf44b5 --from 0xe3c7725F036B79781Cf8c5246ea7c1fa4AfC9827

npx openzeppelin create RewardsPool --network ropsten --init initialize --args 0x00bBe1f8F6F8032609F151B59ea20a686fbf44b5,0xA405B28c3B70F364a23d573CdF5032871dFcF1F7 --from 0xe3c7725F036B79781Cf8c5246ea7c1fa4AfC9827    
```

### Upgradeability FAQ

**What does upgradeability mean?**

We can update the logic of ALN Token and RewardsPool contracts while keeping their
public address the same and **without touching any data**.

**Who is the proxy admin on mainnet?**
The proxies are administered by a multisignature wallet.

**Who is the owner wt contracts deployed on mainnet?**
The Token and RewardsPool contract are owned by a multisignature wallet.

## Platform Links

- [https://aluna.social](https://aluna.social)
- [https://token.aluna.social](https://aluna.social)
- [https://blog.aluna.social](https://blog.aluna.social)

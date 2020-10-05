# 🚀 Boosted Finance 🚀

## The Inspiration
Many of us watched or participated in decentralized financial socio-economic experiments which have failed miserably due to the lack of long-term network effects, over-engineered mechanisms or centralized bias. Yield farmers need two things: maximum yield and fair farming grounds.

Boosted Finance brings together the best that DeFi and decentralized technology has on offer: equally fair barrier of entry for all participants, democratic governance, perpetual network effects and economic theory. We have been inspired by Yam’s elegant protocol design, taking key principles while omitting the rebasing mechanism and implementing the eighth wonder of the world - compound effects.

Boosted Finance features: 
* A fair distribution mechanism that incentivizes key community members to actively take the reins of governance.
* Fully on-chain governance to enable decentralized control and evolution from Day 1.
* A governable treasury to reward participation from community members to further support stability in the long run.
* An yield-boosting option that works on the compounding effect of money and maintaining long-term prosperity for BOOST holders.

## Audits
There have been no official third-party audits for Boost Finance although core contributors have made extensive efforts to secure smart contracts including forking the code bases of notable and established projects.

⚠️ We urge all users who engage with staking contracts to self-audit and read through contracts before putting your LP tokens at stake. You will be using this BETA product at your own risk.

Security is important to us. We invite Trail of Bits, PeckShield, OpenZeppelin, Consensys, Certik, and Quantstamp and more to audit the contracts. We will be submitting a governance proposal to award firms that audit Boosted Finance from the fully governable BOOST treasury.

If you feel uncomfortable with these premises, don't stake or hold BOOST. If the community votes to fund an audit, there is no assumption that the original devs will be around to implement fixes, and is entirely at their discretion.

## BOOST token
BOOST is a governance token for the BOOST treasury. The value of the token will be entirely dependent on the BOOST community who are responsible for the direction via community voting on-chain.

## Distribution
**No Pre-Mine. No Founder Allocation. No Venture Capital.** In true DeFi spirit, the initial distribution of BOOST will be evenly spread across 10 genesis staking pools to provide an equal-opportunity staking distributions for yield farmers of all backgrounds. 

There will be **100,000 BOOST tokens to be fully released over the course of 4 weeks** from launch. BOOST will be farmed and allocated every minute based on the proportion of the token staked against the total staked token in the same pool. 


The initial distribution of 40,000 BOOST will be evenly distributed across ten staking pools composed of the top DeFi tokens over the first week of launch. These pools have been chosen based on covering all facets of DeFi and ones with communities that have strong commitment to decentralized technologies.

60,000 BOOST will be equally through two internal BOOST staking pools with duration of 2 weeks each. The first pool will be set up through [Uniswap](https://uniswap.org/) and will be initiated 48 hours after the launch of genesis farming pools. The second pool will be set up through [SushiSwap](https://sushiswap.org/) and will be initiated shortly after liquidity migration has taken place on SushiSwap (the countdown timer to the event can be found [here](http://etherscan.io/block/countdown/10850000)).

## Governance
Using a modified YFI governance model, the community will be able to submit governance proposals **48 hours after launch** by locking up 13.37 BOOST in a staking contract for three days. Each proposal will have a **duration of 2 days** where the proposer can submit withdrawal amount and address, if they wish to claim yCRV for the proposal.

**Once voting for or against in governance proposals, stakers will not be able to switch votes.**

Proposals can only be resolved after the two day duration, once resolved as either a ‘pass’ or ‘fail, it cannot be resolved again to prevent multiple withdrawals for successful proposals. To discourage bad proposals, if the proposers asks for more than 1000 yCRX and a 5% minimum quorum is not met — the entire stake will be **slashed**, converted to yCRV and transferred to the governance contract.

Quorums are determined by the total supply at the time of proposal resolution and must hit a minimum of 30% quorum, more votes for than against, to pass.

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

## Attribution
Much of this codebase is modified from existing works, including:

[Compound](https://compound.finance/) - Jumping off point for token code and governance

[Synthetix](https://synthetix.io/) - Rewards staking contract

[YEarn](https://yearn.finance/) - Initial fair distribution implementation

[YAM](https://yam.finance/) - Design inspiration

## Mainnet Contract Addresses

Boost Token: `0x3e780920601D61cEdb860fe9c4a90c9EA6A35E78`

Pool Addresses\
AAVE: `0x383F3Ba9B39011f658e55a4c24c648851A4A8b60`\
BAND: `0x3080869CF796d944cB4fb3C47D7084f8E8D3d22a`\
COMP: `0x39CD2Fc7BAc954ABc3C1b6dA1CD467fA44f4f3BD`\
KNC: `0x90dfbaDDf8f213185004bB200eDbB554E1F13D52`\
LINK: `0x57fbd512a440CCE6832c62fD63c54A0A9f545F8a`\
MKR: `0x40aFeF1b846D0a4EEf601Cf2B2117468eF63643C`\
REN: `0x1dfF57d28C30F094235f0244939194B1223e66e1`\
SNX: `0xf8Cb70658F7eC2bdC51d65323300b4cd0B5c6301`\
SUSHI: `0xC7491fcDfc8af10d5a8Bc9C13b60B85209C0dc59`\
YFI: `0x3EE27441449B2DfC705E3C237FFd75826870120A`

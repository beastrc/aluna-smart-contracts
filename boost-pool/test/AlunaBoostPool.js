const {constants, expectRevert, time} = require('@openzeppelin/test-helpers');
const {BN} = require('@openzeppelin/test-helpers/src/setup');
const {expect, assert} = require('chai');
const UniswapV2FactoryBytecode = require('@uniswap/v2-core/build/UniswapV2Factory.json');
const UniswapV2Router02Bytecode = require('@uniswap/v2-periphery/build/UniswapV2Router02.json');
const TruffleContract = require('@truffle/contract');
const AlunaBoostPool = artifacts.require('AlunaBoostPool');
const AlunaGov = artifacts.require('AlunaGov');
const BoostToken = artifacts.require('BoostToken');
const TestToken = artifacts.require('Token');
const WETH = artifacts.require('WETH9');
const Treasury = artifacts.require('Treasury');
require('chai').use(require('chai-as-promised')).use(require('chai-bn')(BN)).should();

function getCurrentBlock() {
  return new Promise(function (fulfill, reject) {
    web3.eth.getBlockNumber(function (err, result) {
      if (err) reject(err);
      else fulfill(result);
    });
  });
}

function getCurrentBlockTime() {
  return new Promise(function (fulfill, reject) {
    web3.eth.getBlock('latest', false, function (err, result) {
      if (err) reject(err);
      else fulfill(result.timestamp);
    });
  });
}

async function mineBlocks(blocks) {
  for (let i = 0; i < blocks; i++) {
    await time.advanceBlock();
  }
}

function mineBlockAtTime(timestamp) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send.bind(web3.currentProvider)(
      {
        jsonrpc: '2.0',
        method: 'evm_mine',
        params: [timestamp],
        id: new Date().getTime(),
      },
      (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      }
    );
  });
}

const DURATION = 7 * 24 * 60 * 60;
const boostThreshold = 10;
const USDT_CAP_AMOUNT = (10000 * 10 ** 6).valueOf();
const REWARD_AMOUNT = web3.utils.toWei('6048');
const MAX_UINT256 = new BN(2).pow(new BN(256)).sub(new BN(1));
let START_TIME;

contract('AlunaBoostPool', ([governance, minter, alice, bob]) => {
  beforeEach('init tokens and pools', async () => {
    // Set pool start time one day after
    START_TIME = await getCurrentBlockTime() + (24 * 60 * 60);

    // Setup tokens
    this.boost = await BoostToken.new({from: governance});
    this.aluna = await TestToken.new('Aluna Token', 'ALN', '18', {from: governance});
    this.usdt = await TestToken.new('Tether USDT', 'USDT', '6', {from: governance});
    this.ycrv = await TestToken.new('Curve.fi yDAI/yUSDC/yUSDT/yTUSD', 'yDAI+yUSDC+yUSDT+yTUSD', '18', {
      from: governance,
    });
    this.weth = await WETH.new({from: governance});

    // Setup Uniswap
    const UniswapV2Factory = TruffleContract(UniswapV2FactoryBytecode);
    const UniswapV2Router02 = TruffleContract(UniswapV2Router02Bytecode);
    UniswapV2Factory.setProvider(web3.currentProvider);
    UniswapV2Router02.setProvider(web3.currentProvider);
    this.uniswapV2Factory = await UniswapV2Factory.new(governance, {from: governance});
    this.uniswapV2Router = await UniswapV2Router02.new(this.uniswapV2Factory.address, this.weth.address, {
      from: governance,
    });

    // Create Uniswap pair
    await this.boost.approve(this.uniswapV2Router.address, MAX_UINT256, {from: governance});
    await this.ycrv.approve(this.uniswapV2Router.address, MAX_UINT256, {from: governance});
    await this.uniswapV2Factory.createPair(this.boost.address, this.weth.address, {from: governance});
    await this.uniswapV2Factory.createPair(this.ycrv.address, this.weth.address, {from: governance});
    await this.uniswapV2Router.addLiquidityETH(
      this.boost.address,
      web3.utils.toWei('10000'),
      '0',
      '0',
      governance,
      MAX_UINT256,
      {value: web3.utils.toWei('100'), from: governance}
    );
    await this.uniswapV2Router.addLiquidityETH(
      this.ycrv.address,
      web3.utils.toWei('10000'),
      '0',
      '0',
      governance,
      MAX_UINT256,
      {value: web3.utils.toWei('100'), from: governance}
    );

    // Setup Treasury
    this.treasury = await Treasury.new(
      this.uniswapV2Router.address,
      this.ycrv.address,
      governance,
      {
        from: governance,
      }
    );

    // Setup pools
    this.usdtPool = await AlunaBoostPool.new(
      USDT_CAP_AMOUNT,
      this.usdt.address,
      this.aluna.address,
      this.boost.address,      
      this.treasury.address,
      this.uniswapV2Router.address,
      START_TIME,
      DURATION,
      {
        from: governance,
      }
    );
    await this.aluna.transfer(this.usdtPool.address, REWARD_AMOUNT, {from: governance});

    // Set balances and approvals
    await this.weth.deposit({value: web3.utils.toWei('200'), from: governance});

    // alice
    await this.usdt.transfer(alice, 100000 * 10 ** 6, {from: governance});
    await this.usdt.approve(this.usdtPool.address, MAX_UINT256, {from: alice});
    await this.boost.approve(this.usdtPool.address, MAX_UINT256, {from: alice});

    // bob
    await this.usdt.transfer(bob, 100000 * 10 ** 6, {from: governance});
    await this.usdt.approve(this.usdtPool.address, MAX_UINT256, {from: bob});
    await this.boost.approve(this.usdtPool.address, MAX_UINT256, {from: bob});

    // Deploy governance but don't set yet
    this.gov = await AlunaGov.new(this.aluna.address, this.treasury.address, this.uniswapV2Router.address, {
      from: governance,
    });
  });

  it('should test the rewards pool constants', async () => {
    // USDT pool
    assert.equal(await this.usdtPool.boostToken(), this.boost.address);
    assert.equal(await this.usdtPool.swapRouter(), this.uniswapV2Router.address);
    assert.equal(await this.usdtPool.tokenCapAmount(), USDT_CAP_AMOUNT);
    assert.equal(await this.usdtPool.boostThreshold(), boostThreshold);
    assert.equal(await this.usdtPool.duration(), DURATION);
    assert.equal(await this.usdtPool.starttime(), START_TIME);

  });

  it('should set the rewards per pool', async () => {
    await this.usdtPool.notifyRewardAmount(REWARD_AMOUNT, {from: governance});
    assert.equal((await this.usdtPool.rewardRate()).valueOf(), REWARD_AMOUNT / DURATION - 1);
    assert.equal(await this.usdtPool.lastUpdateTime(), START_TIME);
    assert.equal(await this.usdtPool.periodFinish(), START_TIME + DURATION);

  });

  it('should test renouncing governanceship per pool', async () => {
    await this.usdtPool.renounceOwnership({from: governance});
    assert.equal(await this.usdtPool.governance(), constants.ZERO_ADDRESS);

  });

  it('should revert relevant functions if pool has not started yet', async () => {
    await expectRevert(this.usdtPool.stake(1000 * 10 ** 6, {from: alice}), 'not start');
    await expectRevert(this.usdtPool.getReward({from: alice}), 'not start');
    await expectRevert(this.usdtPool.boost({from: alice}), 'not start');
    await expectRevert(this.usdtPool.withdraw(1, {from: alice}), 'not start');
    await expectRevert(this.usdtPool.exit({from: alice}), 'not start');
  });

  it('should successfully set governance', async () => {
    await this.usdtPool.setGovernance(this.gov.address, {from: governance});

    assert.equal(await this.usdtPool.governanceSetter(), constants.ZERO_ADDRESS);
    assert.equal(await this.usdtPool.stablecoin(), this.ycrv.address);
  });


  it('should revert to set governance', async () => {
    await expectRevert(this.usdtPool.setGovernance(this.gov.address, {from: alice}),'only setter');
  });

  it('should test staking at a pool', async () => {
    // Mine block and move timestamp to beyond pool start time
    await mineBlockAtTime(START_TIME + 15);

    await this.usdtPool.stake(1000 * 10 ** 6, {from: alice});
    assert.equal(await this.usdtPool.balanceOf(alice), 1000 * 10 ** 6);
    assert.equal(await this.usdtPool.totalSupply(), 1000 * 10 ** 6);
  });

  it('should revert staking at a pool with zero amount', async () => {
    await mineBlockAtTime(START_TIME);

    await expectRevert(this.usdtPool.stake(0, {from: alice}), 'Cannot stake 0');
  });

  it('should revert staking at a pool with amount exceeding token within first 24hours', async () => {
    await mineBlockAtTime(START_TIME);

    await expectRevert(this.usdtPool.stake(USDT_CAP_AMOUNT + 1, {from: alice}), 'token cap exceeded');
  });

  it('should not revert staking at a pool with amount exceeding token cap after first 24hours', async () => {
    // Mine block and move timestamp to beyond 24hour token cap
    await mineBlockAtTime(START_TIME + 86400);

    await this.usdtPool.stake(USDT_CAP_AMOUNT + 1, {from: alice});
    assert.equal(await this.usdtPool.balanceOf(alice), USDT_CAP_AMOUNT + 1);
  });

  it('should test alice taking 100% of the usdtPool rewards', async () => {
    // buidler evm can only mine 1 transaction per block and increases
    // block.timestamp by 1 second on every transaction, so we will
    // offset the start start by 2 seconds, so the first stake will be
    // exactly the same at START_TIIME
    if (network.name === "buidlerevm") {
      await mineBlockAtTime(START_TIME -2) 
    } else { 
      await mineBlockAtTime(START_TIME);
    }

    await this.usdtPool.notifyRewardAmount(REWARD_AMOUNT, {from: governance});

    await this.usdtPool.stake(1, {from: alice})

    // Mine 1 week worth of blocks
    await mineBlockAtTime(START_TIME + DURATION);
    
    await this.usdtPool.getReward({from: alice});

    const aliceBalance = await this.aluna.balanceOf(alice)

    assert.equal(aliceBalance, REWARD_AMOUNT)
  });

  it('should test alice taking 75% and bob taking 25% of the rewards', async () => {
    // buidler evm can only mine 1 transaction per block and increases
    // block.timestamp by 1 second on every transaction, so we will
    // offset the start start by 2 seconds, so the first stake will be
    // exactly the same at START_TIIME
    if (network.name === "buidlerevm") {
      await mineBlockAtTime(START_TIME -2) 
    } else { 
      await mineBlockAtTime(START_TIME);
    }

    await this.usdtPool.notifyRewardAmount(REWARD_AMOUNT, {from: governance});

    await this.usdtPool.stake(1, {from: alice})

    if (network.name === "buidlerevm") {
      await mineBlockAtTime(START_TIME -1 + DURATION / 2);
    } else { 
      await mineBlockAtTime(START_TIME + DURATION / 2);
    }

    await this.usdtPool.stake(1, {from: bob})

    // Mine 1 week worth of blocks
    await mineBlockAtTime(START_TIME + DURATION);
    
    await this.usdtPool.getReward({from: alice});

    const aliceBalance = await this.aluna.balanceOf(alice)

    await this.usdtPool.getReward({from: bob});

    const bobBalance = await this.aluna.balanceOf(bob)

    assert.equal(aliceBalance, REWARD_AMOUNT * 0.75)
    assert.equal(bobBalance, REWARD_AMOUNT * 0.25)
  });

  it('should revert purchasing yield boosters before intended start time', async () => {
    await mineBlockAtTime(START_TIME);

    await this.usdtPool.notifyRewardAmount(REWARD_AMOUNT, {from: governance});

    await expectRevert(this.usdtPool.boost({from: alice}), 'early boost purchase');
  });

  it('should successfully purchase yield boosters and increase booster price by 5%', async () => {
    await mineBlockAtTime(START_TIME)

    await this.usdtPool.notifyRewardAmount(REWARD_AMOUNT, {from: governance});

    // Mine block and move timestamp to beyond 2 days
    if (network.name === "buidlerevm") {
      await mineBlockAtTime(START_TIME + 172800) 
    } else { 
      await mineBlockAtTime(START_TIME + 172801)
    }

    await this.usdtPool.stake(1, {from: alice})

    await this.boost.transfer(alice, web3.utils.toWei('1'), {from: governance});

    await this.usdtPool.boost({from: alice});

    const boosterPriceUSDT = await this.usdtPool.boosterPrice();

    const boostersBoughtUSDT = await this.usdtPool.numBoostersBought(alice);

    assert.equal(boosterPriceUSDT, 1 * 10 ** 18 * 1.05);
    assert.equal(boostersBoughtUSDT, 1);
  });

  it('should successfully purchase yield boosters, sending half of BOOST to Boost Governance', async () => {
    await mineBlockAtTime(START_TIME)

    await this.usdtPool.setGovernance(this.gov.address, {from: governance});

    // Mine block and move timestamp to beyond 2 days
    if (network.name === "buidlerevm") {
      await mineBlockAtTime(START_TIME + 172800) 
    } else { 
      await mineBlockAtTime(START_TIME + 172801)
    }

    await this.boost.transfer(alice, web3.utils.toWei('1'), {from: governance});

    await this.usdtPool.boost({from: alice});

    const stableBalance = await this.ycrv.balanceOf(this.gov.address)

    assert(stableBalance.should.be.a.bignumber.that.equals('496955027903342393'));
  });

  it('should allow buying boosters 1 hour after buying first one', async () => {
    
    await mineBlockAtTime(START_TIME)

    await this.usdtPool.notifyRewardAmount(REWARD_AMOUNT, {from: governance});

    // Mine block and move timestamp to beyond 2 days
    if (network.name === "buidlerevm") {
      await mineBlockAtTime(START_TIME + 172800) 
    } else { 
      await mineBlockAtTime(START_TIME + 172801)
    }

    await this.usdtPool.stake(1, {from: alice})

    await this.boost.transfer(alice, web3.utils.toWei('3'), {from: governance});

    await this.usdtPool.boost({from: alice});

    await expectRevert(this.usdtPool.boost({from: alice}), 'early boost purchase');

    // Mine block and move timestamp to 1 hour
    await mineBlockAtTime((await getCurrentBlockTime()) + 3601);

    await this.usdtPool.boost({from: alice});
  })

  it('should revert purchasing more than the max num allowed of boosters', async () => {
    await mineBlockAtTime(START_TIME)

    // Mine block and move timestamp to beyond 2 days
    if (network.name === "buidlerevm") {
      await mineBlockAtTime(START_TIME + 172800) 
    } else { 
      await mineBlockAtTime(START_TIME + 172800)
    }

    await this.usdtPool.stake(1, {from: alice})

    await this.boost.transfer(alice, web3.utils.toWei('10'), {from: governance});

    for (let i = 0; i < boostThreshold; i++) {
      await mineBlockAtTime((await getCurrentBlockTime()) + 3601);
      await this.usdtPool.boost({from: alice});
    }

    await mineBlockAtTime((await getCurrentBlockTime()) + 3601);
    await expectRevert(this.usdtPool.boost({from: alice}), 'max boosters bought');
  });

  it('should test withdrawing from a pool', async () => {
    await mineBlockAtTime(START_TIME)

    await this.usdtPool.stake(1, {from: alice})

    const balanceUSDT = await this.usdt.balanceOf(alice);

    await this.usdtPool.withdraw(1, {from: alice});

    assert.equal((await this.usdt.balanceOf(alice)).toString(), balanceUSDT.addn(1));
  });


  it('should revert withdrawing from a pool a zero amount', async () => {
    await mineBlockAtTime(START_TIME)

    await this.usdtPool.stake(1, {from: alice})

    const balanceUSDT = await this.usdt.balanceOf(alice);

    await expectRevert(this.usdtPool.withdraw(0, {from: alice}), 'Cannot withdraw 0');
  });

  it('should test exiting a pool', async () => {
    await mineBlockAtTime(START_TIME)

    await this.usdtPool.stake(1, {from: alice})

    assert.equal(await this.usdtPool.balanceOf(alice), 1);

    await this.usdtPool.exit({from: alice});

    assert.equal(await this.usdtPool.balanceOf(alice), 0);
  });
});

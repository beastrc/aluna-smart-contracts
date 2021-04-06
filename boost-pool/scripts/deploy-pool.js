usePlugin('@nomiclabs/buidler-ethers');

const BN = require('ethers').BigNumber;
const moment = require("moment")
const pressToContinue = require('./pressToContinue');
const settings = require("./_settings.js");
const uniswapRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

let gasPrice = new BN.from(185).mul(new BN.from(10).pow(new BN.from(9)));


task('deploy:pool', 'Deploy a pool specified on --pool option')
.addParam("pool", "The pool Name")
.setAction(async (taskArgs, bre) => {

  const network = await ethers.provider.getNetwork();    
  const poolSettings = settings[network.name].pools[taskArgs.pool];
  const govSettings =  settings[network.name].gov;

  const startDate = moment
    .unix(poolSettings.start)
    .format('MMMM Do YYYY, HH:mm:ss')

  const endDate = moment
    .unix(Number(poolSettings.start) + Number(poolSettings.duration))
    .format('MMMM Do YYYY, HH:mm:ss')

  console.log(`Deploying ${poolSettings.stakeTokenName} rewards pool...`);
  console.log("")
  console.log("stakeTokenName    :", poolSettings.stakeTokenName)
  console.log("stakeTokenAdress  :", poolSettings.stakeTokenAdress)
  console.log("cap               :", poolSettings.cap)
  console.log("rewardTokenAddress:", poolSettings.rewardTokenAddress)
  console.log("pool starts       :", startDate)
  console.log("pool ends         :", endDate)
  console.log("rewardAmount      :", poolSettings.rewardAmount)
  console.log("")
  await pressToContinue()

  // compile contracts
  await bre.run("compile");

  // deploy pool
  const RewardsPool = await ethers.getContractFactory('AlunaBoostPool');
  
  const rewardsPool = await RewardsPool.deploy(
    new BN.from(poolSettings.cap),
    poolSettings.stakeTokenAdress,
    poolSettings.rewardTokenAddress,
    govSettings.boostToken,
    govSettings.treasuryContract,
    uniswapRouter,
    poolSettings.start,
    poolSettings.duration,
    {gasPrice: gasPrice}
  );

  await rewardsPool.deployed();

  console.log(`${poolSettings.stakeTokenName} pool address: ${rewardsPool.address}`);
  await pressToContinue();

  console.log(`Notifying reward amt: ${poolSettings.rewardAmount}`);
  await rewardsPool.notifyRewardAmount(poolSettings.rewardAmount, {gasPrice: gasPrice});
  await pressToContinue();

  console.log(`Transferring ownership of ${poolSettings.stakeTokenName} pool`);
  await rewardsPool.transferOwnership(govSettings.newOwner, {gasPrice: gasPrice});
  await pressToContinue();

  process.exit(0);
});

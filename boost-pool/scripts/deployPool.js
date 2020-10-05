usePlugin('@nomiclabs/buidler-ethers');
const fs = require('fs');
const path = require('path');
const BN = require('ethers').BigNumber;
const { pressToContinue } = require('./checkpoint');

const uniswapRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
let boostTokenAddress;
let alunaTokenAddress;
let treasuryTokenAddress;
let gasPrice = new BN.from(20).mul(new BN.from(10).pow(new BN.from(9)));
let startTime;
let duration;
let uniswapLP;
let multisig;
let tokens;
let internalPoolBoostAmount = new BN.from('15000').mul(new BN.from('10').pow(new BN.from('18')));
let rewardsPoolBoostAmount = new BN.from('3750').mul(new BN.from('10').pow(new BN.from('18')));

task('deployPool', 'deploy Aluna pools').setAction(async () => {

  console.log("Deploying ");

  console.log("Config");

  const configPath = path.join(__dirname, './deploy_settings.json');
  readParams(JSON.parse(fs.readFileSync(configPath, 'utf8')));

  console.log("Deploy Rewards");

  // deploy rewards
  const RewardsPool = await ethers.getContractFactory('AlunaBoostPool');

  for (let token of tokens) {
    console.log(`Deploying ${token.name} rewards pool...`);
    const rewardsPool = await RewardsPool.deploy(
      new BN.from(token.cap),
      token.address,
      alunaTokenAddress,
      boostTokenAddress,
      treasuryTokenAddress,
      uniswapRouter,
      startTime,
      duration,
      {gasPrice: gasPrice}
    );

    await rewardsPool.deployed();

    console.log(`${token.name} pool address: ${rewardsPool.address}`);
    await pressToContinue();

    console.log(`Notifying reward amt: ${rewardsPoolBoostAmount}`);
    await rewardsPool.notifyRewardAmount(rewardsPoolBoostAmount, {gasPrice: gasPrice});
    await pressToContinue();

    console.log(`Transferring ownership of ${token.name} pool`);
    await rewardsPool.transferOwnership(multisig, {gasPrice: gasPrice});
    await pressToContinue();
  }

  console.log("Deploying uniswap LP pool");
  const rewardsPool = await RewardsPool.deploy(
    new BN.from(uniswapLP.cap),
    uniswapLP.address,
    alunaTokenAddress,
    boostTokenAddress,
    treasuryTokenAddress,
    uniswapRouter,
    startTime,
    duration,
    {gasPrice: gasPrice}
  );

  await rewardsPool.deployed();
  console.log(`${uniswapLP.name} pool address: ${rewardsPool.address}`);
  await pressToContinue();

  console.log(`Notifying reward amt: ${internalPoolBoostAmount}`);
  await rewardsPool.notifyRewardAmount(internalPoolBoostAmount, {gasPrice: gasPrice});
  await pressToContinue();

  console.log(`Transferring ownership of ${uniswapLP.name} pool`);
  await rewardsPool.transferOwnership(multisig, {gasPrice: gasPrice});
  await pressToContinue();

  process.exit(0);
});

function readParams(jsonInput) {
  startTime = jsonInput.start;
  duration = jsonInput.duration;
  multisig = jsonInput.multisig;
  stablecoin = jsonInput.stablecoin;
  boostTokenAddress = jsonInput.boostToken;
  alunaTokenAddress = jsonInput.alunaToken;
  treasuryTokenAddress = jsonInput.treasuryToken;
  uniswapLP = jsonInput.uniswapLP;
  tokens = jsonInput.tokens;
}
usePlugin('@nomiclabs/buidler-ethers');
const BN = require('ethers').BigNumber;
const pressToContinue = require('./pressToContinue');
const settings = require("./_settings.js");
const uniswapRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

let gasPrice = new BN.from(20).mul(new BN.from(10).pow(new BN.from(9)));

task('deployGovernance', 'deploy Aluna Governance').setAction(async () => {

  network = await ethers.provider.getNetwork();
 
  console.log('Deploying Treasury');
  const govSettings = settings[network.name].gov;
  console.log (govSettings)

  const Treasury = await ethers.getContractFactory('Treasury');
  const treasury = await Treasury.deploy(
    uniswapRouter,
    govSettings.stableCoin,
    govSettings.newOwner,
    { gasPrice: gasPrice }
  );

  await treasury.deployed();

  console.log(`treasury address: ${treasury.address}`);
  await pressToContinue();

  // deploy governance
  console.log('Deploying gov');

  const Gov = await ethers.getContractFactory('AlunaGov');
  const gov = await Gov.deploy(
    govSettings.alunaTokenAddress,
    treasury.address,
    uniswapRouter
  );
  await gov.deployed();

  console.log(`gov address: ${gov.address}`);

  await pressToContinue();

  // set governance contract in treasury
  console.log('Setting gov in treasury');

  await treasury.setGov(gov.address);
  await pressToContinue();

  // transfer treasury ownership to multisig
  console.log('transferring treasury ownership to multisig');

  await treasury.transferOwnership(govSettings.newOwner);
  await pressToContinue();
});

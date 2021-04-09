usePlugin('@nomiclabs/buidler-ethers');
const BN = require('ethers').BigNumber;
const pressToContinue = require('./pressToContinue');
const settings = require("./_settings.js");
const uniswapRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

let gasPrice = new BN.from(185).mul(new BN.from(10).pow(new BN.from(9)));

task('deploy:governance', 'deploy Aluna Governance').setAction(async (taskArgs, bre) => {

  network = await ethers.provider.getNetwork();

  console.log("network:", network.name)

  if(!settings[network.name]){
    console.log(`settings for ${network.name} not found`)
    return
  }

  await pressToContinue();

  // compile contracts
  await bre.run("compile");
 
  console.log('Deploying Treasury');
  const govSettings = settings[network.name].gov;

  console.log("uniswapRouter: ", uniswapRouter)
  console.log("stableCoin   : ", govSettings.stableCoin)
  console.log("newOwner     : ", govSettings.newOwner)

  const Treasury = await ethers.getContractFactory('Treasury');
  const treasury = await Treasury.deploy(
    uniswapRouter,
    govSettings.stableCoin,
    govSettings.newOwner,
    { gasPrice: gasPrice }
  );

  await treasury.deployed();

  console.log('')
  console.log(`treasury address: ${treasury.address}`);
  console.log('')
  await pressToContinue();

  // deploy governance
  console.log('Deploying gov');

  console.log("alunaTokenAddress: ", govSettings.alunaTokenAddress)
  console.log("treasury.address : ", treasury.address)
  console.log("uniswapRouter    : ", uniswapRouter)

  const Gov = await ethers.getContractFactory('AlunaGov');
  const gov = await Gov.deploy(
    govSettings.alunaTokenAddress,
    treasury.address,
    uniswapRouter
  );
  await gov.deployed();

  console.log('')
  console.log(`gov address: ${gov.address}`);
  console.log('')

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

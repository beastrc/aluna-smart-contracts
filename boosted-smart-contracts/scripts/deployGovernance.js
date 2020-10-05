usePlugin('@nomiclabs/buidler-ethers');
const fs = require('fs');
const path = require('path');
const BN = require('ethers').BigNumber;
const { pressToContinue } = require('./checkpoint');

const uniswapRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
let alunaTokenAddress;
let gasPrice = new BN.from(20).mul(new BN.from(10).pow(new BN.from(9)));
let multisig;
let tokens;

task('deployGovernance', 'deploy Aluna Governance').setAction(async () => {

  const configPath = path.join(__dirname, './deploy_settings.json');

  readParams(JSON.parse(fs.readFileSync(configPath, 'utf8')));

  // deploy treasury
  console.log('Deploying Treasury');

  const Treasury = await ethers.getContractFactory('Treasury');
  const treasury = await Treasury.deploy(
    uniswapRouter,
    stablecoin,
    multisig,
    { gasPrice: gasPrice }
  );

  await treasury.deployed();

  console.log(`treasury address: ${treasury.address}`);
  await pressToContinue();

  // deploy governance
  console.log('Deploying gov');

  const Gov = await ethers.getContractFactory('AlunaGov');
  const gov = await Gov.deploy(
    alunaTokenAddress,
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

  await treasury.transferOwnership(multisig);
  await pressToContinue();
});

function readParams(jsonInput) {
  multisig = jsonInput.multisig;
  stablecoin = jsonInput.stablecoin;
  alunaTokenAddress = jsonInput.alunaToken;
  tokens = jsonInput.tokens;
}
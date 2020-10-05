usePlugin('@nomiclabs/buidler-ethers');

const fs = require('fs');
const path = require('path');
const BN = require('ethers').BigNumber;
const { pressToContinue } = require('./checkpoint');

task('deployMockTokens', 'Deploy preconditions')
    .setAction(async () => {

      network = await ethers.provider.getNetwork();
      const [deployer] = await ethers.getSigners();
      let deployerAddress = await deployer.getAddress();

      const BoostToken = await ethers.getContractFactory('BoostToken')
      const AlunaToken = await ethers.getContractFactory('Token')
      const Stable = await ethers.getContractFactory('Token')

      //Deploy Boost
      console.log('Deploying BoostToken');
      const boostToken = await BoostToken.deploy()
      await boostToken.deployed()

      console.log(`Boost address: ${boostToken.address}`);
      await pressToContinue();

      //Deploy Aluna
      console.log('Deploying AlunaToken');
      const alunaToken = await AlunaToken.deploy('ALUNA TOKEN', 'ALN', 18)
      await alunaToken.deployed()

      console.log(`Aluna address: ${alunaToken.address}`);
      await pressToContinue();

      //Deploy Stable
      console.log('Deploying Stable');
      const stable = await Stable.deploy('STABLE TOKEN', 'STB', 18)
      await stable.deployed()

      console.log(`Stable address: ${stable.address}`);
      await pressToContinue();

})
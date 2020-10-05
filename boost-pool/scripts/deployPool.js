usePlugin('@nomiclabs/buidler-ethers');
const BN = require('ethers').BigNumber;
const { pressToContinue } = require('./checkpoint');
const settings = require("./_settings.js");
const uniswapRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

let gasPrice = new BN.from(20).mul(new BN.from(10).pow(new BN.from(9)));


task('deployPool', 'deploy Aluna pools')
    .addParam("pool", "The pool Name")
    .setAction(async (taskArgs) => {
  
    const network = await ethers.provider.getNetwork();    
    const poolSettings = settings[network.name].pools[taskArgs.pool];
    const govSettings =  settings[network.name].gov;

    console.log(poolSettings);  
  
    // deploy pool
    const RewardsPool = await ethers.getContractFactory('AlunaBoostPool');

    console.log(`Deploying ${poolSettings.stakeTokenName} rewards pool...`);
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

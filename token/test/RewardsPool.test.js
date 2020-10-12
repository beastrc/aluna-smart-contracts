const { TestHelper } = require('@openzeppelin/cli');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');

ZWeb3.initialize(web3.currentProvider);
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const AlunaToken = Contracts.getFromLocal('AlunaToken');
const RewardsPool = Contracts.getFromLocal('RewardsPool');

contract('RewardsPool', function ([_, proxyOwner, alunaOrg, receiver1, receiver2, tokenHolder]) {
  beforeEach(async function () {
    this.project = await TestHelper();
    this.token = await this.project.createProxy(AlunaToken, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [10000, _, 10, alunaOrg],
    });
    this.rewardsProxy = await this.project.createProxy(RewardsPool, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [alunaOrg, this.token.address],
    });
    await this.token.methods.setRewardsPoolAddress(this.rewardsProxy.address).send({ from: alunaOrg });
    await this.token.methods.approve(this.rewardsProxy.address, 1000).send({ from: alunaOrg });
    await this.rewardsProxy.methods.deposit(alunaOrg, 100).send({ from: alunaOrg });
  });

  it('should have a balance of 100 ALN', async function () {
    (await this.token.methods.balanceOf(this.rewardsProxy.address).call())
      .should.be.equal('100');
  });

  it('send ALN Rewards for multiple receivers', async function () {
    await this.rewardsProxy.methods.sendRewards([receiver1, receiver2], [50, 40]).send({ from: alunaOrg });

    (await this.token.methods.balanceOf(receiver1).call())
      .should.be.equal('50');
    (await this.token.methods.balanceOf(receiver2).call())
      .should.be.equal('40');
    (await this.token.methods.balanceOf(this.rewardsProxy.address).call())
      .should.be.equal('10');
  });
});

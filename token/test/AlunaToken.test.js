const { TestHelper } = require('@openzeppelin/cli');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');
const should = require('chai').should();

ZWeb3.initialize(web3.currentProvider);
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const AlunaToken = Contracts.getFromLocal('AlunaToken');

contract('AlunaToken', function (
  [proxyOwner, alunaOrg, airdrop1, airdrop2, airdrop3, rewardsPool]
) {
  const totalSupply = web3.utils.toWei('100000000');

  beforeEach(async function () {
    this.project = await TestHelper();
    this.token = await this.project.createProxy(AlunaToken, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [totalSupply, rewardsPool, 10, alunaOrg],
    });
  });

  it('should have the right initialized variables', async function () {
    (await this.token.methods.name().call()).should.be.equal('AlunaToken');
    (await this.token.methods.symbol().call()).should.be.equal('ALN');
    (await this.token.methods.decimals().call()).should.be.equal('18');
    (await this.token.methods.owner().call()).should.be.equal(alunaOrg);
    (await this.token.methods.rewardsPoolAddress().call()).should.be.equal(rewardsPool);
    (await this.token.methods.rewardsPoolPercentage().call()).should.be.equal('10');
    (await this.token.methods.totalSupply().call()).should.be.equal(totalSupply);
    (await this.token.methods.balanceOf(alunaOrg).call()).should.be.equal(totalSupply);
  });

  it('should be able to execute groupTransfers', async function () {
    // Execute groupTransfer
    await this.token.methods.groupTransfer(
      [airdrop1, airdrop2, airdrop3],
      [
        web3.utils.toWei('1000000'),
        web3.utils.toWei('1500000'),
        web3.utils.toWei('2500000'),
      ],
    ).send({ from: alunaOrg });

    (await this.token.methods.balanceOf(alunaOrg).call())
      .should.be.equal(web3.utils.toWei('95000000'));

    (await this.token.methods.balanceOf(airdrop1).call())
      .should.be.equal(web3.utils.toWei('1000000'));

    (await this.token.methods.balanceOf(airdrop2).call())
      .should.be.equal(web3.utils.toWei('1500000'));

    (await this.token.methods.balanceOf(airdrop3).call())
      .should.be.equal(web3.utils.toWei('2500000'));
  });
});

const { BN, time } = require('openzeppelin-test-helpers');
const { TestHelper } = require('@openzeppelin/cli');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');
const should = require('chai').should();

ZWeb3.initialize(web3.currentProvider);
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const AlunaToken = Contracts.getFromLocal('AlunaToken');
const AlunaCrowdsale = Contracts.getFromLocal('AlunaCrowdsale');
const TokenTimelockFactory = Contracts.getFromLocal('TokenTimelockFactory');
const TokenTimelock = Contracts.getFromLocal('TokenTimelock');

contract('AlunaToken', function (
  [proxyOwner, alunaOrg, airdrop1, airdrop2, airdrop3, buyer1, buyer2, buyer3, otherAccount, rewardsPool]
) {
  const totalSupply = web3.utils.toWei('100000000');
  const usdPerETH = new BN(100);

  beforeEach(async function () {
    this.project = await TestHelper();
    this.token = await this.project.createProxy(AlunaToken, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [totalSupply, rewardsPool, 10, alunaOrg],
    });
    this.tokenTimeLockFactory = await TokenTimelockFactory.new({ from: alunaOrg });
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

  it('should distribute all tokens', async function () {
    // Create token timelocks for aluna organization
    await this.token.methods.approve(this.tokenTimeLockFactory.address, web3.utils.toWei('10000000'))
      .send({ from: alunaOrg });
    const startTime = await time.latest();
    const tokenTimelockFirstYearDeploy = await this.tokenTimeLockFactory.methods.create(
      this.token.address,
      alunaOrg,
      startTime.add(time.duration.years(1)).toString(),
      web3.utils.toWei('5000000'),
    ).send({ from: alunaOrg });
    const tokenTimelockSecondYearDeploy = await this.tokenTimeLockFactory.methods.create(
      this.token.address,
      alunaOrg,
      startTime.add(time.duration.years(2)).toString(),
      web3.utils.toWei('5000000'),
    ).send({ from: alunaOrg });

    const tokenTimelockFirstYear = await TokenTimelock.at(
      tokenTimelockFirstYearDeploy.events.TokenTimelockCreated.returnValues.newTokenTimelock
    );
    const tokenTimelockSecondYear = await TokenTimelock.at(
      tokenTimelockSecondYearDeploy.events.TokenTimelockCreated.returnValues.newTokenTimelock
    );

    // Execute token airdrop
    await this.token.methods.groupTransfer(
      [airdrop1, airdrop2, airdrop3],
      [web3.utils.toWei('1000000'), web3.utils.toWei('1500000'), web3.utils.toWei('2500000')],
    ).send({ from: alunaOrg });

    (await this.token.methods.balanceOf(alunaOrg).call())
      .should.be.equal(web3.utils.toWei('85000000'));

    // Create crowdsale one
    const maxUSDCapCrowdsalePhaseOne = new BN(500000);
    const maxCapWeiCrowdsalePhaseOne = new BN(web3.utils.toWei(maxUSDCapCrowdsalePhaseOne.div(usdPerETH)));
    const maxTokensWeiCapCrowdsalePhaseOne = new BN(web3.utils.toWei('5000000'));
    const crowdsalePhaseOne = await AlunaCrowdsale.new(
      startTime.add(time.duration.days(30)).toString(),
      startTime.add(time.duration.days(60)).toString(),
      maxTokensWeiCapCrowdsalePhaseOne.div(maxCapWeiCrowdsalePhaseOne).toString(),
      alunaOrg,
      maxCapWeiCrowdsalePhaseOne.toString(),
      this.token.address,
      { from: alunaOrg }
    );
    await this.token.methods.approve(
      crowdsalePhaseOne.address, maxTokensWeiCapCrowdsalePhaseOne.toString()
    ).send({ from: alunaOrg });

    // Execute crowdsale phase one and sell all tokens
    await time.increase(time.duration.days(31));

    await web3.eth.sendTransaction({
      from: buyer1,
      value: maxCapWeiCrowdsalePhaseOne.div(new BN(2)),
      to: crowdsalePhaseOne.address,
      gasLimit: 400000,
    });
    await web3.eth.sendTransaction({
      from: buyer2,
      value: maxCapWeiCrowdsalePhaseOne.div(new BN(4)),
      to: crowdsalePhaseOne.address,
      gasLimit: 400000,
    });
    await web3.eth.sendTransaction({
      from: buyer3,
      value: maxCapWeiCrowdsalePhaseOne.div(new BN(4)),
      to: crowdsalePhaseOne.address,
      gasLimit: '200000',
    });
    (await this.token.methods.allowance(alunaOrg, crowdsalePhaseOne.address).call())
      .should.be.equal('0');

    await time.increaseTo(startTime.add(time.duration.days(61)).toString());
    await crowdsalePhaseOne.methods.withdrawGroupTokens([buyer1, buyer2, buyer3]).send({ from: alunaOrg });
    (await this.token.methods.balanceOf(buyer1).call())
      .should.be.equal(maxTokensWeiCapCrowdsalePhaseOne.div(new BN(2)).toString());
    (await this.token.methods.balanceOf(buyer2).call())
      .should.be.equal(maxTokensWeiCapCrowdsalePhaseOne.div(new BN(4)).toString());
    (await this.token.methods.balanceOf(buyer3).call())
      .should.be.equal(maxTokensWeiCapCrowdsalePhaseOne.div(new BN(4)).toString());

    // Create crowdsale two
    const maxUSDCapCrowdsalePhaseTwo = new BN(5000000);
    const maxCapWeiCrowdsalePhaseTwo = new BN(web3.utils.toWei(maxUSDCapCrowdsalePhaseTwo.div(usdPerETH)));
    const maxTokensWeiCapCrowdsalePhaseTwo = new BN(web3.utils.toWei('25000000'));
    const rateCrowdsalePhaseTwo = maxTokensWeiCapCrowdsalePhaseTwo.div(maxCapWeiCrowdsalePhaseTwo);
    const previousTokenBalances = [
      new BN(await this.token.methods.balanceOf(buyer1).call()),
      new BN(await this.token.methods.balanceOf(buyer2).call()),
      new BN(await this.token.methods.balanceOf(buyer3).call()),
    ];
    const crowdsalePhaseTwo = await AlunaCrowdsale.new(
      startTime.add(time.duration.days(90)).toString(),
      startTime.add(time.duration.days(120)).toString(),
      rateCrowdsalePhaseTwo.toString(),
      alunaOrg,
      maxCapWeiCrowdsalePhaseTwo.toString(),
      this.token.address,
      { from: alunaOrg }
    );
    await this.token.methods.approve(
      crowdsalePhaseTwo.address, maxTokensWeiCapCrowdsalePhaseTwo.toString()
    ).send({ from: alunaOrg });

    // Execute corwdsale phase two and sell half of the token
    await time.increaseTo(startTime.add(time.duration.days(91)).toString());
    await web3.eth.sendTransaction({
      from: buyer1,
      value: maxCapWeiCrowdsalePhaseTwo.div(new BN(4)),
      to: crowdsalePhaseTwo.address,
      gasLimit: '200000',
    });
    await web3.eth.sendTransaction({
      from: buyer2,
      value: maxCapWeiCrowdsalePhaseTwo.div(new BN(4)),
      to: crowdsalePhaseTwo.address,
      gasLimit: '200000',
    });
    await web3.eth.sendTransaction({
      from: buyer3,
      value: 100,
      to: crowdsalePhaseTwo.address,
      gasLimit: '200000',
    });
    await time.increaseTo(startTime.add(time.duration.days(121)).toString());

    await crowdsalePhaseTwo.methods.withdrawGroupTokens([buyer1, buyer2, buyer3]).send({ from: alunaOrg });
    (await this.token.methods.balanceOf(buyer1).call())
      .should.be.equal(previousTokenBalances[0].add(maxTokensWeiCapCrowdsalePhaseTwo.div(new BN(4))).toString());
    (await this.token.methods.balanceOf(buyer2).call())
      .should.be.equal(previousTokenBalances[1].add(maxTokensWeiCapCrowdsalePhaseTwo.div(new BN(4))).toString());
    (await this.token.methods.balanceOf(buyer3).call())
      .should.be.equal(previousTokenBalances[2].add(rateCrowdsalePhaseTwo.mul(new BN(100))).toString());

    // Distribute remaining tokens with airdrop
    const unsoldTokens = new BN(await this.token.methods.allowance(alunaOrg, crowdsalePhaseTwo.address).call());
    const tokensSold = maxTokensWeiCapCrowdsalePhaseTwo.sub(unsoldTokens);
    const tokensPurchasedEvents = await crowdsalePhaseTwo.getPastEvents('TokensPurchased', { fromBlock: 0 });
    const buyers = tokensPurchasedEvents.map((e) => {
      const nominator = new BN(10000);
      const denominator = new BN((e.returnValues.amount / tokensSold) * nominator);
      return {
        tokensToSend: unsoldTokens.mul(denominator).div(nominator).toString(),
        beneficiary: e.returnValues.beneficiary,
      };
    });
    await this.token.methods.groupTransfer(
      buyers.map((e) => e.beneficiary), buyers.map((e) => e.tokensToSend),
    ).send({ from: alunaOrg });

    (await this.token.methods.balanceOf(alunaOrg).call())
      .should.be.equal(web3.utils.toWei('55000000'));

    // Tokens sent to rewards pool
    await this.token.methods.transfer(otherAccount, web3.utils.toWei('5000000')).send({ from: alunaOrg });

    // Tokens spent in marketing
    await this.token.methods.transfer(otherAccount, web3.utils.toWei('20000000')).send({ from: alunaOrg });

    // TODO: Add tests for rewards pool, embassador campaign and marketing
    // Tokens spent in embassador campaign
    await this.token.methods.transfer(otherAccount, web3.utils.toWei('5000000')).send({ from: alunaOrg });

    // Tokens spent in embassador token swap or user acquisition
    await this.token.methods.transfer(otherAccount, web3.utils.toWei('25000000')).send({ from: alunaOrg });

    (await this.token.methods.balanceOf(alunaOrg).call())
      .should.be.equal('0');

    // Claim token timelocks
    await time.increaseTo(startTime.add(time.duration.years(1)).toString());
    await tokenTimelockFirstYear.methods.release().send({ from: alunaOrg });
    (await this.token.methods.balanceOf(tokenTimelockFirstYear.address).call())
      .should.be.equal('0');

    await time.increaseTo(startTime.add(time.duration.years(2)).toString());
    await tokenTimelockSecondYear.methods.release().send({ from: alunaOrg });
    (await this.token.methods.balanceOf(tokenTimelockSecondYear.address).call())
      .should.be.equal('0');

    (await this.token.methods.balanceOf(alunaOrg).call())
      .should.be.equal(web3.utils.toWei('10000000'));
  });
});

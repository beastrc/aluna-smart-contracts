const { BN } = require('openzeppelin-test-helpers');
const { TestHelper } = require('@openzeppelin/cli');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');
const should = require('chai').should();

ZWeb3.initialize(web3.currentProvider);
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const AlunaToken = Contracts.getFromLocal('AlunaToken');
const RewardsPool = Contracts.getFromLocal('RewardsPool');

contract('PaymentReceiver', function ([_, proxyOwner, alunaOrg, alunaProxyOwner, tokenHolder]) {
  const totalSupply = new BN(10000);
  const paymentId = web3.utils.sha3('PaymentID');

  beforeEach(async function () {
    this.project = await TestHelper();
    this.token = await this.project.createProxy(AlunaToken, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [totalSupply.toString(), _, 10, alunaOrg],
    });
    this.rewardsProxy = await this.project.createProxy(RewardsPool, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [alunaOrg, this.token.address],
    });
    await this.token.methods.setRewardsPoolAddress(this.rewardsProxy.address).send({ from: alunaOrg });
    await this.token.methods.transfer(tokenHolder, 10000).send({ from: alunaOrg });
  });

  it('should have 100M ALN minted', async function () {
    (await this.token.methods.totalSupply().call()).should.be.equal('10000');
  });

  it('should set rewards pool percentage', async function () {
    (await this.token.methods.rewardsPoolPercentage().call()).should.be.equal('10');
    await this.token.methods.setRewardsPoolPercentage(15).send({ from: alunaOrg });
    (await this.token.methods.rewardsPoolPercentage().call()).should.be.equal('15');
  });

  it('should process a payment', async function () {
    const paymentTx = await this.token.methods.processPayment(1000, paymentId)
      .send({ from: tokenHolder });
    const paymentProcessedEvent = paymentTx.events.PaymentProcessed.returnValues;
    paymentProcessedEvent.sender.should.be.equal(tokenHolder);
    paymentProcessedEvent.value.should.be.equal('1000');
    paymentProcessedEvent.paymentId.should.be.equal(paymentId);
    (await this.token.methods.payments(paymentId).call()).value.should.be.equal('1000');
    (await this.token.methods.balanceOf(this.rewardsProxy.address).call()).should.be.equal('100');
    (await this.token.methods.balanceOf(alunaOrg).call()).should.be.equal('900');
    (await this.token.methods.balanceOf(tokenHolder).call()).should.be.equal('9000');
  });

  it('should not allow payments with already used payment id', async function () {
    await this.token.methods.processPayment(1000, paymentId)
      .send({ from: tokenHolder });
    try {
      await this.token.methods.processPayment(3000, paymentId)
        .send({ from: tokenHolder });
    } catch (e) {
      assert(e.message, 'VM Exception while processing transaction: revert PaymentProcessor: payment id already used');
    };
  });

  it('should process a payment and refund it', async function () {
    await this.token.methods.processPayment(1000, paymentId)
      .send({ from: tokenHolder });
    const refundTx = await this.token.methods.refundPayment(tokenHolder, paymentId)
      .send({ from: alunaOrg });
    (await this.token.methods.payments(paymentId).call()).value.should.be.equal('1000');
    const PaymentRefundedEvent = refundTx.events.PaymentRefunded.returnValues;
    PaymentRefundedEvent.sender.should.be.equal(tokenHolder);
    PaymentRefundedEvent.value.should.be.equal('1000');
    PaymentRefundedEvent.refunded.should.be.equal(true);
    PaymentRefundedEvent.paymentId.should.be.equal(paymentId);
    (await this.token.methods.balanceOf(this.rewardsProxy.address).call()).should.be.equal('0');
    (await this.token.methods.balanceOf(alunaOrg).call()).should.be.equal('0');
    (await this.token.methods.balanceOf(tokenHolder).call()).should.be.equal('10000');
    (await this.token.methods.payments(paymentId).call()).refunded.should.be.equal(true);
  });

  it('should not allow to refund payment twice', async function () {
    await this.token.methods.processPayment(1000, paymentId)
      .send({ from: tokenHolder });
    await this.token.methods.refundPayment(tokenHolder, paymentId)
      .send({ from: alunaOrg });
    try {
      await this.token.methods.refundPayment(tokenHolder, paymentId)
        .send({ from: alunaOrg });
    } catch (e) {
      assert(e.message, 'VM Exception while processing transaction: revert PaymentProcessor: payment already refunded');
    };
  });
});

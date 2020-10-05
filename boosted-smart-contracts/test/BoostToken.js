const {expectRevert} = require('@openzeppelin/test-helpers');
const {expect, assert} = require('chai');
const BoostToken = artifacts.require('BoostToken');

contract('BoostToken', ([governance, alice, bob, carol]) => {
  beforeEach(async () => {
    this.boost = await BoostToken.new({from: governance});
  });

  it('should have correct name, symbol, decimal, and totalSupply', async () => {
    assert.equal(await this.boost.name(), 'Boosted Finance');
    assert.equal(await this.boost.symbol(), 'BOOST');
    assert.equal(await this.boost.decimals(), '18');
    assert.equal(await this.boost.totalSupply(), 1e23);
  });

  it('should perform token transfers properly', async () => {
    await this.boost.transfer(alice, '100', {from: governance});
    await this.boost.transfer(bob, '1000', {from: governance});
    await this.boost.transfer(carol, '10', {from: alice});
    await this.boost.transfer(carol, '100', {from: bob});

    const aliceBal = await this.boost.balanceOf(alice);
    const bobBal = await this.boost.balanceOf(bob);
    const carolBal = await this.boost.balanceOf(carol);

    assert.equal(aliceBal.valueOf(), '90');
    assert.equal(bobBal.valueOf(), '900');
    assert.equal(carolBal.valueOf(), '110');
  });

  it('should fail if you try to do bad transfers', async () => {
    await this.boost.transfer(alice, '100', {from: governance});
    await expectRevert(this.boost.transfer(carol, '110', {from: alice}), 'ERC20: transfer amount exceeds balance');
    await expectRevert(this.boost.transfer(carol, '1', {from: bob}), 'ERC20: transfer amount exceeds balance');
  });

  it('should burn tokens', async () => {
    await this.boost.transfer(alice, '1000', {from: governance});
    await this.boost.transfer(bob, '1100', {from: governance});
    await this.boost.transfer(carol, '500', {from: governance});
    await this.boost.burn('500', {from: alice});
    await this.boost.burn('100', {from: bob});
    await this.boost.burn('400', {from: carol});

    const totalSupply = await this.boost.totalSupply();
    const aliceBal = await this.boost.balanceOf(alice);
    const bobBal = await this.boost.balanceOf(bob);
    const carolBal = await this.boost.balanceOf(carol);

    assert.equal(totalSupply.toString(), (1e23 - 500 - 100 - 400).valueOf());
    assert.equal(aliceBal.valueOf(), '500');
    assert.equal(bobBal.valueOf(), '1000');
    assert.equal(carolBal.valueOf(), '100');
  });

  it('should not allow burning exceeding total balance of user ', async () => {
    await this.boost.transfer(alice, '1000', {from: governance});
    await this.boost.transfer(bob, '1100', {from: governance});
    await this.boost.transfer(carol, '500', {from: governance});

    await expectRevert(this.boost.burn('1001', {from: alice}), 'ERC20: burn amount exceeds balance');
    await expectRevert(this.boost.burn('1101', {from: bob}), 'ERC20: burn amount exceeds balance');
    await expectRevert(this.boost.burn('501', {from: carol}), 'ERC20: burn amount exceeds balance');
  });
});

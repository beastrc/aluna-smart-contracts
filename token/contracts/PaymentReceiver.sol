pragma solidity 0.5.6;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./RewardsPool.sol";

contract PaymentReceiver is ERC20, Ownable {

    struct Payment {
        uint256 value;
        uint256 poolFee;
        bool refunded;
    }

    mapping(bytes32 => Payment) public payments;

    address public rewardsPoolAddress;

    uint256 public rewardsPoolPercentage;

    /**
      * @dev Payment Event To Rewards Pool
      * @param sender The address who is making the payment
      * @param value ALN token amount
      * @param paymentId payment ID
    */
    event PaymentProcessed(address sender, uint256 value, bytes32 indexed paymentId);

    /**
      * @dev Refund Payment Event To Sender
      * @param sender The address who is making the payment
      * @param value ALN token amount
      * @param paymentId payment ID
    */
    event PaymentRefunded(address sender, uint256 value, bool refunded, bytes32 indexed paymentId);

    /**
      * @dev Set rewards pool percentage share of payments
      * @param _rewardsPoolPercentage new percentage share
    */
    function setRewardsPoolPercentage(uint256 _rewardsPoolPercentage) external onlyOwner {
        _setRewardsPoolPercentage(_rewardsPoolPercentage);
    }

    /**
      * @dev Set rewards pool address
      * @param _rewardsPoolAddress new rewards pool address
    */
    function setRewardsPoolAddress(address _rewardsPoolAddress) external onlyOwner {
        _setRewardsPoolAddress(_rewardsPoolAddress);
    }

    /**
    * @dev Withdraws the ALN balance of the sender to the owner adddress,
    * and sends a percentage to the Rewards Pool.
    * Assumes percentages are whole numbers, 5 would be 5%.
    * Converts rewards pool percentage to amount and subtracts from total amount.
    * Emits `PaymentProcessed` when the payment is processed succesfully
    * @param _value amount ALN tokens to transfer.
    * @param _paymentId id of the payment provided by Aluna.
    */
    function processPayment(uint256 _value, bytes32 _paymentId) external {
        require(_value != 0, "PaymentProcessor: non-positive payment value");
        require(_paymentId != 0x0, "PaymentProcessor: invalid payment id");
        require(payments[_paymentId].value == 0, "PaymentProcessor: payment id already used");
        uint256 _rewardsPoolAmount = (_value.mul(rewardsPoolPercentage)).div(100);
        uint256 _remainingAmount = _value.sub(_rewardsPoolAmount);
        _transfer(msg.sender, owner(), _remainingAmount);
        _approve(msg.sender, rewardsPoolAddress, _rewardsPoolAmount);
        payments[_paymentId] = Payment(_value, _rewardsPoolAmount, false);
        RewardsPool(rewardsPoolAddress).deposit(msg.sender, _rewardsPoolAmount);
        emit PaymentProcessed(msg.sender, _value, _paymentId);
    }

    /**
    * @dev Refunds total or partial balance of a payment
    * Assumes percentages are whole numbers, 5 would be 5%.
    * Emits `PaymentRefunded` when the payment is refunded succesfully
    * @param _sender the sender of the payment to be refunded
    * @param _paymentId id of the payment provided by Aluna.
    */
    function refundPayment(address _sender, bytes32 _paymentId) external onlyOwner {
        require(!payments[_paymentId].refunded, "PaymentProcessor: payment already refunded");
        uint256 value_to_refund = payments[_paymentId].value;
        _transfer(owner(), _sender, payments[_paymentId].value.sub(payments[_paymentId].poolFee));
        _transfer(rewardsPoolAddress, _sender, payments[_paymentId].poolFee);
        payments[_paymentId].refunded = true;
        emit PaymentRefunded(_sender, value_to_refund, payments[_paymentId].refunded, _paymentId);
    }

    /**
      * @dev Set rewards pool percentage share of payments
      * @param _rewardsPoolPercentage new percentage share
    */
    function _setRewardsPoolPercentage(uint256 _rewardsPoolPercentage) internal {
        require(_rewardsPoolPercentage <= 100, "PaymentProcessor: rewards pool percentage is not 100 or lower");
        rewardsPoolPercentage = _rewardsPoolPercentage;
    }

    /**
      * @dev Set rewards pool address
      * @param _rewardsPoolAddress new rewards pool address
    */
    function _setRewardsPoolAddress(address _rewardsPoolAddress) internal {
        require(_rewardsPoolAddress != address(0), "PaymentProcessor: invalid rewards pool address");
        rewardsPoolAddress = _rewardsPoolAddress;
    }

}

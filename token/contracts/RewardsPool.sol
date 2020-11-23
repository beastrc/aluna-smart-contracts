pragma solidity 0.5.6;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract RewardsPool is Initializable, Ownable {
    using SafeMath for uint256;

    IERC20 public tokenALN;

    /**
      * @dev Rewards Pool Deposit Complete Event
      * @param sender The address who is making the payment
      * @param amount ALN token amount
    */
    event DepositComplete(address indexed sender, uint256 amount);

    /**
      * @dev Rewards Pool Withdrawal Complete Event
      * @param receiver The address of teh reward receiver
      * @param amount The value of the reward
    */
    event RewardComplete(address indexed receiver, uint256 amount);

    /**
      * ZeppelinOS Initializer Function
      * @param _tokenAddress address of ALN token
      * @param _owner contract owner
    */
    function initialize(address _owner, address _tokenAddress) public initializer {
        tokenALN = IERC20(_tokenAddress);
        _transferOwnership(_owner);
    }

    /**
     * @dev Deposits ALN tokens in Rewards Pool
     * @param from The address of the sender
     * @param value Amount of tokens
    */
    function deposit(address from, uint256 value) external {
        tokenALN.transferFrom(from, address(this), value);
        emit DepositComplete(from, value);
    }

    /**
     * @dev Send the rewards for a group of addresses
     * @param receivers The addresses of the rewards receivers
     * @param values The value in tokens to be sent to each receiver
    */
    function sendRewards(address[] memory receivers, uint256[] memory values) external onlyOwner {
        require(receivers.length == values.length, "RewardsPool: Invalid length of receivers and values");
        for (uint i = 0; i < receivers.length; i++) {
            tokenALN.transfer(receivers[i], values[i]);
            emit RewardComplete(receivers[i], values[i]);
        }
    }
}

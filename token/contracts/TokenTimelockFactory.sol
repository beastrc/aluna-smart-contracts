pragma solidity ^0.5.6;

import "@openzeppelin/contracts/token/ERC20/TokenTimelock.sol";

/**
 * @title TokenTimelockFactory
 * @dev Create token timelock contracts for ERC20 tokens
 */
contract TokenTimelockFactory {

    event TokenTimelockCreated(address newTokenTimelock, uint256 value);

    /**
    * @dev Creates a TokenTimelock contract for an ERC20 token, if value is higher than 0
    * used approved balance to this contract to fund the token timelock
    * @param token The ERC20 token to be sent to the timelock contract
    * @param value The value of tokens to be sent to the token timelock contract
    */
    function create(
        IERC20 token, address beneficiary, uint256 releaseTime, uint256 value
    ) public {
        TokenTimelock newTokenTimelock = new TokenTimelock(token, beneficiary, releaseTime);
        if (value > 0) {
            token.transferFrom(msg.sender, address(newTokenTimelock), value);
        }
        emit TokenTimelockCreated(address(newTokenTimelock), value);
    }

}

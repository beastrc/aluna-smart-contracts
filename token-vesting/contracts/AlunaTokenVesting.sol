pragma solidity ^0.6.12;
import "@openzeppelin/contracts-ethereum-package/contracts/drafts/TokenVesting.sol";

contract AlunaTokenVesting is TokenVestingUpgradeSafe {

    function init(address beneficiary, uint256 start, uint256 cliffDuration, uint256 duration, bool revocable) public initializer {
        __TokenVesting_init(beneficiary, start, cliffDuration, duration, revocable);
        
    }
}

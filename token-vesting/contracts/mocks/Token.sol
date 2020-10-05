pragma solidity ^0.6.1;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";


contract Token is ERC20UpgradeSafe {
    
    
    constructor () public ERC20UpgradeSafe( ) {
        __ERC20_init("ALUNA", "ALN");
    }

    //ownable
    function mint(address _to , uint256 _amount) public {
        _mint(_to, _amount);
    }
}
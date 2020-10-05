pragma solidity ^0.6.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Token is ERC20 {
    
    
    constructor (string memory _name, string memory _symbol, uint8 _decimals) public ERC20( _name, _symbol) {
        _mint(msg.sender , 10**(50 + 18));
        _setupDecimals(_decimals);
    }
}
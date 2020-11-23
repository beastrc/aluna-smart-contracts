pragma solidity 0.5.6;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "./PaymentReceiver.sol";

/**
 * @title AlunaToken
 * @dev The utility token at the heart of the Aluna ecosystem
 */
contract AlunaToken is PaymentReceiver, Initializable {

    // ERC20Detailed public variables
    string public name;
    string public symbol;
    uint8 public decimals;

    /**
      * ZeppelinOS Initializer Function
      * @param _totalSupply The total supply of the tokens
      * @param _rewardsPoolAddress address of Rewards Pool contract
      * @param _rewardsPoolPercentage percentage to be taken from payments and sent to rewards pool
      * @param _owner contract owner
    */
    function initialize(
        uint256 _totalSupply,
        address _rewardsPoolAddress,
        uint256 _rewardsPoolPercentage,
        address _owner
    ) public initializer {
        name = "AlunaToken";
        symbol = "ALN";
        decimals = 18;
        _mint(_owner, _totalSupply);
        _setRewardsPoolPercentage(_rewardsPoolPercentage);
        _setRewardsPoolAddress(_rewardsPoolAddress);
        _transferOwnership(_owner);
    }

    /**
    * @dev Function that allows the owner to execute multiple transfers in one transaction
    * It receives two arrays, recipients and values, the recipient[i] will receive values[i]
    * The tokens are transfered form the owner address
    * @param recipients An array of address of the token recipients
    * @param values An array of uint256 of value sent to each recipient
    */
    function groupTransfer(address[] memory recipients, uint256[] memory values) public onlyOwner {
        require(recipients.length == values.length, "AlunaToken: Invalid length of recipients and values");
        for (uint i = 0; i < recipients.length; i++) {
            _transfer(msg.sender, recipients[i], values[i]);
        }
    }

}

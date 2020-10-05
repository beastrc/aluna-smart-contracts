pragma solidity ^0.5.6;

import "@openzeppelin/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/distribution/PostDeliveryCrowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title AlunaCrowdsale
 * The Aluna crowdsale contract will recieve eth and give ALN tokens in exchange,
 * it doesnt have a minimun goal but it has a maximun goal of ETH to be raised,
 * the tokens will be distirbuted after the closingTime.
 */
contract AlunaCrowdsale is AllowanceCrowdsale, CappedCrowdsale, PostDeliveryCrowdsale {

    /**
    * @dev Constructor
    * @param openingTime The timestamp in senconds of when the crowdsale will start
    * @param closingTime The timestamp in senconds of when the crowdsale will end
    * @param rate The token sale rate to be used by the crowdsale
    * @param wallet The address of the account or contract that will receive the funds
    * @param cap The maximun of ETH to be raised in the crowdsale
    * @param token The address of the token to be sold
    */
    constructor (
        uint256 openingTime,
        uint256 closingTime,
        uint256 rate,
        address payable wallet,
        uint256 cap,
        IERC20 token
    )
        public
        Crowdsale(rate, wallet, token)
        AllowanceCrowdsale(wallet)
        CappedCrowdsale(cap)
        TimedCrowdsale(openingTime, closingTime)
    {
      // solhint-disable-previous-line no-empty-blocks
    }

    /**
    * @dev Function that allows the owner to execute multiple withdraws of the tokens sold to buyers
    * @param beneficiaries An array of address of the token recipients
    */
    function withdrawGroupTokens(address[] memory beneficiaries) public {
        for (uint i = 0; i < beneficiaries.length; i++) {
            withdrawTokens(beneficiaries[i]);
        }
    }
}

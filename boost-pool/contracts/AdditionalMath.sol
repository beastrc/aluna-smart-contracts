
pragma solidity ^0.6.1;

/*
#    Copyright (C) 2017  alianse777
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#    https://github.com/alianse777/solidity-standard-library.git
*/

import "@openzeppelin/contracts/math/SafeMath.sol";

library AdditionalMath {

    using SafeMath for uint256;

   /**
    * @dev Compute square root of x
    * @param x num to sqrt
    * @return sqrt(x)
    */
   function sqrt(uint x) internal pure returns (uint){
       uint n = x / 2;
       uint lstX = 0;
       while (n != lstX){
           lstX = n;
           n = (n + x/n) / 2; 
       }
       return uint(n);
   }

   /// Imported from: https://forum.openzeppelin.com/t/does-safemath-library-need-a-safe-power-function/871/7
   /// Modified so that it takes in 3 arguments for base
   /// @return a * (b / c)^exponent 
   function pow(uint256 a, uint256 b, uint256 c, uint256 exponent) internal pure returns (uint256) {
        if (exponent == 0) {
            return a;
        }
        else if (exponent == 1) {
            return a.mul(b).div(c);
        }
        else if (a == 0 && exponent != 0) {
            return 0;
        }
        else {
            uint256 z = a.mul(b).div(c);
            for (uint256 i = 1; i < exponent; i++)
                z = z.mul(b).div(c);
            return z;
        }
    }
}
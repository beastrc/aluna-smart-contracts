module.exports = {
  homestead: {
    gov: {
      newOwner:"0xFDfdc90bb26240aca0eE8829A607E2f89Fe428EB", // ALN TREASURY
      boostToken:"0x8185bc4757572da2a610f887561c32298f1a5748", // ALN TOKEN
      alunaTokenAddress: "0x8185bc4757572da2a610f887561c32298f1a5748", // ALN TOKEN
      treasuryContract:"0x3a3235949A22b5C0Bb42A42FD225a5FE7D18Ef52",
      stableCoin: "0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8",
      gov: "0xa97707C0687C05DF7909597B22B5E1A12FF3d490"
    },
    pools:{
      ALN_ETHPool:{ 
        stakeTokenName: "UNI-ETH-ALN",
        stakeTokenAdress: "0xdc3f6f4c00b55f56d5ef6293b762c6483af24a82",
        cap: "200000000000000000000", // about 20.000 USD limit for first 24 hours
        rewardTokenAddress: "0x8185bc4757572da2a610f887561c32298f1a5748",
        start: "1616673600", // Thu Mar 25 2021 12:00:00 GMT+0000
        duration:"7257600", // 12 weeks
        rewardAmount:"250000000000000000000000", // 250K Aluna

        // pool deployed
        deployedAddress: '0x99a86705DA25A6d13A06f713871a8BBB8292c1b8'
      }
    }    
  },
  kovan: {
    gov: {
      newOwner: '0xA8950F8C30595bE20A279b4F2ca54d140128AB1D', // aluna deployer

      boostToken: '0xdbd2Ab43e210587a5baE17BBd82650796C480f3a',        // ALN
      alunaTokenAddress: '0xdbd2Ab43e210587a5baE17BBd82650796C480f3a', // ALN
      stableCoin: '0x834556CeC62ee21e4c9C318A22FA0d0F7DbBcD1e',

      treasuryContract: '0x6cFE3e66eFAe6C30A93a8B4eDA720FEb34d8c63b',
      gov: '0x0b5597B2D28407c67045040CBe8bf7c7C15b2a84'
    },
    pools:{
      ALN_ETHPool:{ 
        stakeTokenName: "UNI-ETH-ALN",
        stakeTokenAdress: "0xdc3f6f4c00b55f56d5ef6293b762c6483af24a82",
        cap: "200000000000000000000", // about 20.000 USD limit for first 24 hours
        rewardTokenAddress: "0x8185bc4757572da2a610f887561c32298f1a5748",
        start: "1616673600", // Thu Mar 25 2021 12:00:00 GMT+0000
        duration:"7257600", // 12 weeks
        rewardAmount:"250000000000000000000000", // 250K Aluna

        // pool deployed
        deployedAddress: '0x99a86705DA25A6d13A06f713871a8BBB8292c1b8'
      },

      ALN:{ 
        stakeTokenName: "ALN",
        stakeTokenAdress: "0xdbd2Ab43e210587a5baE17BBd82650796C480f3a", // ALN
        cap: "10000000000000000000000", // limit for first 24 hours = 10K ALN, atm it's about 5.000 USD 
        rewardTokenAddress: "0xdbd2Ab43e210587a5baE17BBd82650796C480f3a",  // ALN
        start: "1617973200", // Thu Apr 08 2021 12:00:00 GMT+0000
        duration:"259200", // 3 days
        rewardAmount:"30000000000000000000000", // 30K Aluna

        // pool deployed
        deployedAddress: '0xE15C4c314b34BF72b0cB34D81492416Cf08b3960'
      }
    }    
  }  
} 

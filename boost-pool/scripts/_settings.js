module.exports = {
  homestead: {
    gov: {
      newOwner:"0xFDfdc90bb26240aca0eE8829A607E2f89Fe428EB", // ALN TREASURY
      boostToken:"0x3e780920601D61cEdb860fe9c4a90c9EA6A35E78",
      alunaTokenAddress: "0x8185bc4757572da2a610f887561c32298f1a5748",
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
      // ,
      // UNIPool:{ 
      //   stakeTokenName: "UNI-ALN-LP",
      //   stakeTokenAdress: "0xffb4893f44cdfcc1da93aa5a625b249c0b14452a",
      //   cap: "1000000000000000000000",
      //   rewardTokenAddress: "0x2cC98Ccee440Fb3fcD508761e5B2C29E17D4C737",
      //   start: "1603193128",
      //   duration:"360000",
      //   rewardAmount:"100000000000000000000"
      // },
      // UNIPool1:{ 
      //   stakeTokenName: "UNI-ALN-BOOST",
      //   stakeTokenAdress: "0x0bf121341276f717eb7b3dbc888e3f4e45a3dd0e",
      //   cap: "1000000000000000000000",
      //   rewardTokenAddress: "0x2cC98Ccee440Fb3fcD508761e5B2C29E17D4C737",
      //   start: "1603193128",
      //   duration:"360000",
      //   rewardAmount:"100000000000000000000"
      // },
      // BAL:{ 
      //   stakeTokenName: "BAL-ALN-WETH",
      //   stakeTokenAdress: "0x11d645e228bc87b2d208dcfe8a90b787de410d2d",
      //   cap: "1000000000000000000000",
      //   rewardTokenAddress: "0x2cC98Ccee440Fb3fcD508761e5B2C29E17D4C737",
      //   start: "1603193128",
      //   duration:"360000",
      //   rewardAmount:"100000000000000000000"
      // }
    }    
  }  
} 

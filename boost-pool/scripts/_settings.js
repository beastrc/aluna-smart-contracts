module.exports = {
  kovan: {
    gov: {
      newOwner:"0x3Ed68019F385A51FA92E6e1009C4Afa2e4Cc3e1F",
      boostToken:"0x0270d94f776F479306C6c44CF91aA24477C85772",
      alunaTokenAddress: "0x2cC98Ccee440Fb3fcD508761e5B2C29E17D4C737",
      treasuryContract:"0xE87Ccd23a6Ab1E2473180c0541ad8A526eefDe93",
      stableCoin: "0xf074878753c56A5B442146565675c4AB6E93AC8D",
    },    
    pools:{
      ALNPool:{ 
        stakeTokenName: "ALN",
        stakeTokenAdress: "0x2cC98Ccee440Fb3fcD508761e5B2C29E17D4C737",
        cap: "1000000000000000000000",
        rewardTokenAddress: "0x2cC98Ccee440Fb3fcD508761e5B2C29E17D4C737",
        start: "1602892943",
        duration:"360",
        rewardAmount:"100000000000000000000"
      },
      UNIPool:{ 
        stakeTokenName: "UNI-ALN-LP",
        stakeTokenAdress: "0xffb4893f44cdfcc1da93aa5a625b249c0b14452a",
        cap: "1000000000000000000000",
        rewardTokenAddress: "0x2cC98Ccee440Fb3fcD508761e5B2C29E17D4C737",
        start: "1603193128",
        duration:"360000",
        rewardAmount:"100000000000000000000"
      },
      UNIPool1:{ 
        stakeTokenName: "UNI-ALN-BOOST",
        stakeTokenAdress: "0x0bf121341276f717eb7b3dbc888e3f4e45a3dd0e",
        cap: "1000000000000000000000",
        rewardTokenAddress: "0x2cC98Ccee440Fb3fcD508761e5B2C29E17D4C737",
        start: "1603193128",
        duration:"360000",
        rewardAmount:"100000000000000000000"
      },
      BAL:{ 
        stakeTokenName: "BAL-ALN-WETH",
        stakeTokenAdress: "0x11d645e228bc87b2d208dcfe8a90b787de410d2d",
        cap: "1000000000000000000000",
        rewardTokenAddress: "0x2cC98Ccee440Fb3fcD508761e5B2C29E17D4C737",
        start: "1603193128",
        duration:"360000",
        rewardAmount:"100000000000000000000"
      }
    }    
  }  
} 

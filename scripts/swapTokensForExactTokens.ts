import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    const amountOut = ethers.parseUnits("20", 18);
    const amountInMax = ethers.parseUnits("1000", 6);

    const USDC_Contract = await ethers.getContractAt("IERC20", USDC, impersonatedSigner);
    const DAI_Contract = await ethers.getContractAt("IERC20", DAI);
    
    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    await USDC_Contract.approve(ROUTER, amountOut);

    const usdcBal = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const daiBal = await DAI_Contract.balanceOf(impersonatedSigner.address);
    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    console.log("usdc balance before swap", Number(usdcBal));
    console.log("dai balance before swap", Number(daiBal));

    await ROUTER.swapTokensForExactTokens(
        amountOut,
        amountInMax,
        [USDC, DAI],
        impersonatedSigner.address,
        deadline
    );

    const usdcBalAfter = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const daiBalAfter = await DAI_Contract.balanceOf(impersonatedSigner.address);

    console.log("=========================================================");

    console.log("usdc balance after swap", Number(usdcBalAfter));
    console.log("dai balance after swap", Number(daiBalAfter));

    console.log("////////////////////////////////////////////////////////");
    console.log("ADDING LIQUIDITY");
    console.log("////////////////////////////////////////////////////////");

    // TOKEN A IS USDC (6 decimals), TOKEN B IS DAI (18 decimals)
    const amountADesired = ethers.parseUnits("20", 6); // USDC is 6 decimals
    const amountBDesired = ethers.parseUnits("20", 18); // DAI is 18 decimals

    // Define slippage tolerance (e.g., 1% slippage)
    const amountAMin = ethers.parseUnits("19.8", 6); 
    const amountBMin = ethers.parseUnits("19.8", 18); 

    // `to` is the address that will receive the liquidity tokens
    const to = impersonatedSigner.address;

    const usdcBalBefore = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const daiBalBefore = await DAI_Contract.balanceOf(impersonatedSigner.address);

    console.log("usdc balance before adding liquidity", Number(usdcBalBefore));
    console.log("dai balance before adding liquidity", Number(daiBalBefore));

    // Check balances before adding liquidity
    const usdcNewBal = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const daiNewBal = await DAI_Contract.balanceOf(impersonatedSigner.address);
    const newDeadline = Math.floor(Date.now() / 1000) + (60 * 10); 

    console.log("========================================================")
    console.log("usdc balance after adding liquidity", Number(usdcNewBal));
    console.log("dai balance after adding liquidity", Number(daiNewBal));

    // Add liquidity to the pool
    await ROUTER.addLiquidity(
        USDC,
        DAI,
        amountADesired, // Desired amount of USDC
        amountBDesired, // Desired amount of DAI
        amountAMin,     // Minimum acceptable amount of USDC (with slippage tolerance)
        amountBMin,     // Minimum acceptable amount of DAI (with slippage tolerance)
        to,             // Address that will receive the LP tokens
        newDeadline     // Transaction deadline
    );

    console.log("Liquidity added successfully.");



    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

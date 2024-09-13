import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

    // Impersonating the account
    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    const USDC_Contract = await ethers.getContractAt("IERC20", USDC, impersonatedSigner);
    const DAI_Contract = await ethers.getContractAt("IERC20", DAI);
    
    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    // Check balances before adding liquidity
    const USDCBalBefore = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const daiBalBefore = await DAI_Contract.balanceOf(impersonatedSigner.address);

    console.log("USDC balance before adding liquidity:", Number(USDCBalBefore));
    console.log("DAI balance before adding liquidity:", Number(daiBalBefore));

    // Approving the Uniswap Router to spend tokens on behalf of the impersonated account
    const amountADesired = ethers.parseUnits("4", 6); // USDC is 6 decimals
    const amountBDesired = ethers.parseUnits("2", 18); // DAI is 18 decimals

    await USDC_Contract.approve(ROUTER_ADDRESS, amountADesired);
    await DAI_Contract.approve(ROUTER_ADDRESS, amountBDesired);

    // Define slippage tolerance (e.g., 1% slippage)
    const amountAMin = ethers.parseUnits("2", 6); // 1% less than desired
    const amountBMin = ethers.parseUnits("1", 18); // 1% less than desired

    // Address to receive LP tokens
    const to = impersonatedSigner.address;

    // Set transaction deadline
    const newDeadline = Math.floor(Date.now() / 1000) + (60 * 10); // 10 minutes from now

    // Add liquidity to the pool
    await ROUTER.addLiquidity(
        USDC,
        DAI,
        amountADesired, 
        amountBDesired, // Desired amount of DAI
        amountAMin,     // Minimum acceptable amount of USDC (with slippage tolerance)
        amountBMin,     // Minimum acceptable amount of DAI (with slippage tolerance)
        to,             // Address that will receive the LP tokens
        newDeadline     // Transaction deadline
    );

    // Check balances after adding liquidity
    const USDCBalAfter = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const daiBalAfter = await DAI_Contract.balanceOf(impersonatedSigner.address);

    console.log("=========================================================");
    console.log("USDC balance after adding liquidity:", Number(USDCBalAfter));
    console.log("DAI balance after adding liquidity:", Number(daiBalAfter));

    console.log("Liquidity added successfully.");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

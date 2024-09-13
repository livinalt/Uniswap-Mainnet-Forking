import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const LIDO = "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32";
    const PEPE = "0x6982508145454Ce325dDbE47a25d4ec3d2311933";

    const TOKEN_HOLDER = "0xF977814e90dA44bFA03b6295A0616a897441aceC";

    // Impersonating the account
    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    const LIDO_Contract = await ethers.getContractAt("IERC20", LIDO, impersonatedSigner);
    const PEPE_Contract = await ethers.getContractAt("IERC20", PEPE, impersonatedSigner);
    
    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    // Check balances before adding liquidity
    const LIDOBalBefore = await LIDO_Contract.balanceOf(impersonatedSigner.address);
    const PEPEBalBefore = await PEPE_Contract.balanceOf(impersonatedSigner.address);

    console.log("LIDO balance before adding liquidity:", Number(LIDOBalBefore));
    console.log("PEPE balance before adding liquidity:", Number(PEPEBalBefore));

    // Approving the Uniswap Router to spend tokens on behalf of the impersonated account
    const amountADesired = ethers.parseUnits("4", 18); // LIDO is 6 decimals
    const amountBDesired = ethers.parseUnits("2", 18); // PEPE is 18 decimals

    await LIDO_Contract.approve(ROUTER_ADDRESS, amountADesired);
    await PEPE_Contract.approve(ROUTER_ADDRESS, amountBDesired);

    // Define slippage tolerance (e.g., 1% slippage)
    const amountAMin = ethers.parseUnits("1", 18); // 1% less than desired
    const amountBMin = ethers.parseUnits("1", 18); // 1% less than desired

    // Address to receive LP tokens
    const to = impersonatedSigner.address;

    // Set transaction deadline
    const newDeadline = Math.floor(Date.now() / 1000) + (60 * 10); // 10 minutes from now

    // Add liquidity to the pool
    await ROUTER.addLiquidity(
        LIDO, // token A
        PEPE, // token B
        amountADesired, 
        amountBDesired, // Desired amount of PEPE
        amountAMin,     // Minimum acceptable amount of LIDO (with slippage tolerance)
        amountBMin,     // Minimum acceptable amount of PEPE (with slippage tolerance)
        to,             // Address that will receive the LP tokens
        newDeadline     // Transaction deadline
    );

    // Check balances after adding liquidity
    const LIDOBalAfter = await LIDO_Contract.balanceOf(impersonatedSigner.address);
    const PEPEBalAfter = await PEPE_Contract.balanceOf(impersonatedSigner.address);

    console.log("=========================================================");
    console.log("LIDO balance after adding liquidity:", Number(LIDOBalAfter));
    console.log("PEPE balance after adding liquidity:", Number(PEPEBalAfter));

    console.log("Liquidity added successfully.");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

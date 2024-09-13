# Uniswap-Mainnet-Forking

This demonstrates how to perform a token swap on the Uniswap V2 protocol using Hardhat's mainnet forking feature. The script interacts with two tokens, USDC and DAI, using the Uniswap V2 Router to swap tokens on the Ethereum mainnet in a simulated local environment.

## Project Structure

- `contracts/` : Contains the interfaces for interacting with ERC20 tokens and Uniswap V2 Router.
- `scripts/`: Contains the mainnet forking script to perform token swaps.
- `hardhat.config.js`: Hardhat configuration file for the project.

## Prerequisites

Ensure you have the following installed:

- Node.js (v14.x or later)
- NPM or Yarn
- Hardhat

## Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/livinalt/Uniswap-Mainnet-Forking

   cd Uniswap-Mainnet-Forking
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

   Or if you're using Yarn:

   ```bash
   yarn install
   ```

3. Set up your `.env` file to include the following environment variables:

   ```bash
   ALCHEMY_API_KEY=<your-alchemy-api-key>
   ```

   You can obtain an API key from [Alchemy](https://www.alchemy.com/).

## Commands

### Run the Mainnet Forking Script

To execute the token swap script with Hardhat's mainnet forking, follow the following steps:

1. split your terminal
2. On one terminal run `npx hardhat node`. 
This command starts a local Ethereum node, allowing you to test smart contracts and scripts.

3. On the second split run 

```bash
npx hardhat --network localhost run ./scripts/swapTokensForExactTokens.ts
```

This command forks the Ethereum mainnet locally, impersonates a token holder account, and performs a token swap on Uniswap V2 using the `swapTokensForExactTokens` function.


## Script Overview

- The script forks the Ethereum mainnet and impersonates an account holding a large amount of USDC.
- It swaps USDC for DAI using Uniswap V2 Router's `swapTokensForExactTokens` function.
- The script prints the USDC and DAI balances before and after the swap to the console.

## Notes

- This example demonstrates token swapping on a simulated mainnet environment. The script uses a fork of the Ethereum mainnet, so no real tokens are at risk.
- The token holder's address, Uniswap router address, and contract addresses are set to Ethereum mainnet values.

## License

This project is licensed under the MIT License.

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  console.log("Deploying DeSciData contract...");

  // Deploy the DeSciData contract
  const DeSciData = await hre.ethers.getContractFactory("DeSciData");
  const desciData = await DeSciData.deploy();

  await desciData.waitForDeployment();

  const address = await desciData.getAddress();
  console.log(`DeSciData deployed to: ${address}`);

  // Log deployment details for verification
  console.log(`
To verify the contract on Etherscan:
npx hardhat verify --network ${hre.network.name} ${address}
  `);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

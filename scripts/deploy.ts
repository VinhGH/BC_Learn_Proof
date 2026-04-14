import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
// __dirname is globally available in CommonJS output


async function main() {
  console.log("🚀 Starting deployment of LearnProofCertificate...");

  // Get the default admin address from the deployer wallet
  const [deployer] = await ethers.getSigners();
  console.log(`📡 Deploying with account: ${deployer.address}`);

  // Deploy the contract
  const LearnProofCertificate = await ethers.getContractFactory("LearnProofCertificate");
  const contract = await LearnProofCertificate.deploy(deployer.address);

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`✅ LearnProofCertificate deployed to: ${contractAddress}`);

  // Save the address to a local file for the sync script to pick up
  const deployInfo = {
    address: contractAddress,
    network: (await ethers.provider.getNetwork()).name,
    deployer: deployer.address,
    deployedAt: new Date().toISOString()
  };

  const outputPath = path.join(__dirname, "deployed-address.json");
  fs.writeFileSync(outputPath, JSON.stringify(deployInfo, null, 2));
  console.log(`💾 Deployment info saved to: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

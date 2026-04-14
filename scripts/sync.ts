import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log("Starting artifact synchronization...");

  // Assume the user has compiled the contracts (`npx hardhat compile`)
  const artifactPath = path.join(__dirname, '../artifacts/contracts/LearnProofCertificate.sol/LearnProofCertificate.json');
  
  if (!fs.existsSync(artifactPath)) {
    console.error("❌ Artifact not found. Please run 'npx hardhat compile' first.");
    process.exit(1);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const dataToExport = {
    abi: artifact.abi,
    // Add deployed address manually if needed later, or read from a deployed network file
    // address: "0x..." 
  };

  const fileContent = JSON.stringify(dataToExport, null, 2);

  // Targets
  const beTargetDir = path.join(__dirname, '../../BE_Learn_Proof/src/shared/blockchain');
  const feTargetDir = path.join(__dirname, '../../FE_Learn_Proof/src/shared/blockchain');

  [beTargetDir, feTargetDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
    const targetFile = path.join(dir, 'LearnProofCertificate.json');
    fs.writeFileSync(targetFile, fileContent);
    console.log(`✅ Synced ABI to: ${targetFile}`);
  });

  console.log("🎉 Synchronization complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

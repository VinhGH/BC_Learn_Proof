import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('-------------------------------------------');
  console.log('Wallet Address:', deployer.address);
  console.log('Balance:', ethers.formatEther(balance), 'MATIC');
  console.log('-------------------------------------------');
  
  if (balance === 0n) {
    console.warn("⚠️ CẢNH BÁO: Số dư ví của bạn đang là 0 MATIC.");
    console.warn("Bạn cần lấy MATIC miễn phí (Faucet) để có thể deploy được.");
    console.warn("Link Faucet: https://faucet.polygon.technology/");
  } else {
    console.log("✅ Ví của bạn đã sẵn sàng để deploy!");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

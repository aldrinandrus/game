import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Profile = await ethers.getContractFactory("ProfileNFT");
  const profile = await Profile.deploy();
  await profile.waitForDeployment();
  console.log("ProfileNFT:", await profile.getAddress());

  const Badge = await ethers.getContractFactory("BadgeNFT");
  const badge = await Badge.deploy("https://metadata.synqtra.xyz/{id}.json");
  await badge.waitForDeployment();
  console.log("BadgeNFT:", await badge.getAddress());

  const Challenge = await ethers.getContractFactory("Challenge");
  const challenge = await Challenge.deploy();
  await challenge.waitForDeployment();
  console.log("Challenge:", await challenge.getAddress());

  const Leaderboard = await ethers.getContractFactory("Leaderboard");
  const leaderboard = await Leaderboard.deploy();
  await leaderboard.waitForDeployment();
  console.log("Leaderboard:", await leaderboard.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@ethereum-waffle/provider";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { LuckyDraw, MockUSDT } from "../typechain-types";

describe("Concurrent Players", function () {
  async function deployWithPlayers() {
    const [owner, ...players] = await ethers.getSigners();
    const playerCount = 5; // Test with 5 concurrent players
    
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const usdt = await MockUSDT.deploy();
    
    const LuckyDraw = await ethers.getContractFactory("LuckyDraw");
    const luckyDraw = await LuckyDraw.deploy(usdt.address);
    
    // Setup initial balances and approvals
    const initialBalance = ethers.utils.parseUnits("1000", 6);
    for (let i = 0; i < playerCount; i++) {
      await usdt.mint(players[i].address, initialBalance);
      await usdt.connect(players[i]).approve(luckyDraw.address, initialBalance);
    }
    
    return { luckyDraw, usdt, owner, players: players.slice(0, playerCount) };
  }

  it("Should handle multiple players registering concurrently", async function () {
    const { luckyDraw, players } = await loadFixture(deployWithPlayers);
    
    // Register all players simultaneously
    await Promise.all(
      players.map((player, i) => 
        luckyDraw.connect(player).registerPlayer(`Player${i + 1}`)
      )
    );
    
    // Verify all registrations
    for (let i = 0; i < players.length; i++) {
      const player = await luckyDraw.players(players[i].address);
      expect(player.nickname).to.equal(`Player${i + 1}`);
    }
  });

  it("Should handle concurrent bets correctly", async function () {
    const { luckyDraw, usdt, players } = await loadFixture(deployWithPlayers);
    
    // Register players first
    await Promise.all(
      players.map((player, i) => 
        luckyDraw.connect(player).registerPlayer(`Player${i + 1}`)
      )
    );
    
    const betAmount = ethers.utils.parseUnits("10", 6);
    
    // Place bets concurrently
    await Promise.all(
      players.map(player => 
        luckyDraw.connect(player).placeBet(betAmount)
      )
    );
    
    // Verify contract balance
    const expectedTotal = betAmount.mul(players.length);
    const contractBalance = await usdt.balanceOf(luckyDraw.address);
    expect(contractBalance).to.equal(expectedTotal);
    
    // Verify individual bets
    for (const player of players) {
      const playerData = await luckyDraw.players(player.address);
      expect(playerData.totalBets).to.equal(betAmount);
    }
  });

  it("Should handle rapid consecutive bets from the same player", async function () {
    const { luckyDraw, usdt, players } = await loadFixture(deployWithPlayers);
    const player = players[0];
    
    await luckyDraw.connect(player).registerPlayer("RapidPlayer");
    
    const betAmount = ethers.utils.parseUnits("5", 6);
    const betCount = 10;
    
    // Place multiple bets rapidly
    await Promise.all(
      Array(betCount).fill(0).map(() => 
        luckyDraw.connect(player).placeBet(betAmount)
      )
    );
    
    const playerData = await luckyDraw.players(player.address);
    expect(playerData.totalBets).to.equal(betAmount.mul(betCount));
  });

  it("Should maintain data consistency during concurrent operations", async function () {
    const { luckyDraw, usdt, owner, players } = await loadFixture(deployWithPlayers);
    
    // Register and bet concurrently
    await Promise.all(
      players.map(async (player, i) => {
        await luckyDraw.connect(player).registerPlayer(`Player${i}`);
        const betAmount = ethers.utils.parseUnits(String(i + 1), 6);
        return luckyDraw.connect(player).placeBet(betAmount);
      })
    );
    
    // Verify total contract balance
    const expectedTotal = players.reduce((acc, _, i) => 
      acc.add(ethers.utils.parseUnits(String(i + 1), 6)), 
      ethers.BigNumber.from(0)
    );
    
    const contractBalance = await usdt.balanceOf(luckyDraw.address);
    expect(contractBalance).to.equal(expectedTotal);
  });
});
import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@ethereum-waffle/provider";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { LuckyDraw, IERC20 } from "../typechain-types";

describe("LuckyDraw", function () {
  async function deployFixture() {
    const [owner, player1, player2] = await ethers.getSigners();
    
    // Deploy mock USDT
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const usdt = await MockUSDT.deploy();
    
    // Deploy LuckyDraw
    const LuckyDraw = await ethers.getContractFactory("LuckyDraw");
    const luckyDraw = await LuckyDraw.deploy(usdt.address);
    
    return { luckyDraw, usdt, owner, player1, player2 };
  }

  describe("Player Management", function () {
    it("Should register a new player", async function () {
      const { luckyDraw, player1 } = await loadFixture(deployFixture);
      await luckyDraw.connect(player1).registerPlayer("Player1");
      const player = await luckyDraw.players(player1.address);
      expect(player.nickname).to.equal("Player1");
    });

    it("Should block a player", async function () {
      const { luckyDraw, owner, player1 } = await loadFixture(deployFixture);
      await luckyDraw.connect(player1).registerPlayer("Player1");
      await luckyDraw.connect(owner).blockPlayer(player1.address);
      const player = await luckyDraw.players(player1.address);
      expect(player.isBlocked).to.be.true;
    });
  });

  describe("Game Mechanics", function () {
    it("Should place a bet", async function () {
      const { luckyDraw, usdt, player1 } = await loadFixture(deployFixture);
      const betAmount = ethers.utils.parseUnits("10", 6); // 10 USDT
      
      await luckyDraw.connect(player1).registerPlayer("Player1");
      await usdt.mint(player1.address, betAmount);
      await usdt.connect(player1).approve(luckyDraw.address, betAmount);
      
      await luckyDraw.connect(player1).placeBet(betAmount);
      const player = await luckyDraw.players(player1.address);
      expect(player.totalBets).to.equal(betAmount);
    });

    it("Should distribute jackpot", async function () {
      const { luckyDraw, usdt, owner, player1 } = await loadFixture(deployFixture);
      const betAmount = ethers.utils.parseUnits("10", 6);
      
      await luckyDraw.connect(player1).registerPlayer("Player1");
      await usdt.mint(player1.address, betAmount);
      await usdt.connect(player1).approve(luckyDraw.address, betAmount);
      await luckyDraw.connect(player1).placeBet(betAmount);
      
      await luckyDraw.connect(owner).distributeJackpot(player1.address);
      const player = await luckyDraw.players(player1.address);
      expect(player.totalWins).to.equal(betAmount);
    });
  });
});
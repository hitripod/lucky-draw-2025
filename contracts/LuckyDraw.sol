// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LuckyDraw is Ownable, ReentrancyGuard {
    IERC20 public usdt;
    
    struct Player {
        string nickname;
        bool isBlocked;
        uint256 totalBets;
        uint256 totalWins;
    }
    
    mapping(address => Player) public players;
    address[] public playerAddresses;
    
    event PlayerRegistered(address indexed player, string nickname);
    event PlayerBlocked(address indexed player);
    event PlayerUnblocked(address indexed player);
    event JackpotWon(address indexed winner, uint256 amount);
    event NicknameUpdated(address indexed player, string newNickname);
    
    constructor(address _usdtAddress) {
        usdt = IERC20(_usdtAddress);
    }
    
    modifier notBlocked() {
        require(!players[msg.sender].isBlocked, "Player is blocked");
        _;
    }
    
    function registerPlayer(string memory nickname) external {
        require(bytes(players[msg.sender].nickname).length == 0, "Already registered");
        players[msg.sender] = Player(nickname, false, 0, 0);
        playerAddresses.push(msg.sender);
        emit PlayerRegistered(msg.sender, nickname);
    }
    
    function updateNickname(string memory newNickname) external notBlocked {
        require(bytes(players[msg.sender].nickname).length > 0, "Player not registered");
        players[msg.sender].nickname = newNickname;
        emit NicknameUpdated(msg.sender, newNickname);
    }
    
    function blockPlayer(address player) external onlyOwner {
        players[player].isBlocked = true;
        emit PlayerBlocked(player);
    }
    
    function unblockPlayer(address player) external onlyOwner {
        players[player].isBlocked = false;
        emit PlayerUnblocked(player);
    }
    
    function placeBet(uint256 amount) external notBlocked nonReentrant {
        require(amount > 0, "Bet amount must be greater than 0");
        require(usdt.transferFrom(msg.sender, address(this), amount), "USDT transfer failed");
        players[msg.sender].totalBets += amount;
    }
    
    function distributeJackpot(address winner) external onlyOwner nonReentrant {
        uint256 jackpotAmount = usdt.balanceOf(address(this));
        require(jackpotAmount > 0, "No jackpot to distribute");
        require(usdt.transfer(winner, jackpotAmount), "Jackpot distribution failed");
        players[winner].totalWins += jackpotAmount;
        emit JackpotWon(winner, jackpotAmount);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Leaderboard is Ownable {
    mapping(address => uint256) public points;
    event PointsUpdated(address indexed user, uint256 totalPoints);

    constructor() Ownable(msg.sender) {}

    function setPoints(address user, uint256 totalPoints) external onlyOwner {
        points[user] = totalPoints;
        emit PointsUpdated(user, totalPoints);
    }
}

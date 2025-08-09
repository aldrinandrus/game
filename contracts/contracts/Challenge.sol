// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Challenge is Ownable {
    struct ChallengeItem {
        uint256 id;
        string name;
        uint256 points;
        bool active;
    }

    mapping(uint256 => ChallengeItem) public challenges;
    mapping(address => mapping(uint256 => bool)) public completed;
    mapping(address => uint256) public userPoints;

    event ChallengeSet(uint256 indexed id, string name, uint256 points, bool active);
    event ChallengeCompleted(address indexed user, uint256 indexed id, uint256 points, uint256 totalPoints);

    constructor() Ownable(msg.sender) {}

    function setChallenge(uint256 id, string calldata name, uint256 points, bool active) external onlyOwner {
        challenges[id] = ChallengeItem(id, name, points, active);
        emit ChallengeSet(id, name, points, active);
    }

    function completeChallenge(uint256 id) external {
        ChallengeItem memory c = challenges[id];
        require(c.active, "Inactive challenge");
        require(!completed[msg.sender][id], "Already completed");
        completed[msg.sender][id] = true;
        userPoints[msg.sender] += c.points;
        emit ChallengeCompleted(msg.sender, id, c.points, userPoints[msg.sender]);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BadgeNFT is ERC1155, Ownable {
    constructor(string memory initialURI) ERC1155(initialURI) Ownable(msg.sender) {}

    function setURI(string memory newuri) external onlyOwner {
        _setURI(newuri);
    }

    function mintBadge(address to, uint256 id, uint256 amount) external onlyOwner {
        _mint(to, id, amount, "");
    }
}

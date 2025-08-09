// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProfileNFT is ERC721, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public hasProfile;

    constructor() ERC721("Synqtra Profile", "SYNQ") Ownable(msg.sender) {}

    function mintProfile() external returns (uint256) {
        require(!hasProfile[msg.sender], "Profile already minted");
        uint256 tokenId = ++nextTokenId;
        hasProfile[msg.sender] = true;
        _mint(msg.sender, tokenId);
        return tokenId;
    }
}

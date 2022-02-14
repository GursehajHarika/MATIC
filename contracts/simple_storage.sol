// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract SimpleStorageContract is ERC721, Ownable {
    uint256 public mintPrice = 1 ether;
    uint256 public totalSupply;

    //by default isMintEnabled is false
    bool public isMintEnabled;
    mapping(address => uint256) public mintedWallets;

    function toggleIsMintEnabled() external onlyOwner {
        isMintEnabled = !isMintEnabled;
    }

    function mint() external payable {
        require(isMintEnabled, 'minting not enabled');
        require(msg.value == mintPrice, 'wrong value');

        mintedWallets[msg.sender]++;
        totalSupply++;
        uint256 tokenID = totalSupply;
        _safeMint(msg.sender, tokenID);

    }
}

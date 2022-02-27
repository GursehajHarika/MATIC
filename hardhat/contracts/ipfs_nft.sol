// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

// fileID == 0 defines the token ID for this contract
// NFTContract inherits all modules from ERC1155
contract NFTContract is ERC1155, Ownable {
    uint256 public constant fileID = 0;

    constructor() ERC1155("") {
        _mint(msg.sender, fileID, 1,"");
    }

    //onlyOwner requires that only the owner is able to call the _mint function. 
    function mint(address to, uint256 id, uint256 amount) public onlyOwner {
        _mint(to, id, amount, "");
    }

    function burn(address from, uint256 id, uint256 amount) public {
        require(msg.sender == from);
        _burn(from, id, amount);
    }

}
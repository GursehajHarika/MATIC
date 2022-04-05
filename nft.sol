pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol" ;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol" ;

contract NFTcont is ERC1155, Ownable {

    uint256 public constant ARTWK = 0;
    uint256 public constant Photo = 1;
    
    constructor() ERC1155("https://od7unl6rhtze.usemoralis.com/{id}.json") {
        _mint(msg.sender, ARTWK, 1, "");        
        _mint(msg.sender, Photo, 2, "");

    }

    

    function mint(address account, uint256 id, uint256 amount) public onlyOwner {        
        _mint(account,id,amount,"");
    }
    function burn(address account, uint256 id , uint256 amount ) public {
        require(msg.sender == account);
        _burn(account , id, amount);
    }
}
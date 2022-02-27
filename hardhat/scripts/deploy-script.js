const hre = require("hardhat");

const WALLET_ADDRESS = "YOUR WALLET PUBLIC ADDRESS"
const CONTRACT_ADDRESS = "YOUR CONTRACT ADDRESS"

async function main(_URI) {
    const NFT = await hre.ethers.getContractFactory("MyToken");

    const contract = NFT.attach(CONTRACT_ADDRESS);
    await contract._safeMint(WALLET_ADDRESS).then((txn) => {
        // Log Txn
        console.log(txn.hash)
        return(txn)
    });

}
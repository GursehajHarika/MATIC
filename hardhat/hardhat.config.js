/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.2",
  defaultNetwork: "matic_testnet",
  networks: {
    hardhat: {},
    matic_testnet: {
        url: "https://rpc-mumbai.maticvigil.com",
        accounts: [203b635be2da2b71077ae682c1580ef54a832090ac4fa5bfbba8eab44486a5f4],
        gasPrice: 8000000000
    }
}
};
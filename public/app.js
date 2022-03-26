// connect to Moralis server


const serverUrl = "https://od7unl6rhtze.usemoralis.com:2053/server";
const appId = "x8amTTl1PnpqryQEXuv8YHfP4XtcS3YjNecCXF2C";
Moralis.start({ serverUrl, appId });
let currentUser;
function login_metamask() {
    Moralis.authenticate().then(function (user) {
        console.log(user.get('ethAddress'))
        currentUser = Moralis.User.current();
        if (user.get('ethAddress') != 0) {
            console.log('user logged in');
            if (currentUser) {
                console.log(currentUser)
                Moralis.enableEncryptedUser();
                Moralis.secret = 'My Secret Key'
                console.log(currentUser)
                document.getElementById("metadataName").innerText = "User logged in via wallet : " + user.get('ethAddress');
                document.getElementById("metadataName").style.visibility = "visible";
                document.getElementById("btn-logout").style.visibility = "visible";
                document.getElementById("btn-viewnft").style.visibility = "visible";
                document.getElementById("btn-login").style.visibility = "hidden";
                document.getElementById("metadataDescription").style.visibility = "visible";
                document.getElementById("form").style.visibility = "visible";
                document.getElementById("nameFile").style.visibility = "visible";
            }
        }
        else {
            Moralis.enableWeb3();
        }
    })
}

async function uploadfile() {

    const data = fileInput.files[0]
    const file = new Moralis.File(data.name, data)
    await file.saveIPFS();
    document.getElementById("metadataName").value = data.name;
    let fileHash = file.hash();
    let fileUrl = file.ipfs();
    console.log(file.ipfs(), file.hash());
    file.ipfs();

    //Create Metadata with file hash & data
    let metadata = 
    {
        name: document.getElementById("metadataName").value,
        description: document.getElementById("metadataDescription").value,
        Hash: fileHash,
        file: "/ipfs/" + fileHash,
        walletID: Moralis.currentUser
    }
    const jsonFile = new Moralis.File("metadata.json", { base64: btoa(JSON.stringify(metadata))});
    await jsonFile.saveIPFS();
    let metadataHash = jsonFile.hash();
    console.log(metadataHash);
    console.log(jsonFile.ipfs());

    //Uploading to Rarible (Moralis Plugin)
    let res = await Moralis.Plugins.rarible.lazyMint({
        chain: 'rinkeby',
        userAddress: currentUser.get("ethAddress"),
        tokenType: 'ERC721',
        tokenUri: 'https://ipfs.moralis.io:2053//ipfs/' + metadataHash, 
        royaltiesAmount: 5, // 0.05% royalty. Optional
      })
    console.log(res)
    let token_address = res.data.result.tokenAddress
    let token_id = res.data.result.tokenId;
    let url = `https://rinkeby.rarible.com/token/${token_address}:${token_id}`
    document.getElementById("successMessage").innerHTML =
        `NFT Minted. <a  target="_blank" href="${url}">View NFT</a>`
    
    setTimeout(() => {
             document.getElementById("successMessage").style.visibility = "hidden"
    }, 10000)   
}


async function getNFTs()
{
    const options = { chain: "rinkeby", address: '0x7071717c7f1de1d0cc0d43c163f3fb20ee659c8d'};
    const rinkebyNFTs = await Moralis.Web3API.account.getNFTs(options);

    console.log(rinkebyNFTs)
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
     // MetaMask is locked or the user has not connected any accounts
     console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
      // Do any other work!
    }
  }


function logout_user() {
    Moralis.User.logOut().then(function (user) {
        const currentUser = Moralis.User.current();  // this will now be null
        console.log('user logged out');
        console.log(currentUser);
        document.getElementById("btn-login").style.visibility = "visible";
        document.getElementById("metadataName").innerText = " ";
        document.getElementById("metadataName").style.visibility = "hidden";
        document.getElementById("btn-logout").style.visibility = "hidden";
        document.getElementById("btn-viewnft").style.visibility = "hidden";
        document.getElementById("metadataDescription").style.visibility = "hidden";
        document.getElementById("form").style.visibility = "hidden";
        document.getElementById("nameFile").style.visibility = "hidden";
    });
}

//https://rinkeby.rarible.com/token/TOKEN_ADDRESS:TOKEN_ID



checkWeb3();

function displayMessage(messageType, message){
    
    messages = {
        "00":`<div class= "alert alert-success"> ${message} </div>`,
        "01":`<div class= "alert alert-danger"> ${message} </div>`
    }
    document.getElementById("resultSpace").innerHTML = messages[messageType];
}

async function checkWeb3(){
    const ethereum = window.ethereum;
    if(!ethereum || !ethereum.on) {
        displayMessage("01", "This App Requires MetaMask, Please Install MetaMask");
    }
    else{
        //displayMessage("00", "Metamask is Installed");
        setWeb3Environment()
    }
}

function setWeb3Environment(){
    web3 = new Web3(window.ethereum);
    getNetwork();
    monitorNetwork();
}

async function getNetwork(){
    chainID = await web3.eth.net.getId();
    if (chainID == 80001){
        displayMessage("00","Active network is "+ getNetworkName(chainID));
    }
    else {
        displayMessage("01","Active network is "+ getNetworkName(chainID) + ", This network is currently not supported");
        document.getElementById("btn-switch").style.visibility = "visible";
        document.getElementById("btn-login").style.visibility = "hidden";

    }
}

function getNetworkName(chainID){
    networks = {
        1:"Ethereum Mainnet",
        4:"Ethereum Rinkeby",
        97:"Binance Smart Chain Testnet",
        80001:"Polygon Mumbai Testnet"
    }
    return networks[chainID];
}

async function monitorNetwork(){
    Moralis.onChainChanged(function(){
        window.location.reload()
    })
}



//Detecting USer logged into metamask
let logval = 0;
web3.eth.getAccounts(function(err, accounts){
    if (err != null) console.error("An error occurred: "+err);
    else if (accounts.length == 0) {
        console.log("User is not logged in to MetaMask");
        document.getElementById("metalogin").style.visibility = "visible";
}
    else{ 
    console.log("User is logged in to MetaMask");
    document.getElementById("SwitchTest").style.visibility = "visible";
    document.getElementById("fileman").style.visibility = "visible";
    document.getElementById("networkact").style.visibility = "visible";
}
});


function myfunction(){
 
    const chainIdHex = web3.currentProvider.chainId;
    const chainIdDec =  web3.eth.net.getId();
    console.log(chainIdHex);
    console.log(chainIdDec);
    try {
         web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }]
        });
        
      } catch (error) {
        console.log("Page refershing ");
        alert(error.message);
      }
      if (chainIdHex !== 0x13881) {
        console.log("Page refershing 2 ");
        try {  
           web3.currentProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x13881",
                chainName: "Mumbai",
                rpcUrls: ["https://rpc-mumbai.matic.today"],
                nativeCurrency: {
                  name: "Matic",
                  symbol: "Matic",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com"],
              },
            ],
          });
          location.reload();
        } catch (error) {
          alert(error.message);
        }
      }

    
    }
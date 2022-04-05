// connect to Moralis server


const serverUrl = "https://od7unl6rhtze.usemoralis.com:2053/server";
const appId = "x8amTTl1PnpqryQEXuv8YHfP4XtcS3YjNecCXF2C";
Moralis.start({ serverUrl, appId });
let currentUser;
const nft_contract_address = "0x65F931a0fE9231d26cF2471aD617D5473EC4B629"


async function login_metamask() {
    Moralis.authenticate().then(function (user) {
        console.log(user.get('ethAddress'))
        let currentUser = Moralis.User.current();
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
    const fileExt = data.name.substring(data.name.indexOf(".") + 1);
    await file.saveIPFS();
    document.getElementById("metadataName").value = data.name;
    let fileHash = file.hash();
    let fileUrl = file.ipfs();
    console.log(file.ipfs(), file.hash(), data.name);
    file.ipfs();
    let metadata = 
      {
          name: document.getElementById("metadataName").value,
          description: document.getElementById("metadataDescription").value,
          image: fileUrl
      }
    const jsonFile = new Moralis.File("metadata.json", { base64: btoa(JSON.stringify(metadata))});
    await jsonFile.saveIPFS();
    let metadataHash = jsonFile.ipfs();
    console.log(metadataHash);
    console.log(jsonFile.ipfs());
    const txt = await mintToken(metadataHash).then(notify)
    
}
async function mintToken(_uri){
    const encodedFunction = web3.eth.abi.encodeFunctionCall({
      name: "mintToken",
      type: "function",
      inputs: [{
        type: 'string',
        name: 'tokenURI'
        }]
    }, [_uri]);
  
    const transactionParameters = {
      to: nft_contract_address,
      from: ethereum.selectedAddress,
      data: encodedFunction
    };
    const txt = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters]
    });
    return txt
  }
  
  async function notify(_txt){
    document.getElementById("resultSpace").innerHTML =  
    `<input disabled = "true" id="result" type="text" class="form-control" placeholder="Description" aria-label="URL" aria-describedby="basic-addon1" value="Your NFT was minted in transaction ${_txt}">`;
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


function myfunction()
{
 
    const chainIdHex = web3.currentProvider.chainId;
    const chainIdDec =  web3.eth.net.getId();
    console.log(chainIdHex);
    console.log(chainIdDec);
    try 
    {
         web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }]
        });
        
      } catch (error) {
        console.log("Page refershing ");
        alert(error.message);
      }
      if (chainIdHex !== 0x13881) 
      {
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



    
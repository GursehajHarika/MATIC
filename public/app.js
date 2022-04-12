// connect to Moralis server


const serverUrl = "https://od7unl6rhtze.usemoralis.com:2053/server";
const appId = "x8amTTl1PnpqryQEXuv8YHfP4XtcS3YjNecCXF2C";
Moralis.start({ serverUrl, appId });
const nft_contract_address = "0x65F931a0fE9231d26cF2471aD617D5473EC4B629"
let user = Moralis.User.current();
var web3;
checkWeb3();
async function login_metamask() {
  if (!user) {
    console.log("USER : " + user);
    user = await Moralis.authenticate({
      signingMessage: "Log in using Moralis"
    })
      .then(function (user) {
        console.log("logged in user:", user.id);
        console.log(user.get("ethAddress"));
        let ethAddress = user.get("ethAddress");
        console.log(user)
        
    console.log(user)
    document.getElementById("metadataName").innerText = "User logged in via wallet : " + user.get('ethAddress');
    document.getElementById("metadataName").style.visibility = "visible";
    document.getElementById("btn-logout").style.visibility = "visible";
    document.getElementById("btn-login").style.visibility = "hidden";
    document.getElementById("metadataDescription").style.visibility = "visible";
    document.getElementById("form").style.visibility = "visible";
    document.getElementById("nameFile").style.visibility = "visible";
    document.getElementById("SwitchTest").style.visibility = "visible";
    document.getElementById("fileman").style.visibility = "visible";
    document.getElementById("networkact").style.visibility = "visible";

   
    //Getting NFT p1
    const options = { address: "0x65F931a0fE9231d26cF2471aD617D5473EC4B629", chain: "0x13881" };

      });
  }
  else {

    let ethAddress = user.get("ethAddress");
    console.log(user)
    document.getElementById("metadataName").innerText = "User logged in via wallet : " + user.get('ethAddress');
    document.getElementById("metadataName").style.visibility = "visible";
    document.getElementById("btn-logout").style.visibility = "visible";
    document.getElementById("btn-login").style.visibility = "hidden";
    document.getElementById("metadataDescription").style.visibility = "visible";
    document.getElementById("form").style.visibility = "visible";
    document.getElementById("nameFile").style.visibility = "visible";
    document.getElementById("SwitchTest").style.visibility = "visible";
    document.getElementById("fileman").style.visibility = "visible";
    document.getElementById("networkact").style.visibility = "visible";
   
    //Getting NFT p1
    const options = { address: "0x65F931a0fE9231d26cF2471aD617D5473EC4B629", chain: "0x13881" };

  }

  console.log("USER ouside if " + user) ;
}

//getting NFTS p2
async function NFTget(options) {
  let NFTs = await Moralis.Web3API.token.getNFTOwners(options)
  console.log(NFTs);
  document.getElementById("btn-login").style.visibility = "hidden";
  let nftinfo = fetchNFT_new(NFTs.result);

}



function loadJSON(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    //console.log(xhr.readyState);
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        success(JSON.parse(xhr.responseText));
      }
      else {
        error(xhr);
      }
    }
  };
  xhr.open('GET', path, true);
  xhr.send();
}



function fetchNFT_new(NFTs){
  for (let i = 0; i < NFTs.length;i++) {
    console.log("NFT OWner check started with wallet ID " + NFTs[i].owner_of );
    if ( NFTs[i].owner_of == user.get("ethAddress")){
      let nft = NFTs[i];
      let metad = nft.metadata
      let metaparse = JSON.parse(metad);
      renderInv(metaparse)
    }
  }
}

function renderInv(NFTs) {
  const parent = document.getElementById("nftview")

  


  const fileExt = NFTs.name.substring(NFTs.name.indexOf(".") + 1);
  console.log(fileExt);
  if (fileExt == "pdf"){
    console.log("PDF detected");
    let htmlString = `
        <div class="card" style="padding-top: 5%;">
            <img class="card-img-top-img-fluid" alt="Responsive image" src="https://anpbvyeqfhl5.usemoralis.com/images/MATIC-2.png">
                <div class="card-body">
                    <h5 class="card-title">${NFTs.name}</h5>
                    <p class="card-text">${NFTs.description}</p>
                    <a href="${NFTs.image}" class="btn btn-primary">Details</a>
                </div>
        </div>`
      let col = document.createElement("div")
      col.className = "col col-md-3"
      col.innerHTML = htmlString;
      parent.appendChild(col);

  }
  else {
  let htmlString = `
  <div class="card" style="padding-top: 5%;">
      <img class="card-img-top" src="${NFTs.image}" alt="Card image cap">
          <div class="card-body">
              <h5 class="card-title">${NFTs.name}</h5>
              <p class="card-text">${NFTs.description}</p>
              <a href="${NFTs.image}" class="btn btn-primary">View File</a>

          </div>
  </div>`
      let col = document.createElement("div")
      col.className = "col col-md-3"
      col.innerHTML = htmlString;
      parent.appendChild(col);
  }

 
}


async function uploadfile() {

  const data = fileInput.files[0]
  const file = new Moralis.File(data.name, data)
  const fileExt = data.name.substring(data.name.indexOf(".") + 1);
  const lowered = fileExt.toLowerCase();

  if (lowered == "pdf" || fileExt == "png" || fileExt == "jpeg" || fileExt == "jpg") {

    await file.saveIPFS();
    document.getElementById("metadataName").value = data.name;
    let fileHash = file.hash();
    let fileUrl = file.ipfs();
    console.log(file.ipfs(), file.hash(), data.name);
    // if (fileExt == "pdf"){


    // }
    file.ipfs();
    let metadata =
    {
      name: document.getElementById("metadataName").value,
      description: document.getElementById("metadataDescription").value,
      image: fileUrl
    }
    const jsonFile = new Moralis.File("metadata.json", { base64: btoa(JSON.stringify(metadata)) });
    await jsonFile.saveIPFS();
    let metadataHash = jsonFile.ipfs();
    console.log(metadataHash);
    console.log(jsonFile.ipfs());
    const txt = await mintToken(metadataHash).then(notify)
  }
  else {
    alert("File extension not supported!");
  }


}

async function mintToken(_uri) {
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
async function notify(_txt) {
  document.getElementById("resultSpace").innerHTML =
    `<input disabled = "true" id="result" type="text" class="form-control" placeholder="Description" aria-label="URL" aria-describedby="basic-addon1" value="Your NFT was minted in transaction ${_txt}">`;
      console.log(_txt)
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


async function logout_user() {
  await Moralis.User.logOut().then(function (user) {
    user = Moralis.User.current();  // this will now be null
    console.log('user logged out');
    console.log(user);
    document.getElementById("btn-login").style.visibility = "visible";
    document.getElementById("metadataName").innerText = " ";
    document.getElementById("metadataName").style.visibility = "hidden";
    document.getElementById("btn-logout").style.visibility = "hidden";
    document.getElementById("btn-viewnft").style.visibility = "hidden";
    document.getElementById("metadataDescription").style.visibility = "hidden";
    document.getElementById("form").style.visibility = "hidden";
    document.getElementById("nameFile").style.visibility = "hidden";


  });
  window.location.reload();
}



function displayMessage(messageType, message) {

  let messages = {
    "00": `<div class= "alert alert-success"> ${message} </div>`,
    "01": `<div class= "alert alert-danger"> ${message} </div>`
  }
  document.getElementById("checkNetwork").innerHTML = messages[messageType];
}

async function checkWeb3() {
  const ethereum = window.ethereum;
  if (!ethereum || !ethereum.on) {
    displayMessage("01", "This App Requires MetaMask, Please Install MetaMask");
  }
  else {
    setWeb3Environment()
  }
}

function setWeb3Environment() {
  web3 = new Web3(window.ethereum);
  getNetwork();
  monitorNetwork();
}
function getNetworkName(chainID) {
  let networks = {
    1: "Ethereum Mainnet",
    4: "Ethereum Rinkeby",
    97: "Binance Smart Chain Testnet",
    80001: "Polygon Mumbai Testnet"
  }
  return networks[chainID];
}

async function getNetwork(){
  let chainID = await web3.eth.net.getId();
  if (chainID == 80001){
      displayMessage("00","Active network is "+ getNetworkName(chainID));
  }
  else {
      displayMessage("01","Active network is "+ getNetworkName(chainID) + ", This network is currently not supported");
      document.getElementById("btn-switch").style.visibility = "visible";
      document.getElementById("btn-login").style.visibility = "hidden";

  }
}

async function monitorNetwork() {
  Moralis.onChainChanged(function () {
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

function myfunction() {
  const chainIdHex = web3.currentProvider.chainId;
  const chainIdDec = web3.eth.net.getId();
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
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  }
}

document.getElementById("btn-login").onclick = login_metamask;
document.getElementById("btn-logout").onclick = logout_user;
document.getElementById("fileinput").onclick = uploadfile;

document.getElementById("btn-switch").onclick = myfunction;
export { NFTget, fetchNFT_new, renderInv} 

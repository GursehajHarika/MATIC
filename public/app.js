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
                document.getElementById("metadataName").innerText = "Logged in User: " + currentUser.id;
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
        tokenUri: '/ipfs/' + metadataHash, 
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
    }, 5000)   
}

async function getNFTs()
{
    const options = { chain: "rinkeby", address: '0x7071717c7f1de1d0cc0d43c163f3fb20ee659c8d'};
    const rinkebyNFTs = await Moralis.Web3API.account.getNFTs(options);

    console.log(rinkebyNFTs)
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
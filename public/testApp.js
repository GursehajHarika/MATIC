import { NFTget, fetchNFT_new, renderInv} from "./app.js";
const serverUrl = "https://od7unl6rhtze.usemoralis.com:2053/server";
const appId = "x8amTTl1PnpqryQEXuv8YHfP4XtcS3YjNecCXF2C";
Moralis.start({ serverUrl, appId });
const nft_contract_address = "0x65F931a0fE9231d26cF2471aD617D5473EC4B629"
let user = Moralis.User.current();
console.log(user)
if(user)
{    console.log(user)
       
        const options = { address: "0x65F931a0fE9231d26cF2471aD617D5473EC4B629", chain: "0x13881" };

        NFTget(options);
}


async function login_metamask() {
    console.log()
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
      document.getElementById("btn-logout").style.visibility = "visible";
      document.getElementById("btn-login").style.visibility = "hidden";
      window.location.reload();

      //Getting NFT p1
      const options = { address: "0x65F931a0fE9231d26cF2471aD617D5473EC4B629", chain: "0x13881" };
  
        });
    }
    else {
  
      let ethAddress = user.get("ethAddress");
      console.log(user)
      document.getElementById("btn-logout").style.visibility = "visible";
      document.getElementById("btn-login").style.visibility = "hidden";

      //Getting NFT p1
      const options = { address: "0x65F931a0fE9231d26cF2471aD617D5473EC4B629", chain: "0x13881" };
    }
  
    console.log("USER ouside if " + user) ;
  }

  async function logout_user() {
    await Moralis.User.logOut().then(function (user) {
      user = Moralis.User.current();  // this will now be null
      console.log('user logged out');
      console.log(user);
      document.getElementById("btn-login").style.visibility = "visible";
      document.getElementById("btn-logout").style.visibility = "hidden";
      
    });
    //window.location.reload();
  }

document.getElementById("btn-logout").onclick = logout_user;
document.getElementById("btn-login").onclick = login_metamask;
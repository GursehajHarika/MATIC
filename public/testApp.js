import { NFTget, fetchNFT_new, renderInv, logout_user } from "./app.js";
const serverUrl = "https://od7unl6rhtze.usemoralis.com:2053/server";
const appId = "x8amTTl1PnpqryQEXuv8YHfP4XtcS3YjNecCXF2C";
Moralis.start({ serverUrl, appId });
const nft_contract_address = "0x65F931a0fE9231d26cF2471aD617D5473EC4B629"
let user = Moralis.User.current();
console.log(user)
if(user)
{
    document.getElementById("testP").innerHTML = "This is a test"
    console.log(user)
       
        const options = { address: "0x65F931a0fE9231d26cF2471aD617D5473EC4B629", chain: "0x13881" };

        NFTget(options);
}
else{
    logout_user();
}

import React, { useEffect, useState } from "react";
import './styles/App.css';
import {ethers} from "ethers"
import ABI from './utils/ABI.json'
import twitterLogo from "./assets/twitter-logo.svg"
// Constants
const TWITTER_HANDLE = 'ankitzm';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const CONTRACT_ADDRESS = "0x5547C16E81b782d626395fAAC1aEE47F93691CdA"

const App = () => {
  // console.log(ABI.output.abi)
  
  const [currentAccount, setCurrentAccount] = useState("");
  const [Address, setAddress] = useState("");
  
  const checkIfWalletIsConnected = async () => {
    const {ethereum} = window;

    if(!ethereum) {
      console.log("Probably you don't have Metamask wallet")
    } else {
      console.log("We have a etheruem object", ethereum);
    }

    // Check if wallet is authorized
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    // grab first account if  multiple account present
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  // Connect wallet code
   const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      const mumbaiChainId = "0x13881"; 
      if (chainId !== mumbaiChainId) {
        alert("You are not connected to the Mumbai Test Network!");
      }
      
      // Request access to account.
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      // Print public address
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      if(accounts[0] !== "0xB8b79891ABF6957641ab350eD74842878Cc06ff5") {
        alert("Please connect with ADMIN account to continue, any of the functionality will not work with your account.")
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  // Runs the function once page loads
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  // Minting function
  const askContractToMintNFT = async() => {
    if(Address.length > 40) {
      try {
      const { ethereum } = window;

      if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, ABI.output.abi, signer);

          console.log("Going to pop wallet now to pay gas...")
          let nftTxn = await connectedContract.mintNFT("0xB8b79891ABF6957641ab350eD74842878Cc06ff5");
        
          const dataElement = document.getElementById("data");
          dataElement.style.display = "flex";
        
          console.log("Mining...please wait.")
          await nftTxn.wait();

        dataElement.innerHTML = `You minted an nft for NFT 😎  !! 
                                <br></br><br></br>
                                Your Transaction Hash 👇 
                                <a href="https://mumbai.polygonscan.com/tx//${nftTxn.hash}" target="_blank">${nftTxn.hash}</a>`
      
        alert(`Mined, see transaction: https://mumbai.polygonscan.com/tx//${nftTxn.hash}`);

        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
          console.log(error)
      }
    }
    else {
      alert("please put a valid address")
    }
  }

  useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Engineer Hackathon </p>
          <p className="sub-text">
            This is Proof-Of-Building NFT for Engineer Hackathon. <br />
            Keep Building !!
          </p>
          {currentAccount === "" ? 
            renderNotConnectedContainer()
           : 
          <div>
            <input type="text" id="address" className="cta-button" onInput={e => setAddress(e.target.value)} /> <br />
            <button onClick={askContractToMintNFT} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          </div>
          }
          
        <div id="data">
          Mining ...
        </div>
        </div>
        
        <div className="footer-container">
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Built by  @${TWITTER_HANDLE}`}</a>
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <br />
        </div>
      </div>
    </div>
  );
};

export default App;
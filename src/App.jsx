import React, { useEffect, useState } from "react";
import './styles/App.css';
import {ethers} from "ethers"
import ABI from './utils/ABI.json'
import twitterLogo from "./assets/twitter-logo.svg"
// Constants
const TWITTER_HANDLE = 'ankitzm';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/wordnft-wv4ir0y1cw';

const CONTRACT_ADDRESS = "0x60709F47a07404Ab46b663FaB486C6D55e7207eA"

const App = () => {
  // console.log(ABI.output.abi)
  
  const [currentAccount, setCurrentAccount] = useState("");
  
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
      try {
      const { ethereum } = window;

      if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, ABI.output.abi, signer);
      console.log("test1")

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

  useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">〣 Word NFT </p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? 
            renderNotConnectedContainer()
           : 
          <div>
            <input type="text" id="address" />
            <button onClick={askContractToMintNFT} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          </div>
          }
          
        <div id="data">
          Mining ...
        </div>
        <div id="opensea-link"> </div>
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
      </div>
  );
};

export default App;
import React, { createContext, useState, useEffect } from "react";
import { ethers } from 'ethers';

import { creditABI, creditAddress, nftABI, nftAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createCreditContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const creditContract = new ethers.Contract(
    creditAddress,
    creditABI,
    signer
  );

  return creditContract;
};

const createNftContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const NftContract = new ethers.Contract(
    nftAddress,
    nftABI,
    signer
  );

  return NftContract;
};

export const TransactionProvider = ({ children }) => {
  const [walletInfo, setWalletInfo] = useState({
    address: null,
    balance: null,
  });

  const [error, setError] = useState(null);
  useEffect(() => {
    if (error) 
      toast.error(error)
  }, [error])

  const [currentAccount, setCurrentAccount] = useState('');

  const handleChange = (e, name) => {
    setWalletInfo((prevState) => ({ ...prevState, [address]: e.target.value }));
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) {
        setError("Please install MetaMask.");
        return alert('Please install MetaMask.');
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

      }
    } catch (error) {
      console.log('No Wallet Connected Error:', error);
      setError('No Wallet Connected Error:', error);
      throw new Error('No Account Connected');
    }
  };

  const connectWallet = async () => {
    setError(null)
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      try {
        const { chainId } = await provider.getNetwork()
        // if (chainId.toString() !== network.mumbai.chainId) {
        //   handleNetworkChange()
        // }
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        setCurrentAccount(address);
        setError(null)
      } catch (error) {
        setError("Error Connecting Wallet...")
      }
    } else {
      setError("Metamask is not installed")
    }
  };

  const approve = async () => {
    try {
      if (ethereum) {
        const creditContract = createCreditContract();
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  });

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        handleChange,
        error,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

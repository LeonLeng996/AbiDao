import React, { createContext, useContext,useState, useEffect } from "react";
import { TransactionContext } from '../context/TransactionContext';
import { useToast } from "../context/toast_context";
import axios from 'axios';  
import { ethers } from 'ethers';
// Icons
import { SiEthereum } from 'react-icons/si';
import { BsInfoCircle } from 'react-icons/bs';

// Utils
import { shortenAddress } from '../utils/shortenAddress';
import { creditABI, creditAddress, nftABI, nftAddress } from '../utils/constants';

// Styles
const commonStyles =
  'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white';



const Home = () => {

  const [token, setToken] = useState('');
  const [memberImage, setMemberImage] = useState(''); 

  const {
    currentAccount,
  } = useContext(TransactionContext);

  const createCreditContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(
      creditAddress,
      creditABI,
      signer
    );

    return transactionsContract;
  };

  const createNftContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(
      nftAddress,
      nftABI,
      signer
    );

    return transactionsContract;
  };

  useEffect(async () => {
    getMemberTokenId();
  },[currentAccount]);

  async function getMemberTokenId() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const nftContract = createNftContract();
        console.log(currentAccount);
        let tokenIndex =
          await nftContract.getMemberTokenId(currentAccount);
        let tokenURI = "https://shdw-drive.genesysgo.net/GvvQqUbKXtR5dgWTdrz45Ab54kAfzePaC3BUf2VF7Fo8/";
        if(tokenIndex!=0){
          // tokenURI = "https://gateway.pinata.cloud/ipfs/"+tokenURI.substr(7);
          tokenURI += tokenIndex+'.json';
          console.log(tokenURI);

          axios.get(tokenURI).then((res)=>{
            console.log(res.data.image);
            let imageURI = res.data.image;
            console.log(imageURI);
            setMemberImage(imageURI);

          }).catch((err) => {
            console.log(err);
          });
        }
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: 'Contract Error',
        text: error.error.message,
        type: 'danger',
      })
    }
  }

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
        <div className="p-5 sm:w-72 w-full flex flex-col justify-start items-center blue-glassmorphism">
          <h1 className="font-semibold  text-lg text-yellow-200">Abi DAO Member Validation</h1>
          <h1 className="font-semibold  text-lg text-yellow-200">会员确认后会出现NFT图标</h1>
          <img src={memberImage} alt=""  />
        </div>
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-white font-light text-sm">
                  {shortenAddress(currentAccount)}
                </p>
                <p className="text-white font-semibold text-lg mt-1">
                  EthereumPOW
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

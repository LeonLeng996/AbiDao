import React, { createContext, useContext,useState, useEffect } from "react";
import { ethers } from 'ethers';
import { TransactionContext } from '../context/TransactionContext';
import { creditABI, creditAddress, nftABI, nftAddress } from '../utils/constants';
import axios from 'axios';  

// Components


function Grant() {
  const [input, setInput] = useState({
    member_account: "",
    member_name: "",
  });

  const {
    currentAccount,
  } = useContext(TransactionContext);

  const [value, setValue] = useState('');

  const [nextImage, setNextImage] = useState('');

  const handleChange = (e, name) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

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

  useEffect(() => {
    getNextTokenURI();
  })

  async function getNextTokenURI() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const nftContract = createNftContract();

        let tokenURI =
          await nftContract.getNextTokenURI();

        tokenURI = "https://gateway.pinata.cloud/ipfs/"+tokenURI.substr(7);
        // console.log(tokenURI);

        axios.get(tokenURI).then((res)=>{
          console.log(res.data.image);
          tokenURI = "https://gateway.pinata.cloud/ipfs/"+res.data.image.substr(7);
          setNextImage(tokenURI);

        }).catch((err) => {
          console.log(err);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function GrantMember() {
    if (!input) return

    if(!input.member_account){
      input.member_account = currentAccount;
    }

    // console.log(input.member_account);
    // console.log(input.member_name);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const nftContract = createNftContract();
        let transRx = await nftContract.mintOneNew(input.member_account, input.member_name);4

      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
        <h1 className="font-semibold text-lg text-yellow-200">Abi Genesis Member Granted</h1>
        <img src={nextImage} alt=""  />
        <label
          htmlFor="member_account"
          className="flex flex-col items-start justify-center"
        >
          <p>Member account</p>
        </label>
        <input
          rereadonly={"true"}
          disabled="disabled" 
          value = {currentAccount}
          onChange={handleChange}
          id="member_account"
          name="member_account"
          className="my-2 w-full border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <label
          htmlFor="member_name"
          className="flex flex-col items-start justify-center"
        >
          <p>Member Name</p>
        </label>
        <input
          onChange={handleChange}
          id="member_name"
          name="member_name"
          className="my-2 w-half border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <button onClick={GrantMember} className="p-3 px-10 text-white rounded-xl bg-[#73ca67] font-bold">
          Grant
        </button>
      </div>
    </div>
  )
}

export default Grant

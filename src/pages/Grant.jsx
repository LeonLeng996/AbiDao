import React, { createContext, useContext,useState, useEffect } from "react";
import axios from 'axios';  
import { ethers } from 'ethers';

import { TransactionContext } from '../context/TransactionContext';
import { useToast } from "../context/toast_context";
import { creditABI, creditAddress, nftABI, nftAddress } from '../utils/constants';

// Components


function Grant() {
  const [input, setInput] = useState({
    member_account: "",
    member_name: "",
  });
  const [value, setValue] = useState('');
  const [nextImage, setNextImage] = useState(''); 
  const { showToast } = useToast();
  const {
    currentAccount,
  } = useContext(TransactionContext);

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

  useEffect(async () => {
    getNextTokenURI();
  },[]);

  async function getNextTokenURI() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const nftContract = createNftContract();

        let tokenURI =
          await nftContract.getNextTokenURI();

        // tokenURI = "https://gateway.pinata.cloud/ipfs/"+tokenURI.substr(7);
        console.log(tokenURI);

        axios.get(tokenURI).then((res)=>{
          console.log(res.data.image);
          let imageURI = res.data.image;
          console.log(imageURI);
          setNextImage(imageURI);

        }).catch((err) => {
          console.log(err);
        });
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: 'Contract Error',
        text: "getNextTokenURI not work",
        type: 'danger',
      })
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
        let transRx = await nftContract.mintOneNew(input.member_account, input.member_name);

      }
    } catch (error) {
      console.error(error);
      showToast({
        title: 'Contract Error',
        text: error.error.message,
        type: 'danger',
      })
    }
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
        <h1 className="font-semibold text-lg text-yellow-200">Genesis Granted</h1>
        <h1 className="font-semibold text-lg text-yellow-200">领取创世会员，仅限获批成员</h1>
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
          <p>Member Name（会员名字）</p>
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

import React, { createContext, useContext,useState, useEffect } from "react";
import { ethers } from 'ethers';
import { useToast } from "../context/toast_context";

import { TransactionContext } from '../context/TransactionContext';
import { creditABI, creditAddress, nftABI, nftAddress } from '../utils/constants';

function ApplyNft() {

  const [input, setInput] = useState({
    member_account: "",
    owner_account: "",
  });

  const [showEnable, setShowEnable] = useState(false);
  const [applyDetail, setApplyDetail] = useState("");

  const {
    currentAccount,
  } = useContext(TransactionContext);

  const { showToast } = useToast();

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

  async function checkMember() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const nftContract = createNftContract();

        const is_member =
          await nftContract.isMember(input.member_account);

        console.log(is_member);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function ApplyNft() {
    if (!input) return

    if(!input.member_account){
      input.member_account = currentAccount;
    }

    if(!input.member_name){
      showToast({
        text: "member name can not be empty",
        type: 'warning',
        autohide: true,
      })
      return;
    }

    // console.log(input.member_account);
    // console.log(input.owner_account);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const nftContract = createNftContract();
        let transRx = await nftContract.applyNft(input.member_name);

        nftContract.on('ApplyNftCode', function(event, seccode){
          console.log(seccode); 
          setApplyDetail(String(seccode));
          setShowEnable(true);
        })

        // checkMember();
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: 'Contract Error',
        text: "applyNft not work",
        type: 'danger',
      })
    }
  }

  return (
    <div className="flex w-full justify-center items-center">
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
      <h1 className="font-semibold text-lg text-yellow-200">Apply For New Member</h1>
      <h1 className="font-semibold text-lg text-yellow-200">新会员入会申请</h1>
      <label
          htmlFor="member_account"
          className="flex flex-col items-start justify-center"
        >
          <p>Your Account</p>
        </label>
        <input
          rereadonly={"true"}
          disabled="disabled" 
          value = {currentAccount}
          id="member_account"
          name="member_account"
          className="my-2 w-full border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <label
          htmlFor="member_name"
          className="flex flex-col items-start justify-center"
        >
          <p>Apply Member Name（会员名字）</p>
        </label>
        <input
          onChange={handleChange}
          id="member_name"
          name="member_name"
          className="my-2 w-half border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <button onClick={ApplyNft} className="p-3 px-10 text-white rounded-xl bg-[#73ca67] font-bold">
          Apply
        </button>
        <div>
          {
            showEnable?(<p className="font-semibold text-lg text-green-600">Apply Code is {applyDetail}</p>) : ''
          }
        </div>
      </div>
    </div>
  )
}

export default ApplyNft

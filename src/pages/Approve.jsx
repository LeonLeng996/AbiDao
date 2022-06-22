import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from 'ethers';
import { TransactionContext } from '../context/TransactionContext';
import { creditABI, creditAddress, nftABI, nftAddress } from '../utils/constants';

function Approve() {
  const {
    currentAccount,
  } = useContext(TransactionContext);

  const [input, setInput] = useState({
    member_account: "",
    owner_account: "",
  });

  const [showEnable, setShowEnable] = useState(false);
  const [approveDetail, setApproveDetail] = useState("");

  const handleChange = (e, name) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const creditContract = () => {
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

  async function Approve() {
    if (!input) return

    // console.log(input.member_account);
    // console.log(input.owner_account);
    if(!input.owner_account){
      input.owner_account = currentAccount;
    }

    try {
      if (typeof window.ethereum !== 'undefined') {
        const nftContract = createNftContract();
        let transRx = await nftContract.approveMember(input.member_account);

        nftContract.on('ApproveCode', function(event, seccode){
          console.log(seccode); 
          setApproveDetail(String(seccode));
          setShowEnable(true);
        })

        // checkMember();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex w-full justify-center items-center">
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
        <h1 className="font-semibold text-lg text-yellow-200">Abi Genesis Member Approve</h1>
        <label
          htmlFor="member_account"
          className="flex flex-col items-start justify-center"
        >
          <p>Member wallet account</p>
        </label>
        <input
          onChange={handleChange}
          id="member_account"
          name="member_account"
          className="my-2 w-full border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <label
          htmlFor="owner_account"
          className="flex flex-col items-start justify-center"
        >
          <p>Owner Account</p>
        </label>
        <input
          rereadonly={"true"}
          disabled="disabled"
          value={currentAccount}
          id="owner_account"
          name="owner_account"
          className="my-2 w-full border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <button onClick={Approve} className="p-3 px-10 text-white rounded-xl bg-[#73ca67] font-bold">
          Approve
        </button>
        <div>
          {
            showEnable?(<p className="font-semibold text-lg text-green-600">Approve Code is {approveDetail}</p>) : ''
          }
        </div>
      </div>
    </div>
  )
}

export default Approve

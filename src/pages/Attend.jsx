import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from 'ethers';
import { TransactionContext } from '../context/TransactionContext';
import { useToast } from '../context/toast_context';
import { creditABI, creditAddress, nftABI, nftAddress } from '../utils/constants';

// Components


function Attend() {
  const { showToast } = useToast()

  const [input, setInput] = useState({
    member_account: "",
    event_code: 0,
  });

  const {
    currentAccount,
  } = useContext(TransactionContext);

  const [showEnable, setShowEnable] = useState(false);
  const [attendDetail, setAttendDetail] = useState("");

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

  async function AttendEvent() {
    if (!input) return

    // console.log(input.member_account);
    console.log(input.event_code);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const creditContract = createCreditContract();
        let transRx = await creditContract.attend_simple(input.event_code); 

        creditContract.on('AttendTransfer', function(event, attendnum){
          console.log(attendnum); 
          setAttendDetail(String(attendnum));
          setShowEnable(true);
        })

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
        <h1 className="font-semibold text-lg text-yellow-200">Abi Attending Event</h1>
        <h1 className="font-semibold text-lg text-yellow-200">参与活动激励</h1>
        <label
          htmlFor="event_code"
          className="flex flex-col items-start justify-center"
        >
          <p>Event Code（活动密码）</p>
        </label>
        <input
          onChange={handleChange}
          id="event_code"
          name="event_code"
          className="my-2 w-half border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <label
          htmlFor="member_account"
          className="flex flex-col items-start justify-center"
        >
          <p>Member account</p>
        </label>
        <input
          rereadonly={"true"}
          disabled="disabled"
          value={currentAccount}
          onChange={handleChange}
          id="member_account"
          name="member_account"
          className="my-2 w-full border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />

        <button onClick={AttendEvent} className="p-3 px-10 text-white rounded-xl bg-[#73ca67] font-bold">
          Attend
        </button>
        <div>
          {
            showEnable?(<p className="font-semibold text-lg text-green-600">Attend Balance is {attendDetail}</p>) : ''
          }
        </div>
      </div>
    </div>
  )
}

export default Attend

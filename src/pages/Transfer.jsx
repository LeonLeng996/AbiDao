import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from 'ethers';
import { TransactionContext } from '../context/TransactionContext';
import { creditABI, creditAddress, nftABI, nftAddress } from '../utils/constants';

function Transfer() {
  const {
    currentAccount,
  } = useContext(TransactionContext);

  const [input, setInput] = useState({
    member_account: "",
    owner_account: "",
    transfer_amount: 0,
  });

  const [showEnable, setShowEnable] = useState(false);
  const [transferDetail, setTransferDetail] = useState("");

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

  async function checkBalance() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const creditContract = createCreditContract();
        let transRx = await creditContract.balanceOf(input.member_account); 
                      
        setTransferDetail(String(transRx));

      }
    } catch (error) {
      console.log(error);
    }
  }

  async function TransferToken() {
    if (!input) return

    console.log(input.member_account);
    console.log(input.owner_account);
    console.log(input.transfer_amount);
    if(!input.owner_account){
      input.owner_account = currentAccount;
    }
    if(!input.transfer_amount){
      input.transfer_amount = 500;
    }

    try {
      if (typeof window.ethereum !== 'undefined') {
        const creditContract = createCreditContract();
        await creditContract.transfer(input.member_account, input.transfer_amount); 

        console.log(input.transfer_amount);

        setShowEnable(true);

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
        <label
          htmlFor="participation_leader"
          className="flex flex-col items-start justify-center"
        >
          <p>Transfer Amount</p>
        </label>
        <input
          type="number"
          defaultValue={500}
          onChange={handleChange}
          id="transfer_amount"
          name="transfer_amount"
          className="my-2 w-half border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />        
        <button onClick={TransferToken} className="p-3 px-10 text-white rounded-xl bg-[#73ca67] font-bold">
          Transfer
        </button>
        <br>
        </br>
        <div>
          {
            showEnable?(
              <button onClick={checkBalance} className="p-3 px-10 text-white rounded-xl bg-[#73ca67] font-bold">
              Check Balance
              </button>) : ''
          }
        </div>
        <div>
          {
            showEnable?(<p className="font-semibold text-lg text-green-600">Receiver balance is {transferDetail}</p>) : ''
          }
        </div>
      </div>
    </div>
  )
}

export default Transfer

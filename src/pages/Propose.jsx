import React, { createContext, useContext,useState, useEffect } from "react";
import { ethers } from 'ethers';
import { TransactionContext } from '../context/TransactionContext';
import { creditABI, creditAddress, nftABI, nftAddress } from '../utils/constants';

// Components


function Propose() {
  const [input, setInput] = useState({
    proposal_address: "",  
    participation_leader: 0,
    execution_leader: 0,
    popularization_leader: 0,
    participation_attender: 0,
    execution_attender: 0,
    popularization_attender: 0, 
  });

  const [showEnable, setShowEnable] = useState(false);
  const [proposeDetail, setProposeDetail] = useState("");

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

  async function GrantMember() {
    if (!input) return

    // console.log(input.member_account);
    // console.log(input.owner_account);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const creditContract = createCreditContract();
        let transRx = await creditContract.propose_simple(input.proposal_address, 
          input.participation_leader,
          input.execution_leader,
          input.popularization_leader,
          input.participation_attender,
          input.execution_attender,
          input.popularization_attender);

          creditContract.on('ProposeCode', function(event, seccode){
            console.log(seccode); 
            setProposeDetail(String(seccode));
            setShowEnable(true);
          })

      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
        <h1 className="font-semibold text-lg text-yellow-200">Abi Propose Simple</h1>
        <label
          htmlFor="proposal_address"
          className="flex flex-col items-start justify-center"
        >
          <p>Proposal Link</p>
        </label>
        <input
          onChange={handleChange}
          id="proposal_address"
          name="proposal_address"
          className="my-2 w-full border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <label
          htmlFor="participation_leader"
          className="flex flex-col items-start justify-center"
        >
          <p>Participation Adward for Leader</p>
        </label>
        <input
          type="number"
          defaultValue={3}
          onChange={handleChange}
          id="participation_leader"
          name="participation_leader"
          className="my-2 w-half border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <label
          htmlFor="execution_leader"
          className="flex flex-col items-start justify-center"
        >
          <p>Execution Adward for Leader</p>
        </label>
        <input
          type="number"
          defaultValue={3}
          onChange={handleChange}
          id="execution_leader"
          name="execution_leader"
          className="my-2 w-half border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <label
          htmlFor="popularization_leader"
          className="flex flex-col items-start justify-center"
        >
          <p>Popularization Adward for Leader</p>
        </label>
        <input
          type="number"
          defaultValue={3}
          onChange={handleChange}
          id="popularization_leader"
          name="popularization_leader"
          className="my-2 w-half border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <label
          htmlFor="participation_leader"
          className="flex flex-col items-start justify-center"
        >
          <p>Participation Adward for Attender</p>
        </label>
        <input
          type="number"
          defaultValue={1}
          onChange={handleChange}
          id="participation_attender"
          name="participation_attender"
          className="my-2 w-half border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <label
          htmlFor="execution_attender"
          className="flex flex-col items-start justify-center"
        >
          <p>Execution Adward for Attender</p>
        </label>
        <input
          type="number"
          defaultValue={1}
          onChange={handleChange}
          id="execution_attender"
          name="execution_attender"
          className="my-2 w-half border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <label
          htmlFor="popularization_attender"
          className="flex flex-col items-start justify-center"
        >
          <p>Popularization Adward for Attender</p>
        </label>
        <input
          type="number"
          defaultValue={1}
          onChange={handleChange}
          id="popularization_attender"
          name="popularization_attender"
          className="my-2 w-half border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />
        <button onClick={GrantMember} className="p-3 px-10 text-white rounded-xl bg-[#73ca67] font-bold">
          Propose
        </button>
        <div>
          {
            showEnable?(<p className="font-semibold text-lg text-green-600">Propose Code is {proposeDetail}</p>) : ''
          }
        </div>
      </div>
    </div>
  )
}

export default Propose

import React, { createContext, useContext,useState, useEffect } from "react";
import { ethers } from 'ethers';
import { TransactionContext } from '../context/TransactionContext';
import { creditABI, creditAddress, nftABI, nftAddress } from '../utils/constants';
import { useToast } from '../context/toast_context';
// Components


function Vote() {
  const [input, setInput] = useState({
    member_account: "",
    member_name: "",
  });

  const {
    currentAccount,
  } = useContext(TransactionContext);

  const [count, setCount] = useState(0);
  const [htmlTxt, setHtmlTxt] = useState("");

  const [eventAddress, setEventAddress] = useState('');
  const [showEnable, setShowEnable] = useState(false);
  const [voteDetail, setVoteDetail] = useState("");
  let proposal_address = "";

  const { showToast } = useToast()

  useEffect(() => {

    getEventAddress();
    
    getVoteMajority();
  }, []);

  useEffect(() => {
    console.log("get event link 2: ",eventAddress);
    fetch(eventAddress)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const content_size = doc.body.textContent.length;
        console.log("get doc: ",content_size);
        if(content_size < 1500){
          setHtmlTxt(doc.body.textContent);
          // document.getElementById('event_detail').innerHTML = doc.body.textContent;
        }
      });
  }, [eventAddress]);


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

  async function getEventAddress() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const creditContract = createCreditContract();

        proposal_address = 
          await creditContract.getCurEventAddress();

        console.log("get event link 1: ",proposal_address);
        setEventAddress(proposal_address);
      }
    } catch (error) {
      console.error(error);

      showToast({
        title: 'Contract Error',
        text: error.message,
        type: 'danger',
      })
    }
  }
  async function getVoteMajority() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const creditContract = createCreditContract();

        const vote_majority = 
          await creditContract.getVoteMajority();

        console.log(vote_majority);

      }
    } catch (error) {
      console.error(error);

      showToast({
        title: 'Majority Error',
        text: error.error.message,
        type: 'danger',
      })
    }
  }
  async function Vote_Agree() {
    if (!input) return

    // console.log(input.member_account);
    // console.log(input.owner_account);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const creditContract = createCreditContract();
        let transRx = await creditContract.vote_simple(true); 

        creditContract.on('VoteMajority', function(event, votenum){
          console.log(votenum); 
          setVoteDetail(String(votenum));
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

  async function Vote_Oppose() {
    if (!input) return

    // console.log(input.member_account);
    // console.log(input.owner_account);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const creditContract = createCreditContract();
        let transRx = await creditContract.vote_simple(false); 

        creditContract.on('VoteMajority', function(event, votenum){
          console.log(votenum); 
          setVoteDetail(String(votenum));
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ flex: 1 }} className="flex w-full justify-center items-center" >
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
        <h1 className="font-semibold text-lg text-yellow-200">Abi Voting</h1>
        <h1 className="font-semibold text-lg text-yellow-200">议案投票</h1>
        <label
          htmlFor="proposal_address"
          onClick={()=> setCount(count + 1)}
          className="flex flex-col items-start justify-center"
        >
          <p>Proposal Link（议案网址）</p>
        </label>
        <input
          rereadonly={"true"}
          disabled="disabled" 
          value = {eventAddress}
          id="proposal_address"
          name="proposal_address"
          className="my-2 w-full border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
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
          value = {currentAccount}
          id="member_account"
          name="member_account"
          className="my-2 w-full border border-gray-200 p-2 rounded-xl focus-visible:border-[#73c000]"
        />

        <button onClick={Vote_Agree} className="p-3 px-10 text-white rounded-xl bg-[#73ca67] font-bold">
          Agree
        </button>
        <br>
        </br>
        <div>
          <button onClick={Vote_Oppose} className="p-3 px-10 text-white rounded-xl bg-[#ca9267] font-bold">
            Oppose
          </button>
        </div>
        <div>
          {
            showEnable?(<p className="font-semibold text-lg text-green-600">Vote Num is {voteDetail}</p>) : ''
          }
        </div>
        <br>
        </br>
      </div>
    </div>

    <div style={{ flex: 1 }} className="flex w-full justify-center items-center">
        <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center ">
        <p id="event_detail" className="font-semibold text-lg text-red-600">{htmlTxt}</p>
      </div>
    </div>

    </div>


  )
}

export default Vote

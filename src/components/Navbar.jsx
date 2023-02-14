import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom"
import { TransactionContext } from '../context/TransactionContext';
import { UserCircleIcon, CreditCardIcon } from "@heroicons/react/outline"
import { UserIcon } from "@heroicons/react/solid"
import clsx from "clsx"

const truncate = (address) => {
  return address && address.slice(0, 4) + "..." + address.slice(-2)
}

function Button({ text, bg, padding }) {
  return (
    <div>
      <button
        className={`
          ${padding || 'px-6 py-2'} text-sm font-semibold uppercase 
          rounded-sm text-white transition ${bg}`}
      >
        <span>{text}</span>
      </button>
    </div>
  );
}


function Navbar() {
  const {
    connectWallet,
    currentAccount,
    handleChange,
    error,
  } = useContext(TransactionContext);
  // const handleWalletConnect = () => {
  //   console.log("Hello Approve")
  // };
  return (
    <div className="fixed left-0 right-0 top-0 h-16 shadow-md border-b-2 border-gray-100 bg-gray-900">
      <nav className="flex items-center container mx-auto h-full justify-between">
        <h1 className="font-semibold uppercase text-lg text-gray-200">
          Abi DAO（默许行动者，行者自付，行胜于言）
        </h1>
        <div>
          <nav className="flex items-center space-x-10 text-sm">
            <li><Link to="http://whitepaper.abidao.xyz/" className="text-gray-400 hover:text-gray-100">WhitePaper</Link></li>          
            <li><NavLink to="/Grant" className="text-gray-400 hover:text-gray-100">Grant</NavLink></li>
            <li><NavLink to="/ApplyNft" className="text-gray-400 hover:text-gray-100">ApplyNft</NavLink></li>
            <li><NavLink to="/Spawn" className="text-gray-400 hover:text-gray-100">Spawn</NavLink></li>
            <li><NavLink to="/Propose" className="text-gray-400 hover:text-gray-100">Propose</NavLink></li>
            <li><NavLink to="/Vote" className="text-gray-400 hover:text-gray-100">Vote</NavLink></li>
            <li><NavLink to="/Attend" className="text-gray-400 hover:text-gray-100">Attend</NavLink></li>

            <NavLink
              className={({ isActive }) =>
                clsx(
                  "hover:text-gray-100",
                  isActive &&
                  "text-gray-400",
                )
              }
              to="."
            >
              {currentAccount ? (
                <UserIcon className="text-blue-500 h-8 w-8" />
              ) : (
                <UserCircleIcon className="h-8 w-8" />
              )}
            </NavLink>
            {!error && currentAccount ? (
              <div className="text-gray-400">{truncate(currentAccount)}</div>
            ) : (
              <button
                onClick={connectWallet}
                className="p-2 px-4 bg-[#73c000] text-white rounded-xl"
              >
                CONNECT WALLET
              </button>
            )}
          </nav>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;

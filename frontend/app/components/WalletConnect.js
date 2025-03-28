"use client";

import { useState, useEffect } from "react";

export function useWallet() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  useEffect(() => {
    async function fetchAccount() {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) setAccount(accounts[0]);
        } catch (error) {
          console.error("Error fetching wallet account:", error);
        }
      }
    }
    fetchAccount();
  }, []);

  return { account, connectWallet };
}

export default function WalletConnect() {
  const { account, connectWallet } = useWallet();

  return (
    <div>
      <button onClick={connectWallet} className="px-4 py-2 bg-blue-500 text-white rounded">
        {account ? `Connected: ${account.substring(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
      </button>
    </div>
  );
}

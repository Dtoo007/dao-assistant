
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

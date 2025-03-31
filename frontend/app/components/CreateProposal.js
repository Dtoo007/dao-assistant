"use client";

import { useState } from "react";
import { getContract } from "@/app/util/hederaDAO";
import { ethers } from "ethers";

export default function CreateProposal() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState(null);
  const [isMember, setIsMember] = useState(false);

  // Join DAO Function
  const joinDAO = async () => {
    if (typeof window.ethereum === "undefined") {
      setMessage("❌ MetaMask not detected. Please install MetaMask.");
      return;
    }
  
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  
      if (!accounts || accounts.length === 0) {
        setMessage("❌ No wallet address found. Please connect your wallet.");
        return;
      }
  
      const userAccount = accounts[0]; 
      setAccount(userAccount);
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = await getContract(signer); // ✅ Ensure signer is passed
  
      if (!contract) {
        setMessage("❌ Failed to join DAO. No contract instance found.");
        return;
      }
  
      const alreadyMember = await contract.isMember(userAccount);
      if (alreadyMember) {
        setIsMember(true);
        setMessage("✅ You are already a member! You can create proposals.");
        return;
      }
  
      const reputation = 10;
      const stakedTokens = ethers.parseUnits("1", 18);
      const tx = await contract.joinDAO(reputation, stakedTokens);
      await tx.wait();
  
      setIsMember(true);
      setMessage("✅ Successfully joined the DAO! You can now create proposals.");
    } catch (error) {
      console.error("Error joining DAO:", error);
      setMessage(`❌ Failed to join DAO. Error: ${error.reason || error.message}`);
    }
  };

  
  // const joinDAO = async () => {
  //   if (typeof window.ethereum === "undefined") {
  //     setMessage("❌ MetaMask not detected. Please install MetaMask.");
  //     return;
  //   }
  //   try {
  //     // Request wallet connection if not already connected
  //     const accounts = await window.ethereum.request({
  //       method: "eth_requestAccounts",
  //     });
  
  //     if (!accounts || accounts.length === 0) {
  //       setMessage("❌ No wallet address found. Please connect your wallet.");
  //       return;
  //     }
  
  //     const userAccount = accounts[0]; // Get the first connected account
  //     setAccount(userAccount);
  
  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     const signer = await provider.getSigner();
  //     const contract = await getContract(signer);
  
  //     if (!contract) {
  //       setMessage("❌ Failed to join DAO. No contract instance found.");
  //       return;
  //     }
  
  //     const alreadyMember = await contract.isMember(userAccount);
  //     if (alreadyMember) {
  //       setIsMember(true);
  //       setMessage("✅ You are already a member! You can create proposals.");
  //       return;
  //     }
  
  //     const reputation = 10;
  //     const stakedTokens = ethers.parseUnits("1", 18);
  //     const tx = await contract.joinDAO(reputation, stakedTokens);
  //     await tx.wait();
  
  //     setIsMember(true);
  //     setMessage("✅ Successfully joined the DAO! You can now create proposals.");
  //   } catch (error) {
  //     console.error("Error joining DAO:", error);
  //     setMessage(`❌ Failed to join DAO. Error: ${error.reason || error.message}`);
  //   }
  // };
  

  // Submit Proposal Function
  // const submitProposal = async () => {
  //   if (!title || !description || !duration) {
  //     alert("Please fill all fields.");
  //     return;
  //   }

  //   setLoading(true);
  //   setMessage("");

  //   try {
  //     const contract = await getContract();
  //     const tx = await contract.createProposal(title, description, parseInt(duration));
  //     await tx.wait();

  //     setMessage("✅ Proposal created successfully!");
  //     setTitle("");
  //     setDescription("");
  //     setDuration("");
  //   } catch (error) {
  //     console.error("Error creating proposal:", error);
  //     setMessage("❌ Failed to create proposal.");
  //   }

  //   setLoading(false);
  // };


  const generateSummary = async (title, description) => {
  try {
    const response = await fetch("/api/generate-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    const data = await response.json();
    return data.summary || "No summary available.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Failed to generate summary.";
  }
};

const submitProposal = async () => {
  if (!title || !description || !duration) {
      alert("Please fill all fields.");
      return;
  }

  setLoading(true);
  setMessage("");

  try {
      if (typeof window.ethereum === "undefined") {
          setMessage("❌ MetaMask not detected. Please install MetaMask.");
          setLoading(false);
          return;
      }

      // Connect wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = await getContract(signer); // ✅ Pass signer to getContract()

      if (!contract) {
          setMessage("❌ Contract instance not found.");
          setLoading(false);
          return;
      }

      const tx = await contract.createProposal(title, description, parseInt(duration, 10));
      console.log("Submitting Proposal:", title, description, duration);

      await tx.wait();

      setMessage("✅ Proposal created successfully!");
      setTitle("");
      setDescription("");
      setDuration("");
  } catch (error) {
      console.error("Error creating proposal:", error);
      setMessage(`❌ Failed to create proposal. ${error.reason || error.message}`);
  }

  setLoading(false);
};


  return (
    <div className="p-4 border border-gray-500 rounded my-4">
      {/* Join DAO Button */}
      <button
        onClick={joinDAO}
        className={`px-4 py-2 rounded ${isMember ? "bg-gray-500 text-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
        disabled={isMember}
      >
        {isMember ? "Joined DAO" : "Join DAO - Connect Wallet"}
      </button>
      {message && <p className="mt-2 text-white">{message}</p>}

      {/* Proposal Form */}
      {isMember && (
        <>
          <h2 className="text-lg font-bold mt-4">Create Proposal</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded my-2"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded my-2"
          />
          <input
            type="number"
            placeholder="Duration (in seconds)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 border rounded my-2"
          />
          <button
            onClick={submitProposal}
            className="px-4 py-2 rounded bg-green-500 text-white"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Create Proposal"}
          </button>
        </>
      )}
    </div>
  );
}

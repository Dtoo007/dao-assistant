"use client";

import { useEffect, useState } from "react";
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
<<<<<<< HEAD
      // Check if window.ethereum exists
      if (!window.ethereum) {
        setMessage("❌ Metamask not installed.");
        return;
      }

      // Request wallet connection if not already connected
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

=======
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  
>>>>>>> d0bf827776ac420ce0413e2a3bfe34f38f86bfd4
      if (!accounts || accounts.length === 0) {
        setMessage("❌ No wallet address found. Please connect your wallet.");
        return;
      }
<<<<<<< HEAD

      const userAccount = accounts[0]; // Get the first connected account
      setAccount(userAccount);

      // For demo purposes, we'll create a mock provider and signer
      let signer;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      } catch (error) {
        console.error("Error creating provider/signer:", error);
        // Continue with mock implementation
      }

      const contract = await getContract(signer);

=======
  
      const userAccount = accounts[0]; 
      setAccount(userAccount);
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = await getContract(signer); // ✅ Ensure signer is passed
  
>>>>>>> d0bf827776ac420ce0413e2a3bfe34f38f86bfd4
      if (!contract) {
        setMessage("❌ Failed to join DAO. No contract instance found.");
        return;
      }

      // Check if already a member
      try {
        const alreadyMember = userAccount
          ? await contract.isMember(userAccount)
          : false;
        if (alreadyMember) {
          setIsMember(true);
          setMessage("✅ You are already a member! You can create proposals.");
          return;
        }
      } catch (error) {
        console.error("Error checking membership:", error);
      }

      // Join the DAO
      const reputation = 10;
      const stakedTokens = ethers.parseUnits("1", 18);

      try {
        const tx = await contract.joinDAO(reputation, stakedTokens);
        await tx.wait();

        setIsMember(true);
        setMessage(
          "✅ Successfully joined the DAO! You can now create proposals."
        );
      } catch (error) {
        console.error("Error joining DAO:", error);
        setMessage("❌ Failed to join DAO. Please try again.");
      }
    } catch (error) {
      console.error("Error in joinDAO function:", error);
      setMessage(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };
<<<<<<< HEAD
=======

  
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
  
>>>>>>> d0bf827776ac420ce0413e2a3bfe34f38f86bfd4

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

<<<<<<< HEAD
    try {
      const contract = await getContract();
      const tx = await contract.createProposal(
        title,
        description,
        Number.parseInt(duration)
      );
=======
>>>>>>> d0bf827776ac420ce0413e2a3bfe34f38f86bfd4
      await tx.wait();

      // Add the new proposal to the list for demo purposes
      // const newProposal = {
      //   id: proposals.length + 1,
      //   title,
      //   description,
      //   votesFor: 0,
      //   votesAgainst: 0,
      //   status: "Active",
      //   timeLeft: `${duration} seconds`,
      // }

      // setProposals([newProposal, ...proposals])
      setMessage("✅ Proposal created successfully!");
<<<<<<< HEAD
      // setTitle("")
      // setDescription("")
      // setDuration("")
    } catch (error) {
=======
      setTitle("");
      setDescription("");
      setDuration("");
  } catch (error) {
>>>>>>> d0bf827776ac420ce0413e2a3bfe34f38f86bfd4
      console.error("Error creating proposal:", error);
      setMessage(`❌ Failed to create proposal. ${error.reason || error.message}`);
  }

  setLoading(false);
};


  // For demo purposes
  useEffect(() => {
    // Check if we should simulate already being a member
    const checkMembership = async () => {
      try {
        // Try to get the contract and check membership
        const contract = await getContract();
        const storedMembership = localStorage.getItem("isMember") === "true";

        if (storedMembership) {
          setIsMember(true);
          setMessage("✅ You are already a member! You can create proposals.");
        }
      } catch (error) {
        console.error("Error checking initial membership:", error);
      }
    };

    checkMembership();
  }, []);

  return (
    <div
      className=" bg-black text-white font-sans"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.7)), url('/placeholder.svg?height=1080&width=1920')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <header className="text-center py-6">
        <div className="relative mx-auto max-w-md h-40 mb-8 flex items-center justify-center">
          <div className="absolute w-64 h-64 rounded-full border-4 border-purple-500/30 animate-pulse"></div>
          <div className="absolute w-56 h-56 rounded-full border-2 border-cyan-400/40"></div>
          <div className="absolute w-48 h-48 rounded-full border border-cyan-300/20"></div>
          <div
            className="z-10 text-2xl font-bold text-cyan-300"
            style={{
              textShadow: "0 0 10px rgba(56, 189, 248, 0.7)",
            }}
          >
            Hedera DAO
          </div>
        </div>
      </header>

      {/* Main Banner */}
      <div className="relative mx-auto max-w-5xl mb-12">
        <div className="border border-cyan-500/50 bg-slate-900/60 backdrop-blur-sm rounded-lg p-4 shadow-lg shadow-cyan-500/20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          <div className="relative z-10 text-center py-10">
            <h2
              className="text-5xl md:text-6xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mb-2"
              style={{
                textShadow: "0 0 15px rgba(56, 189, 248, 0.5)",
                letterSpacing: "0.15em",
              }}
            >
              DECENTRALIZATION
            </h2>
            <h2
              className="text-5xl md:text-6xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400"
              style={{
                textShadow: "0 0 15px rgba(56, 189, 248, 0.5)",
                letterSpacing: "0.15em",
              }}
            >
              GOVERNANCE
            </h2>
          </div>
        </div>
      </div>

      {/* Circular Proposal Section */}

      {/* Create Proposal Section */}
      <div className="max-w-2xl mx-auto mb-2">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-lg">
          {/* Join DAO Button */}
          <div className="mb-4 ">
            <button
              onClick={joinDAO}
              className={`px-4 py-2 rounded-md  ${
                isMember
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-500 text-white transition-colors mx-auto"
              }`}
              disabled={isMember}
            >
              {isMember ? "Joined DAO" : "Join DAO - Connect Wallet"}
            </button>

            {message && (
              <div className="mt-3 flex items-start gap-2">
                {message.includes("✅") ? (
                  <span className="text-green-400 text-xl">✅</span>
                ) : (
                  <span className="text-red-400 text-xl">❌</span>
                )}
                <p
                  className={
                    message.includes("✅") ? "text-green-300" : "text-red-300"
                  }
                >
                  {message.replace("✅ ", "").replace("❌ ", "")}
                </p>
              </div>
            )}
          </div>

          {/* Proposal Form */}
          {isMember && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-cyan-300">
                Create Proposal
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-slate-900/80 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white"
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-slate-900/80 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white min-h-[100px]"
                />
                <input
                  type="number"
                  placeholder="Duration (in seconds)"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-3 bg-slate-900/80 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white"
                />
                <button
                  onClick={submitProposal}
                  className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-400 text-white font-medium transition-colors"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Create Proposal"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Get Proposals Count Button */}

      {/* DAO Proposals Section */}
    </div>
  );
}

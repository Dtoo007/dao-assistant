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

  const joinDAO = async () => {
    try {
      if (!account) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      }

      const contract = await getContract(); // ✅ Now correctly awaited

      if (!contract) {
        setMessage("❌ Failed to join DAO. No contract instance found.");
        return;
      }

      const alreadyMember = await contract.isMember(account);
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
      setMessage(
        "✅ Successfully joined the DAO! You can now create proposals."
      );
    } catch (error) {
      console.error("Error joining DAO:", error);
      setMessage(
        `❌ Failed to join DAO. Error: ${error.reason || error.message}`
      );
    }
  };

  return (
    <div className="p-4 border border-gray-500 rounded my-4">
      <button
        onClick={joinDAO}
        className={`px-4 py-2 rounded ${
          isMember
            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white"
        }`}
        disabled={isMember}
      >
        {isMember ? "Joined DAO" : "Join DAO - Connect Wallet"}
      </button>
      {message && <p className="mt-2 text-white">{message}</p>}

      <h2 className="text-lg font-bold mt-4">Create Proposal</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded my-2"
        disabled={!isMember}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded my-2"
        disabled={!isMember}
      />
      <input
        type="number"
        placeholder="Duration (in seconds)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="w-full p-2 border rounded my-2"
        disabled={!isMember}
      />

      {!isMember && (
        <p className="mt-2 text-red-500">Join the DAO to create proposals.</p>
      )}
    </div>
  );
}

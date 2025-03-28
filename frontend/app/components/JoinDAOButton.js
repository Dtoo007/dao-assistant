"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "@/app/util/hederaDAO";

export default function JoinDAOButton() {
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState("");

  const joinDAO = async () => {
    try {
      setJoining(true);
      setMessage("");

      // Ensure MetaMask is available
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }

      // Connect wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Get contract with signer
      const contract = await getContract(signer);

      // Define reputation & tokens (replace with actual logic)
    const reputation = 10; // Set based on user logic
    const stakedTokens = ethers.parseUnits("1", 18); // Assuming token has 18 decimals


      // Call joinDAO function
      const tx = await contract.joinDAO(reputation, stakedTokens);
      await tx.wait(); // Wait for confirmation

      setMessage("✅ Successfully joined the DAO! You can now create proposals.");
    } catch (error) {
      console.error("Error joining DAO:", error);
      setMessage(`❌ Failed to join DAO. Error: ${error.reason || error.message}`);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div>
      <button
        onClick={joinDAO}
        disabled={joining}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {joining ? "Joining..." : "Join DAO"}
      </button>
      {message && <p className="mt-2 text-white">{message}</p>}
    </div>
  );
}

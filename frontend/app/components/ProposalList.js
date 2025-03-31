"use client";

import { useState, useEffect } from "react";
import { getContract } from "@/app/util/hederaDAO";
import { ethers } from "ethers";





export default function ProposalsList() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const contract = await getContract();
      const count = await contract.getProposalsCount();

      console.log("Total Proposals from contract:", count.toString());

      let proposalsArray = [];

      for (let i = 0; i < count; i++) {
        console.log(`Fetching proposal at index ${i}`);
        
        try {
          const proposal = await contract.getProposal(i);
          console.log("Proposal Data:", proposal);

          proposalsArray.push({
            id: i,
            title: proposal[0], // String
            description: proposal[1], // String
            // votes: proposal[2].toString(), // BigNumber -> String
            votesFor: proposal[2].toString(), // Correct votes for
            votesAgainst: proposal[3].toString(), // Correct votes against
            // votingDeadline: Number(proposal[3]), // BigNumber -> Number
            deadline: Number(proposal[4].toString()), // Convert to a number
            proposer: proposal[5],
          });

          setProposals(proposalsList);
        } catch (error) {
          console.error(`Error fetching proposal ${i}:`, error);
        }
      }
      

      console.log("Final Proposals Array:", proposalsArray);
      setProposals(proposalsArray);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  const vote = async (proposalId, support) => {
    setMessage("");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = await getContract(signer);

      const tx = await contract.vote(proposalId, support);
      await tx.wait();
      setMessage("✅ Vote submitted successfully!");
      fetchProposals(); // Refresh proposals after voting
    } catch (error) {
      console.error("Error submitting vote:", error);
      setMessage("❌ Failed to vote. Check console for details.");
    }
  };
  

  return (
    <div>
      <h2 className="text-xl font-bold mt-4">DAO Proposals</h2>
      {loading ? (
        <p>Loading proposals...</p>
      ) : proposals.length === 0 ? (
        <p>No proposals yet.</p>
      ) : (
        <ul className="mt-2">
          {proposals.map((proposal) => {
            const currentTime = Math.floor(Date.now() / 1000);
            const timeLeft = proposal.deadline - currentTime;
            const isExpired = timeLeft <= 0;
            const status = isExpired ? "Closed" : "Active";
            const remainingTime = isExpired
              ? "Expired"
              : `${Math.floor(timeLeft / 60)} min left`;
  
            return (
              <li
                key={proposal.id}
                className={`border p-3 my-2 rounded ${
                  isExpired ? "bg-gray-700 text-gray-400" : "bg-gray-800"
                }`}
              >
                <h3 className="text-lg font-bold">{proposal.title}</h3>
                <p>{proposal.description}</p>
                <p className="text-sm text-gray-400">
                  Votes For: {proposal.votesFor} | Votes Against: {proposal.votesAgainst}
                </p>
                <p className="text-sm">
                  <strong>Status:</strong> {status}
                </p>
                <p className="text-sm">
                  <strong>Time Left:</strong> {remainingTime}
                </p>
  
                {/* Voting Buttons */}
                <button
                  onClick={() => vote(proposal.id, true)}
                  className="px-4 py-2 bg-green-500 text-white rounded mr-2 disabled:opacity-50"
                  disabled={isExpired}
                >
                  Vote For
                </button>
                <button
                  onClick={() => vote(proposal.id, false)}
                  className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
                  disabled={isExpired}
                >
                  Vote Against
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
  
}

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

            votesFor: proposal[2].toString(), // Correct votes for
            votesAgainst: proposal[3].toString(), // Correct votes against

            deadline: Number(proposal[4].toString()), // Convert to a number
            proposer: proposal[5],
          });

          // setProposals(proposalsList);
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
      setMessage("❌ Failed to vote. You already voted.");
    }
  };

  return (
<<<<<<< HEAD
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mt-0">DAO Proposals</h2>
      {message && <p className="text-red-500 font-bold">{message}</p>}{" "}
      {/* Display error messages */}
=======
    <div>
      <h2 className="text-xl font-bold mt-4">DAO Proposals</h2>
      {message && <p className="text-red-500 font-bold">{message}</p>} {/* Display error messages */}
>>>>>>> d0bf827776ac420ce0413e2a3bfe34f38f86bfd4
      {loading ? (
        <p>Loading proposals...</p>
      ) : proposals.length === 0 ? (
        <p>No proposals yet.</p>
      ) : (
        <ul className="mt-2 ">
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
                className={`${
                  isExpired
                    ? "bg-gray-800 text-gray-500 backdrop-blur-sm border rounded-lg p-5 mb-4 shadow-lg"
                    : "bg-slate-900/100 backdrop-blur-sm border border-slate-700 rounded-lg p-5 mb-4 shadow-lg"
                }`}
              >
                <h3 className="text-lg font-semibold text-cyan-300 mb-1">
                  {proposal.title}
                </h3>
                <p className="text-slate-400 text-sm mb-2">
                  {proposal.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-3">
                  <div >
                    Votes For:{" "}
                    <span className="text-cyan-400"> {proposal.votesFor}</span>{" "}
                    | Votes Against:{" "}
                    <span className="text-red-400">
                      
                      {proposal.votesAgainst}
                    </span>
                  </div>
                  <div>
                    Status: <span className={`${isExpired ? "text-red-500" : "text-yellow-400"}`}>{status}</span>
                  </div>
                  <div>
                    Time Left:{" "}
                    <span className={`${isExpired ? "text-red-500" : "text-yellow-400"}`}> {remainingTime}</span>
                  </div>
                </div>

                {/* Voting Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => vote(proposal.id, true)}
                    className="px-4 py-1 bg-green-600 hover:bg-green-500 text-white text-sm rounded transition-colors"
                    disabled={isExpired}
                  >
                    Vote For
                  </button>
                  <button
                    onClick={() => vote(proposal.id, false)}
                    className="px-4 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition-colors"
                    disabled={isExpired}
                  >
                    Vote Against
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

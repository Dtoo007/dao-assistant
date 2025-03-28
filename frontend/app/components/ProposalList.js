"use client";
import { useState, useEffect } from "react";
import { getContract } from "@/app/util/hederaDAO";

export default function ProposalList() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const contract = await getContract();
        const proposalCount = await contract.getProposalsCount(); // Ensure it's awaited

        console.log("Total proposals:", proposalCount);

        let proposalsList = [];
        for (let i = 0; i < proposalCount; i++) {
          const proposal = await contract.getProposal(i); // ✅ Fetch each proposal correctly
          console.log(`Proposal ${i}:`, proposal);

          proposalsList.push({
            id: i, // ✅ Ensure React key is valid
            title: proposal[0],
            description: proposal[1],
            votes: proposal[2]?.toString() || "0", // ✅ Handle potential undefined values
            deadline: proposal[3]?.toString(),
            proposer: proposal[4],
          });
        }

        setProposals(proposalsList);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false); // ✅ Stop loading regardless of success or error
      }
    };

    fetchProposals();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mt-4">DAO Proposals</h2>
      {loading ? (
        <p>Loading proposals...</p>
      ) : proposals.length === 0 ? (
        <p>No proposals yet.</p>
      ) : (
        <ul className="mt-2">
          {proposals.map((proposal) => (
            <li key={proposal.id} className="border p-3 my-2 rounded bg-gray-800">
              <h3 className="text-lg font-bold">{proposal.title}</h3>
              <p>{proposal.description}</p>
              <p className="text-sm text-gray-400">Votes: {proposal.votes}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { getContract } from "@/app/util/hederaDAO";

export default function GetProposals() {
  const [count, setCount] = useState(null);

  const fetchProposalsCount = async () => {
    const contract = await getContract();
    if (contract) {
      try {
        const count = await contract.getProposalsCount(); // Call the function
        setCount(count.toString());
      } catch (error) {
        console.error("Error fetching proposals count:", error);
      }
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <button
        onClick={fetchProposalsCount}
        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors shadow-lg shadow-cyan-500/20"
      >
        Get Proposals Count
      </button>
      {count !== null && <p>Total Proposals: {count}</p>}
    </div>
  );
}

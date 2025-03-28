
"use client";

import { useState } from "react";
import { getContract } from "@/app/util/hederaDAO";

export default function CreateProposal() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submitProposal = async () => {
    if (!title || !description || !duration) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const contract = await getContract();
      const tx = await contract.createProposal(title, description, parseInt(duration));
      await tx.wait();

      setMessage("Proposal created successfully!");
      setTitle("");
      setDescription("");
      setDuration("");
    } catch (error) {
      console.error("Error creating proposal:", error);
      setMessage("Failed to create proposal.");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border border-gray-500 rounded my-4">
      <h2 className="text-lg font-bold">Create Proposal</h2>
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
        className="px-4 py-2 bg-green-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Create Proposal"}
      </button>
      {message && <p className="mt-2 text-white">{message}</p>}
    </div>
  );
}

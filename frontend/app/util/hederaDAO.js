"use client"; // Required for client-side actions

import { ethers } from "ethers";

export async function getContract(signer) {
  const contractAddress = "0x3cede3f2d58017a6c76ebab3bb9db6b897400a0f";
  // Your contract ABI here
  const CONTRACT_ABI = [
    {
      inputs: [
        {
          internalType: "string",
          name: "_title",
          type: "string",
        },
        {
          internalType: "string",
          name: "_description",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_votingDuration",
          type: "uint256",
        },
      ],
      name: "createProposal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_proposalId",
          type: "uint256",
        },
      ],
      name: "executeProposal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_reputation",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_stakedTokens",
          type: "uint256",
        },
      ],
      name: "joinDAO",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "leaveDAO",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "member",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "reputation",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "stakedTokens",
          type: "uint256",
        },
      ],
      name: "MemberJoined",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "member",
          type: "address",
        },
      ],
      name: "MemberLeft",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "description",
          type: "string",
        },
        {
          indexed: false,
          internalType: "address",
          name: "proposer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "deadline",
          type: "uint256",
        },
      ],
      name: "ProposalCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
      ],
      name: "ProposalExecuted",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "support",
          type: "bool",
        },
      ],
      name: "vote",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "voter",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "support",
          type: "bool",
        },
      ],
      name: "VoteCast",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "voter",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "support",
          type: "bool",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "votesFor",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "votesAgainst",
          type: "uint256",
        },
      ],
      name: "VoteCast",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "voter",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "support",
          type: "bool",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "weight",
          type: "uint256",
        },
      ],
      name: "Voted",
      type: "event",
    },
    {
      inputs: [],
      name: "getAllProposals",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "title",
              type: "string",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "votesFor",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "votesAgainst",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "votingDeadline",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "executed",
              type: "bool",
            },
            {
              internalType: "address",
              name: "proposer",
              type: "address",
            },
          ],
          internalType: "struct HederaDAO.Proposal[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_index",
          type: "uint256",
        },
      ],
      name: "getProposal",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
        {
          internalType: "string",
          name: "",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getProposalsCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "hasVoted",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "isMember",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "members",
      outputs: [
        {
          internalType: "bool",
          name: "isMember",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "reputation",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "stakedTokens",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "proposals",
      outputs: [
        {
          internalType: "string",
          name: "title",
          type: "string",
        },
        {
          internalType: "string",
          name: "description",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "votesFor",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "votesAgainst",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "votingDeadline",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "executed",
          type: "bool",
        },
        {
          internalType: "address",
          name: "proposer",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  if (!signer) {
    throw new Error("Signer is required to interact with the contract.");
  }

  return new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
}

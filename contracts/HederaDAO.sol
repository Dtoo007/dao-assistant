// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HederaDAO {

    struct Member {
        bool isMember;
        uint256 reputation;
        uint256 stakedTokens;
    }

    struct Proposal {
        string title;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 votingDeadline;
        bool executed;
        address proposer;
    }

    mapping(address => Member) public members;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    Proposal[] public proposals;
    address public owner;

    event MemberJoined(address indexed member, uint256 reputation, uint256 stakedTokens);
    event MemberLeft(address indexed member);
    event ProposalCreated(uint256 indexed proposalId, string description, address proposer, uint256 deadline);
    event Voted(uint256 indexed proposalId, address voter, bool support, uint256 weight);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId);
    event VoteCast(uint256 proposalId, address voter, bool support, uint256 votesFor, uint256 votesAgainst);

    modifier onlyMember() {
        require(members[msg.sender].isMember, "Not a DAO member");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function isMember(address user) public view returns (bool) {
        return members[user].isMember;
    }

    function joinDAO(uint256 _reputation, uint256 _stakedTokens) external {
        require(!members[msg.sender].isMember, "Already a member");
        members[msg.sender] = Member(true, _reputation, _stakedTokens);
        emit MemberJoined(msg.sender, _reputation, _stakedTokens);
    }

    function leaveDAO() external onlyMember {
        members[msg.sender].isMember = false;
        members[msg.sender].reputation = 0;
        members[msg.sender].stakedTokens = 0;
        emit MemberLeft(msg.sender);
    }

    function createProposal(
        string memory _title, 
        string memory _description, 
        uint256 _votingDuration
    ) external onlyMember {
        require(_votingDuration > 0, "Invalid voting duration");

        proposals.push(Proposal({
            title: _title,
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            votingDeadline: block.timestamp + _votingDuration,
            executed: false,
            proposer: msg.sender
        }));

        emit ProposalCreated(proposals.length - 1, _description, msg.sender, block.timestamp + _votingDuration);
    }

    function getProposalsCount() public view returns (uint256) {
        return proposals.length;
    }

    function getProposal(uint256 _index) 
        public 
        view 
        returns (
            string memory, 
            string memory, 
            uint256, 
            uint256, 
            uint256, 
            address
        ) 
    {
        Proposal storage proposal = proposals[_index];
        return (
            proposal.title, 
            proposal.description, 
            proposal.votesFor, 
            proposal.votesAgainst, 
            proposal.votingDeadline, 
            proposal.proposer
        );
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        return proposals;
    }

    function vote(uint256 proposalId, bool support) public {
        Proposal storage proposal = proposals[proposalId];
        require(!hasVoted[proposalId][msg.sender], "You have already voted");
        require(block.timestamp < proposal.votingDeadline, "Voting has ended");

        hasVoted[proposalId][msg.sender] = true;

        if (support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }

        emit VoteCast(proposalId, msg.sender, support, proposal.votesFor, proposal.votesAgainst);
    }

    function executeProposal(uint256 _proposalId) external onlyMember {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];

        require(block.timestamp >= proposal.votingDeadline, "Voting period not ended yet");
        require(!proposal.executed, "Proposal already executed");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal rejected");

        proposal.executed = true;
        emit ProposalExecuted(_proposalId);
    }
}
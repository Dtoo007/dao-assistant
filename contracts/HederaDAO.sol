
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HederaDAO {
    struct Member {
        bool isMember;
        uint256 reputation;
        uint256 stakedTokens;
    }

    struct Proposal {
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        address proposer;
    }

    mapping(address => Member) public members;
    Proposal[] public proposals;
    address public owner;

    event MemberJoined(address indexed member, uint256 reputation, uint256 stakedTokens);
    event ProposalCreated(uint256 indexed proposalId, string description, address proposer);
    event Voted(uint256 indexed proposalId, address voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);

    modifier onlyMember() {
        require(members[msg.sender].isMember, "Not a DAO member");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function joinDAO(uint256 _reputation, uint256 _stakedTokens) external {
        require(!members[msg.sender].isMember, "Already a member");
        members[msg.sender] = Member(true, _reputation, _stakedTokens);
        emit MemberJoined(msg.sender, _reputation, _stakedTokens);
    }

    function createProposal(string memory _description) external onlyMember {
        proposals.push(Proposal({
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            executed: false,
            proposer: msg.sender
        }));
        emit ProposalCreated(proposals.length - 1, _description, msg.sender);
    }

    function vote(uint256 _proposalId, bool _support) external onlyMember {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        require(!proposals[_proposalId].executed, "Proposal already executed");
        
        uint256 votingPower = members[msg.sender].reputation;
        require(votingPower > 0, "No reputation to vote");
        
        if (_support) {
            proposals[_proposalId].votesFor += votingPower;
        } else {
            proposals[_proposalId].votesAgainst += votingPower;
        }
        emit Voted(_proposalId, msg.sender, _support, votingPower);
    }

    function executeProposal(uint256 _proposalId) external onlyMember {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.executed, "Proposal already executed");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal rejected");
        
        proposal.executed = true;
        emit ProposalExecuted(_proposalId);
    }
}

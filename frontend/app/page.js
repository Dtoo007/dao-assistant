import WalletConnect from "@/app/components/WalletConnect";
import GetProposals from "@/app/components/GetProposals";
import ProposalList from "./components/ProposalList";
import CreateProposal from "./components/CreateProposal";
// import JoinDAOButton from "./components/JoinDAOButton";
import Banner from "./components/Banner";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center space-y-4 p-10">
      <h1 className="text-2xl font-bold">Hedera DAO</h1>
      <Banner />
      <WalletConnect />
      {/* <JoinDAOButton /> */}
      <CreateProposal />
      <GetProposals />
      <ProposalList />
    </main>
  );
}

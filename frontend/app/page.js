<<<<<<< HEAD

// import GetProposals from "@/app/components/GetProposals";
=======
// import WalletConnect from "@/app/components/WalletConnect";
import GetProposals from "@/app/components/GetProposals";
>>>>>>> d0bf827776ac420ce0413e2a3bfe34f38f86bfd4
import ProposalList from "./components/ProposalList";
import CreateProposal from "./components/CreateProposal";
;

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center space-y-4 p-10">
<<<<<<< HEAD

=======
      <h1 className="text-2xl font-bold">Hedera DAO</h1>
      <Banner />
      {/* <WalletConnect /> */}
      {/* <JoinDAOButton /> */}
>>>>>>> d0bf827776ac420ce0413e2a3bfe34f38f86bfd4
      <CreateProposal />
      {/* <GetProposals /> */}
      <ProposalList />
    </main>
  );
}

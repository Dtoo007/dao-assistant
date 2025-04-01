
// import GetProposals from "@/app/components/GetProposals";
import ProposalList from "./components/ProposalList";
import CreateProposal from "./components/CreateProposal";
;

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center space-y-4 p-10">

      <CreateProposal />
      {/* <GetProposals /> */}
      <ProposalList />
    </main>
  );
}

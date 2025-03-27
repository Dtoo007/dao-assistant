import WalletConnect from "@/app/components/WalletConnect";
import GetProposals from "@/app/components/GetProposals"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center space-y-4 p-10">
      <h1 className="text-2xl font-bold">Hedera DAO</h1>
      <WalletConnect />
      <GetProposals />
    </main>
  );
}

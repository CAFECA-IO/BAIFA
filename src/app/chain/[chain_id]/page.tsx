import BlockList from '@/components/chain/block_list';
import TransactionList from '@/components/chain/transaction_list';
import { MOCK_CHAINS } from '@/data/mock_chains';
import ChainOverview from '@/components/chain/chain_overview';

export default async function ChainDetailPage({
    params,
}: {
    params: Promise<{ chainId: string }>;
}) {
    const { chainId } = await params;
    const chain = MOCK_CHAINS.find((c) => c.id === chainId);

    if (!chain) {
        return (
            <div className="flex h-screen items-center justify-center">
                <h1 className="text-2xl font-bold">Chain Not Found: {chainId}</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl pt-6 py-20 text-black">
                <ChainOverview chain={chain} />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <BlockList />
                    <TransactionList />
                </div>
            </div>
        </div>
    );
}

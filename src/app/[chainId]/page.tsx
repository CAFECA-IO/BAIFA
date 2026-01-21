import ChainHeader from '@/components/chain/chain-header';
import ChainStats from '@/components/chain/chain-stats';
import BlockList from '@/components/chain/block-list';
import TransactionList from '@/components/chain/transaction-list';
import { MOCK_CHAINS } from '@/data/mock-chains';

type Props = {
    params: Promise<{ chainId: string }>;
};

export default async function ChainDetailPage({ params }: Props) {
    const { chainId } = await params;
    const chain = MOCK_CHAINS.find((c) => c.id === chainId);

    if (!chain) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
                <div>Chain not found: {chainId}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-black p-6">
            <div className="mx-auto max-w-7xl">
                <ChainHeader chain={chain} />
                <ChainStats stats={chain.stats} />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <BlockList />
                    <TransactionList />
                </div>
            </div>
        </div>
    );
}

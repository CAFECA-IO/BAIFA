'use client';

import { useState } from 'react';
import { IChain } from '@/interfaces/chain';
import ChainHeader from '@/components/chain/chain_header';
import ChainStats from '@/components/chain/chain_stats';

export default function ChainOverview({ chain }: { chain: IChain }) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <>
            <ChainHeader
                chain={chain}
                showDetails={showDetails}
                onToggleDetails={() => setShowDetails(!showDetails)}
            />
            <ChainStats
                stats={chain.stats}
                details={chain.details}
                showDetails={showDetails}
            />
        </>
    );
}

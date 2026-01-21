'use client';

import { useState } from 'react';
import { IChain } from '@/interfaces/chain';
import ChainHeader from '@/components/chain/chain-header';
import ChainStats from '@/components/chain/chain-stats';

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

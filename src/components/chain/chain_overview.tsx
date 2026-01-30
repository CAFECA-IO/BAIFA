'use client';

import { useState } from 'react';
import { IChain } from '@/interfaces/chain';
import ChainHeader from '@/components/chain/chain_header';
import ChainStats from '@/components/chain/chain_stats';

export default function ChainOverview({
  chain,
  latestGasPrice,
  latestBlockNumber,
}: {
  chain?: IChain;
  latestGasPrice?: string;
  latestBlockNumber?: string;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <ChainHeader
        chain={chain}
        showDetails={showDetails}
        onToggleDetails={() => setShowDetails(!showDetails)}
        latestGasPrice={latestGasPrice}
      />
      <ChainStats
        stats={chain?.stats}
        details={chain?.details}
        showDetails={showDetails}
        latestBlockNumber={latestBlockNumber}
        latestGasPrice={latestGasPrice}
      />
    </>
  );
}

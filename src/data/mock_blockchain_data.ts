import { IBlock, ITransaction } from '@/interfaces/chain';

export const MOCK_BLOCKS: IBlock[] = [
    { height: '24282179', time: '12 秒前', proposer: '0x4838...f73ce8b0bad5f97', txns: 289, reward: '0.00861932 ETH', gas: '0.53 Gwei' },
    { height: '24282178', time: '24 秒前', proposer: '0x4838...f73ce8b0bad5f97', txns: 290, reward: '0.01520471 ETH', gas: '0.61 Gwei' },
    { height: '24282177', time: '36 秒前', proposer: '0x4838...f73ce8b0bad5f97', txns: 247, reward: '0.01031201 ETH', gas: '0.69 Gwei' },
    { height: '24282176', time: '48 秒前', proposer: '0x4838...f73ce8b0bad5f97', txns: 277, reward: '0.00837997 ETH', gas: '0.54 Gwei' },
    { height: '24282175', time: '1 分鐘前', proposer: '0x4838...f73ce8b0bad5f97', txns: 254, reward: '0.00918389 ETH', gas: '0.58 Gwei' },
    { height: '24282174', time: '1 分鐘前', proposer: '0x3963...0945346fb82aa49', txns: 252, reward: '0.01082844 ETH', gas: '0.51 Gwei' },
    { height: '24282173', time: '1 分鐘前', proposer: '0x4838...f73ce8b0bad5f97', txns: 242, reward: '0.00932459 ETH', gas: '0.55 Gwei' },
    { height: '24282172', time: '1 分鐘前', proposer: '0x4838...f73ce8b0bad5f97', txns: 231, reward: '0.00762459 ETH', gas: '0.50 Gwei' },
    { height: '24282171', time: '1 分鐘前', proposer: '0x1234...bad5f97', txns: 198, reward: '0.00632459 ETH', gas: '0.48 Gwei' },
];

export const MOCK_TRANSACTIONS: ITransaction[] = [
    { hash: '0x25125b6b4e7...', time: '11 小時前', from: '0xb62c...6af53ae3994', to: '0x4ebb...119bd304003', value: '15,000 ETH' },
    { hash: '0x36706bc1429...', time: '11 小時前', from: '0x4ebb...119bd304003', to: 'Coinbase. Hot Wallet_1', value: '15,000 ETH' },
    { hash: '0x862d2eeac6d...', time: '12 小時前', from: 'OKX. Hot Wallet_36752', to: 'OKX. Cold Wallet_70', value: '14,950 ETH' },
    { hash: '0x1ab89fb1f27...', time: '15 分鐘前', from: 'Coinbase. User', to: 'Coinbase. DepositAn...', value: '14,183 ETH' },
    { hash: '0xe1007625fee...', time: '17 分鐘前', from: '0x8e27...50d7109407c', to: 'Coinbase. User', value: '14,173 ETH' },
    { hash: '0x67cd1204f0d...', time: '10 小時前', from: '0x3356...12be9d75836', to: '0x15ab...ded1543de48', value: '12,536 ETH' },
    { hash: '0xae3716adf4a...', time: '10 小時前', from: '0x15ab...ded1543de48', to: '0x46f3...2d41c144d08', value: '12,536 ETH' },
    { hash: '0xff3716adf4a...', time: '11 小時前', from: '0x15ab...ded1543de48', to: '0x46f3...2d41c144d08', value: '10,000 ETH' },
    { hash: '0xdd3716adf4a...', time: '12 小時前', from: '0x15ab...ded1543de48', to: '0x46f3...2d41c144d08', value: '8,500 ETH' },
];

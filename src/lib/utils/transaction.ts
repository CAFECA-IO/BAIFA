import { IJsonRpcTransaction } from '@/interfaces/rpc';
import { formatHexToEther } from '@/lib/utils/format';

const METHOD_SIGNATURES: { [key: string]: string } = {
  '0xa9059cbb': 'Transfer (ERC-20)',
  '0x095ea7b3': 'Approve (ERC-20)',
  '0x23b872dd': 'TransferFrom (ERC-20/721)',
  '0x42842e0e': 'SafeTransferFrom (ERC-721)',
  '0xf242432a': 'SafeTransferFrom (ERC-1155)',
  '0x2ea01f9c': 'HandleOps (ERC-4337)',
  '0x6931966a': 'ForcedTransfer (ERC-3643)',
  '0xd0e30db0': 'Deposit (WETH 存款)',
  '0x2e1a7d4d': 'Withdraw (WETH 提款)',
};

const DESCRIPTION_SIGNATURES: { [key: string]: string } = {
  '0xa9059cbb': 'Transfer (ERC-20)',
  '0x095ea7b3': 'Approve (授權)',
  '0x23b872dd': 'TransferFrom (代理轉帳)',
  '0x42842e0e': 'SafeTransferFrom (NFT 轉帳)',
  '0xf242432a': 'SafeBatchTransfer (1155 批量轉帳)',
  '0x2ea01f9c': 'HandleOps (4337 錢包操作)',
  '0x6931966a': 'ForcedTransfer (3643 合規轉帳)',
  '0xd0e30db0': 'Deposit (WETH 存款)',
  '0x2e1a7d4d': 'Withdraw (WETH 提款)',
};

export const getMethodDescription = (input: string) => {
  if (!input || input === '0x' || input === '0x0') return 'ISC Transfer';

  // Info: (20260130 - Julian) Ensure prefix
  const cleanInput = input.startsWith('0x') ? input : `0x${input}`;
  const methodId = cleanInput.slice(0, 10).toLowerCase();

  return METHOD_SIGNATURES[methodId] || `Execute (${methodId})`;
};

export const getTransactionDescription = (tx: IJsonRpcTransaction) => {
  const input = tx.input || '0x';
  const methodId = input.slice(0, 10).toLowerCase();

  if (!tx.to) return 'Contract Creation (部署合約)';

  if (input === '0x' || input === '0x0') {
    // Info: (20260130 - Julian) tx.value is hex string
    const ethValue = parseFloat(formatHexToEther(tx.value ?? '0x0')).toFixed(4);
    return `ISC Transfer (發送 ${ethValue} ISC)`;
  }

  // Info: (20260130 - Julian) Try description map, then method map
  return (
    DESCRIPTION_SIGNATURES[methodId] ||
    METHOD_SIGNATURES[methodId] ||
    `Contract Call (方法: ${methodId})`
  );
};

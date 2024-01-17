// 010 - GET /app/chains/:chain_id/transactions/:transaction_id

import type {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../../../../../../lib/utils/dbConnection';

type AddressInfo = {
  type: 'address' | 'contract';
  address: string;
};

type FlaggingRecords = {
  redFlagId: string;
  redFlagType: string;
};

type ResponseData = {
  id: string;
  hash: string;
  type: 'Crypto Currency' | 'Evidence' | 'NFT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'PROCESSING';
  chainId: string;
  chainIcon: string;
  blockId: string;
  createdTimestamp: number;
  from: AddressInfo[];
  to: AddressInfo[];
  evidenceId: string;
  value: number;
  fee: number;
  unit: string;
  flaggingRecords: FlaggingRecords[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240116 - Julian) 解構 URL 參數，同時進行類型轉換
  const transaction_id =
    typeof req.query.transaction_id === 'string' ? req.query.transaction_id : undefined;

  pool.query(
    `SELECT id,
            hash,
            type,
            status,
            chain_id as "chainId",
            block_hash as "blockId",
            created_timestamp as "createdTimestamp",
            from_address as "from",
            to_address as "to",
            evidence_id as "evidenceId",
            value,
            fee
    FROM transactions
    WHERE id = $1`,
    [transaction_id],
    // ToDo: (20240116 - Julian) 補上欄位
    // 1. chainIcon
    // 2. flaggingRecords
    // 3. unit
    (err: Error, response: any) => {
      if (!err) {
        res.status(200).json(response.rows[0]);
      }
    }
  );

  /*   
  const result: ResponseData = {
    'id': '930071',
    'hash': '0xE47Dcf8aF9829AD3c4E31409eB6ECfecd046d1BD',
    'type': 'NFT',
    'status': 'PROCESSING',
    'chainId': 'isun',
    'chainIcon': '/currencies/isun.svg',
    'blockId': '230021',
    'createdTimestamp': 1688342795,
    'from': [{'type': 'address', 'address': '130294'}],
    'to': [{'type': 'contract', 'address': '310071'}],
    'evidenceId': '530029',
    'value': 0.01,
    'fee': 0.01,
    'unit': 'ETH',
    'flaggingRecords': [
      {
        'redFlagId': '1378976701',
        'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_DEPOSIT',
      },
    ],
  };

  res.status(200).json(result); */
}

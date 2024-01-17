// 013 - GET /app/chains/:chain_id/addresses/:address_id/red_flags

import type {NextApiRequest, NextApiResponse} from 'next';
import pool from '../../../../../../../../lib/utils/dbConnection';

type ResponseData = {
  id: string;
  chainId: string;
  chainName: string;
  chainIcon: string;
  addressId: string;
  redFlagType: string;
  createdTimestamp: number;
}[];

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const chain_id =
    typeof req.query.chain_id === 'string' ? parseInt(req.query.chain_id) : undefined;
  const address_id =
    typeof req.query.address_id === 'string' ? parseInt(req.query.address_id) : undefined;

  pool.query(
    `SELECT id,
          chain_id as "chainId",
          created_timestamp as "createdTimestamp",
          address_id as "addressId",
          red_flag_type as "redFlagType"
  FROM red_flags
  WHERE chain_id = $1
  AND address_id = $2`,
    [chain_id, address_id],
    (err: Error, response: any) => {
      if (!err) {
        res.status(200).json(response.rows);
      }
    }
  );

  // const result: ResponseData = [
  //   {
  //     'id': '1300200001',
  //     'chainId': 'isun',
  //     'chainName': 'iSunCloud',
  //     'chainIcon': '/currencies/isun.svg',
  //     'addressId': '130020',
  //     'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_WITHDRAW',
  //     'createdTimestamp': 1679978900,
  //   },
  //   {
  //     'id': '1300200002',
  //     'chainId': 'isun',
  //     'chainName': 'iSunCloud',
  //     'chainIcon': '/currencies/isun.svg',
  //     'addressId': '130020',
  //     'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_RECEIVES',
  //     'createdTimestamp': 1680183194,
  //   },
  //   {
  //     'id': '1300200003',
  //     'chainId': 'isun',
  //     'chainName': 'iSunCloud',
  //     'chainIcon': '/currencies/isun.svg',
  //     'addressId': '130020',
  //     'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_WITHDRAW',
  //     'createdTimestamp': 1682194724,
  //   },
  //   {
  //     'id': '1300200004',
  //     'chainId': 'isun',
  //     'chainName': 'iSunCloud',
  //     'chainIcon': '/currencies/isun.svg',
  //     'addressId': '130020',
  //     'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_WITHDRAW',
  //     'createdTimestamp': 1682729103,
  //   },
  //   // ... other red flags
  // ];
  // res.status(200).json(result);
}

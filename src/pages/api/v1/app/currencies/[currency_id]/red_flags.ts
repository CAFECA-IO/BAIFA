// 019 - GET /app/currencies/:currency_id/red_flags

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../lib/utils/prismaUtils';

type ResponseData = {
  id: string;
  chainId: string;
  chainName: string;
  addressId: string;
  redFlagType: string;
  createdTimestamp: number;
}[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  // Info: (20240129 - Julian) 解構 URL 參數，同時進行類型轉換
  const currency_id = typeof req.query.currency_id === 'string' ? req.query.currency_id : undefined;

  // Info: (20240129 - Julian) 取得 currency 資料
  const currencyData = await prisma.currencies.findUnique({
    where: {
      id: currency_id,
    },
    select: {
      name: true,
      chain_id: true,
    },
  });

  const chainId = currencyData?.chain_id ?? 0;
  const chainName = currencyData?.name ?? '';

  const redFlagData = currency_id
    ? await prisma.red_flags.findMany({
        where: {
          chain_id: chainId,
        },
        select: {
          id: true,
          chain_id: true,
          red_flag_type: true,
          created_timestamp: true,
        },
      })
    : [];

  const result: ResponseData = redFlagData.map(redFlag => {
    return {
      id: `${redFlag.id}`,
      chainId: `${redFlag.chain_id}`,
      chainName: chainName,
      addressId: '',
      redFlagType: redFlag.red_flag_type,
      createdTimestamp: new Date(redFlag.created_timestamp).getTime() / 1000,
    };
  });

  /*   
  const result: ResponseData = [
    {
      'id': '1183720028',
      'chainId': 'btc',
      'chainName': 'Bitcoin',
      'addressId': '118372',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_RECEIVES',
      'createdTimestamp': 1679099781,
    },
    {
      'id': '1132480029',
      'chainId': 'btc',
      'chainName': 'Bitcoin',
      'addressId': '113248',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_LARGE_WITHDRAW',
      'createdTimestamp': 1682172429,
    },
    {
      'id': '1182740004',
      'chainId': 'btc',
      'chainName': 'Bitcoin',
      'addressId': '118274',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_BLACK_LIST',
      'createdTimestamp': 1689427103,
    },
    {
      'id': '1192830192',
      'chainId': 'btc',
      'chainName': 'Bitcoin',
      'addressId': '119283',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MIXING_SERVICE',
      'createdTimestamp': 1689424291,
    },
    // ... other red flags
  ]; */

  res.status(200).json(result);
}

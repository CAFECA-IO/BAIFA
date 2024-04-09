// 106 - GET /app/tracking-tool relation analysis

import type {NextApiRequest, NextApiResponse} from 'next';
import {IRelationAnalysis} from '../../../../../interfaces/relation_analysis';
import prisma from '../../../../../../prisma/client';

type ResponseData = IRelationAnalysis;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240408 - Julian) 判斷是否有拿到 addressId
  const addressIdA = typeof req.query.addressIdA === 'string' ? req.query.addressIdA : undefined;
  const addressIdB = typeof req.query.addressIdB === 'string' ? req.query.addressIdB : undefined;

  if (!(addressIdA && addressIdB)) {
    return res.status(400).json({} as ResponseData);
  }

  try {
    const transactionOptions = {
      // Info: (20240409 - Julian) 查找 A -> B 或 B -> A 的交易
      OR: [
        {from_address: addressIdA, to_address: addressIdB},
        {from_address: addressIdB, to_address: addressIdA},
      ],
    };

    // Info: (20240409 - Julian) 撈出所有相關的交易資料
    const transactionCount = await prisma.token_transfers.count({
      where: transactionOptions,
    });
    const transactionData = await prisma.token_transfers.findMany({
      where: transactionOptions,
      select: {
        value: true,
        currency_id: true,
      },
    });

    // Info: (20240409 - Julian) 取得 symbol
    const currencyIds = transactionData.map(transaction => transaction?.currency_id ?? '');
    const uniqueCurrencyIds = Array.from(new Set(currencyIds));
    const currencyId = uniqueCurrencyIds.length === 1 ? uniqueCurrencyIds[0] : '';

    const currencyData = await prisma.currencies.findFirst({
      where: {
        id: currencyId,
      },
      select: {
        symbol: true,
      },
    });
    const symbol = currencyData?.symbol ?? '';

    // Info: (20240409 - Julian) 取得 decimals
    const chain = await prisma.chains.findFirst({
      where: {
        symbol: symbol,
      },
    });
    const decimals = chain?.decimals ?? 0;

    // Info: (20240409 - Julian) 計算總交易量
    const transactionsValue = transactionData.map(transaction => {
      if (transaction.value) {
        return parseInt(transaction.value, 10);
      }
      return 0;
    });
    const totalTransactionsVolume =
      transactionsValue.reduce((acc, cur) => acc + cur, 0) / Math.pow(10, decimals);

    const addressAData = await prisma.addresses.findUnique({
      where: {
        address: addressIdA,
      },
    });
    const addressBData = await prisma.addresses.findUnique({
      where: {
        address: addressIdB,
      },
    });

    const result: ResponseData = {
      connectingLevel: '',
      directTransactionCount: transactionCount,
      directUnit: symbol,
      totalDirectTransactionsVolume: totalTransactionsVolume,
      minimumConnectingLayer: 0,
      transactionWithinThreeLayers: 0,
      transactionWithinTenLayers: 0,
      transactionOverTenLayers: 0,
      commonAddressCount: 0,
      commonContractCount: 0,
      patternSimilarityLevel: '',
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({} as ResponseData);
  }
}

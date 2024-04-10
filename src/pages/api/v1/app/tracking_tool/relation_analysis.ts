// 106 - GET /app/tracking-tool relation analysis

import type {NextApiRequest, NextApiResponse} from 'next';
import {IRelationAnalysis} from '../../../../../interfaces/relation_analysis';
import prisma from '../../../../../../prisma/client';

type ResponseData = IRelationAnalysis;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240408 - Julian) 判斷是否有拿到 addressId
  const addressIdA = typeof req.query.addressIdA === 'string' ? req.query.addressIdA : undefined;
  const addressIdB = typeof req.query.addressIdB === 'string' ? req.query.addressIdB : undefined;

  if (!addressIdA || !addressIdB) {
    return res.status(400).json({} as ResponseData);
  }

  try {
    // Info: (20240409 - Julian) 撈出所有相關的交易資料
    const transactionData = await prisma.token_transfers.findMany({
      where: {
        // Info: (20240409 - Julian) 查找 A -> B 或 B -> A 的交易
        OR: [
          {from_address: addressIdA, to_address: addressIdB},
          {from_address: addressIdB, to_address: addressIdA},
        ],
      },
      select: {
        value: true,
        currency_id: true,
      },
    });
    const transactionCount = transactionData.length;

    // Info: (20240409 - Julian) 取得 symbol
    const currencyIds = transactionData.map(transaction => transaction?.currency_id ?? '');
    const uniqueCurrencyIds = Array.from(new Set(currencyIds));
    const currencyId = uniqueCurrencyIds.length === 1 ? uniqueCurrencyIds[0] : '';

    const currencyData = await prisma.currencies.findUnique({
      where: {
        id: currencyId,
      },
      select: {
        symbol: true,
        chain_id: true,
      },
    });
    const symbol = currencyData?.symbol ?? '';
    const chainId = currencyData?.chain_id ?? 0;

    // Info: (20240409 - Julian) 取得 decimals
    const chain = await prisma.chains.findUnique({
      where: {
        id: chainId,
      },
      select: {
        decimals: true,
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

    // Info: (20240409 - Julian) 查找 A 相關的交易
    const aRelatedTransactions = await prisma.transactions.findMany({
      where: {
        // Info: (20240409 - Julian) 查找 address A 相關的交易
        related_addresses: {has: addressIdA},
      },
      select: {
        related_addresses: true,
      },
    });
    // Info: (20240409 - Julian) 整理 A 相關的 address 資料
    const arList = aRelatedTransactions
      .flatMap(transaction => transaction.related_addresses)
      // Info: (20240409 - Julian) 移除 A 自己
      .filter(address => address !== addressIdA);
    // Info: (20240409 - Julian) 移除重複的 address
    const arSet = new Set(arList);
    const uniqueARList = Array.from(arSet);

    // Info: (20240409 - Julian) 計算 B 與 uniqueARList 共通的交易數
    const ftb = await prisma.transactions.count({
      where: {
        AND: [{related_addresses: {has: addressIdB}}, {related_addresses: {hasSome: uniqueARList}}],
      },
    });

    // Info: (20240409 - Julian) 查找 B 相關的交易
    const bRelatedTransactions = await prisma.transactions.findMany({
      where: {
        // Info: (20240409 - Julian) 查找 address B 相關的交易
        related_addresses: {has: addressIdB},
      },
      select: {
        related_addresses: true,
      },
    });
    // Info: (20240409 - Julian) 整理 B 相關的 address 資料
    const brList = bRelatedTransactions
      .flatMap(transaction => transaction.related_addresses)
      // Info: (20240409 - Julian) 移除 B 自己
      .filter(address => address !== addressIdB);
    // Info: (20240409 - Julian) 移除重複的 address
    const brSet = new Set(brList);
    const uniqueBRList = Array.from(brSet);

    // Info: (20240409 - Julian) 計算 A 與 uniqueBRList 共通的交易數
    const fta = await prisma.transactions.count({
      where: {
        AND: [{related_addresses: {has: addressIdA}}, {related_addresses: {hasSome: uniqueBRList}}],
      },
    });

    const withinThreeLayers = ftb + fta;

    // Info: (20240409 - Julian) 計算最小連接層數
    // 如果 A 與 B 之間有直接交易，則最小連接層數為 1
    // 如果 A 包含在 uniqueBRList，則最小連接層數為 2
    const minConnLayer = transactionCount > 0 ? 1 : uniqueBRList.includes(addressIdA) ? 2 : 0;

    // Info: (20240409 - Julian) 找出 A 與 B 共通的 address
    const commonItems = uniqueARList
      .filter(address => uniqueBRList.includes(address))
      .filter(address => address !== 'null');
    // Info: (20240409 - Julian) 從 DB 撈出所有的 address 資料
    const addressData = await prisma.addresses.findMany({
      select: {
        address: true,
      },
    });
    const addressList = addressData.map(address => address?.address ?? '');

    // Info: (20240409 - Julian) 計算共通的 address 數量
    const commonAddressCount = commonItems.filter(address => addressList.includes(address)).length;
    // Info: (20240409 - Julian) 計算共通的 contract 數量
    const commonContractCount = commonItems.length - commonAddressCount;

    // Info: (20240409 - Julian) 分析連接等級
    const analysisConnectionLevel =
      transactionCount > 20 && withinThreeLayers > 100
        ? 'High'
        : transactionCount > 10 && withinThreeLayers > 50
        ? 'Medium'
        : 'Low';

    const result: ResponseData = {
      connectingLevel: analysisConnectionLevel,
      directTransactionCount: transactionCount,
      directUnit: symbol,
      totalDirectTransactionsVolume: totalTransactionsVolume,
      minimumConnectingLayer: minConnLayer,
      transactionWithinThreeLayers: withinThreeLayers,
      commonAddressCount: commonAddressCount,
      commonContractCount: commonContractCount,
      patternSimilarityLevel: '',
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({} as ResponseData);
  }
}

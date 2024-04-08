// 106 - GET /app/tracking-tool relation analysis

import type {NextApiRequest, NextApiResponse} from 'next';
import {IRelationAnalysis} from '../../../../../interfaces/relation_analysis';

type ResponseData = IRelationAnalysis;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240408 - Julian) 判斷是否有拿到 addressId
  const addressIdA = typeof req.query.addressIdA === 'string' ? req.query.addressIdA : undefined;
  const addressIdB = typeof req.query.addressIdB === 'string' ? req.query.addressIdB : undefined;

  if (!(addressIdA && addressIdB)) {
    return res.status(400).json({} as ResponseData);
  }

  try {
    const result: ResponseData = {
      connectingLevel: 'Medium',
      directTransactionCount: 10,
      directUnit: 'ETH',
      totalDirectTransactionsVolume: 100,
      minimumConnectingLayer: 2,
      transactionWithinThreeLayers: 20,
      transactionWithinTenLayers: 50,
      transactionOverTenLayers: 30,
      commonAddressCount: 5,
      commonContractCount: 3,
      patternSimilarityLevel: 'Low',
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({} as ResponseData);
  }
}

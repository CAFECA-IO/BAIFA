import type {NextApiRequest, NextApiResponse} from 'next';
import {IExchangeRatesResponse} from '@/interfaces/exchange_rates_neo';

type ResponseData = IExchangeRatesResponse | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const exchangeRates = {
    'reportType': 'exchange rates',
    'reportID': '1',
    'reportName': 'first_report',
    'reportStartTime': 1691357200,
    'reportEndTime': 1691377200,
    'exchangeRates': {
      'ETH': [
        {
          'date': '2023-08-01 00:00',
          'timestamp': 1691366400,
          'buyPrice': '1829.4',
          'sellPrice': '1829.4',
          'fairValue': '1829.4',
        },
        // ... 其他每小時的 ETH 匯率資訊
      ],
      'BTC': [
        {
          'date': '2023-08-01 01:00',
          'timestamp': 1691370000,
          'buyPrice': '29179.3',
          'sellPrice': '29179.3',
          'fairValue': '29179.3',
        },
        // ... 其他每小時的 BTC 匯率資訊
      ],
      'USDT': [
        {
          'date': '2023-08-01 02:00',
          'timestamp': 1691373600,
          'buyPrice': '1',
          'sellPrice': '1',
          'fairValue': '1',
        },
        // ... 其他每小時的 USDT 匯率資訊
      ],
      'USDC': [
        {
          'date': '2023-08-01 03:00',
          'timestamp': 1691377200,
          'buyPrice': '1',
          'sellPrice': '1',
          'fairValue': '1',
        },
        // ... 其他每小時的 USDC 匯率資訊
      ],
    },
  };

  res.status(200).json(exchangeRates);
}

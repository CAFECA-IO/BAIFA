import type {NextApiRequest, NextApiResponse} from 'next';
import {IBalanceSheetsResponse} from '../../../../../../../../interfaces/balance_sheets_neo';

type ResponseData = IBalanceSheetsResponse | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const reports = {
    'reportID': '1',
    'reportName': 'first_report',
    'reportStartTime': 1708581426,
    'reportEndTime': 1708581428,
    'reportType': 'balance sheet',
    'totalAssetsFairValue': '9910.99',
    'totalLiabilitiesAndEquityFairValue': '9900.99',
    'assets': {
      'fairValue': '9900.99',
      'details': {
        'cryptocurrency': {
          'fairValue': '9900.99', // 補
          'breakdown': {
            'USDT': {
              'amount': '10001.0',
              'fairValue': '9900.99',
            },
            'ETH': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
          },
        },
        'cashAndCashEquivalent': {
          'fairValue': '0.0',
          'breakdown': {
            'USD': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
          },
        },
        'accountsReceivable': {
          'fairValue': '0.0',
          'breakdown': {
            'USDT': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'fairValue': '0.0', // 補
            },
            'ETH': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
          },
        },
      },
    },
    'nonAssets': {
      'fairValue': '0.0', // 補
    },
    'liabilities': {
      'fairValue': '9890.1',
      'details': {
        'userDeposit': {
          'fairValue': '9890.1',
          'breakdown': {
            'USDT': {
              'amount': '9990.0',
              'fairValue': '9890.1',
            },
            'USD': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
            'ETH': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
          },
        },
        'accountsPayable': {
          'fairValue': '0.0',
          'breakdown': {
            'USDT': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
            'ETH': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
          },
        },
      },
    },
    'equity': {
      'fairValue': '10.89',
      'details': {
        'retainedEarning': {
          'fairValue': '10.89',
          'breakdown': {
            'USDT': {
              'amount': '11.0',
              'fairValue': '10.89',
            },
            'ETH': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
          },
        },
        'otherCapitalReserve': {
          'fairValue': '0.0', // 確認欄位是否可以改名 'fairValue': '0.0',
          'breakdown': {
            'USD': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
            'USDT': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
            'ETH': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'fairValue': '0.0',
            },
          },
        },
      },
    },
  };

  const result: IBalanceSheetsResponse = {
    currentReport: reports,
    previousReport: reports,
  };

  return res.status(200).json(result);
}

import type {NextApiRequest, NextApiResponse} from 'next';
import {IComprehensiveIncomeResponse} from '../../../../../../../../interfaces/conprehensive_income_neo';

type ResponseData = IComprehensiveIncomeResponse | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const reports = {
    'reportType': 'comprehensive income',
    'reportID': '1',
    'reportName': 'first_report',
    'reportStartTime': 1708581426,
    'reportEndTime': 1708581428,
    'netProfit': '11.11',
    'income': {
      'weightedAverageCost': '0.0',
      'details': {
        'depositFee': {
          'weightedAverageCost': '11.11',
          'breakdown': {
            'USDT': {
              'amount': '11.0',
              'weightedAverageCost': '11.11',
            },
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'withdrawalFee': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'tradingFee': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'spreadFee': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'liquidationFee': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'guaranteedStopLossFee': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
      },
    },
    'costs': {
      'weightedAverageCost': '0.0',
      'details': {
        'technicalProviderFee': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'marketDataProviderFee': {
          'weightedAverageCost': '0.0',
        },
        'newCoinListingCost': {
          'weightedAverageCost': '0.0',
        },
      },
    },
    'operatingExpenses': {
      'weightedAverageCost': '0.0',
      'details': {
        'salaries': '0.0',
        'rent': '0.0',
        'marketing': '0.0',
        'rebateExpenses': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
      },
    },
    'financialCosts': {
      'weightedAverageCost': '0.0',
      'details': {
        'interestExpense': '0.0',
        'cryptocurrencyForexLosses': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'fiatToCryptocurrencyConversionLosses': '0.0',
        'cryptocurrencyToFiatConversionLosses': '0.0',
        'fiatToFiatConversionLosses': '0.0',
      },
    },
    'otherGainLosses': {
      'weightedAverageCost': '0.0',
      'details': {
        'investmentGains': '0.0',
        'forexGains': '0.0',
        'cryptocurrencyGains': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
      },
    },
  };

  const historicalReports = {
    'reportType': 'comprehensive income',
    'reportID': '1',
    'reportName': 'first_report',
    'reportStartTime': 1608581426,
    'reportEndTime': 1608581428,
    'netProfit': '11.11',
    'income': {
      'weightedAverageCost': '370.0',
      'details': {
        'depositFee': {
          'weightedAverageCost': '3711.11',
          'breakdown': {
            'USDT': {
              'amount': '3711.0',
              'weightedAverageCost': '3711.11',
            },
            'ETH': {
              'amount': '370.0',
              'weightedAverageCost': '370.0',
            },
            'BTC': {
              'amount': '370.0',
              'weightedAverageCost': '370.0',
            },
            'USD': {
              'amount': '370.0',
              'weightedAverageCost': '370.0',
            },
          },
        },
        'withdrawalFee': {
          'weightedAverageCost': '370.0',
          'breakdown': {
            'USDT': {
              'amount': '370.0',
              'weightedAverageCost': '0.0',
            },
            'ETH': {
              'amount': '370.0',
              'weightedAverageCost': '370.0',
            },
            'BTC': {
              'amount': '370.0',
              'weightedAverageCost': '370.0',
            },
            'USD': {
              'amount': '370.0',
              'weightedAverageCost': '370.0',
            },
          },
        },
        'tradingFee': {
          'weightedAverageCost': '370.0',
          'breakdown': {
            'ETH': {
              'amount': '370.0',
              'weightedAverageCost': '370.0',
            },
            'BTC': {
              'amount': '370.0',
              'weightedAverageCost': '370.0',
            },
            'USDT': {
              'amount': '370.0',
              'weightedAverageCost': '370.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'spreadFee': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'liquidationFee': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'guaranteedStopLossFee': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
      },
    },
    'costs': {
      'weightedAverageCost': '0.0',
      'details': {
        'technicalProviderFee': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'marketDataProviderFee': {
          'weightedAverageCost': '0.0',
        },
        'newCoinListingCost': {
          'weightedAverageCost': '0.0',
        },
      },
    },
    'operatingExpenses': {
      'weightedAverageCost': '0.0',
      'details': {
        'salaries': '0.0',
        'rent': '0.0',
        'marketing': '0.0',
        'rebateExpenses': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
      },
    },
    'financialCosts': {
      'weightedAverageCost': '0.0',
      'details': {
        'interestExpense': '0.0',
        'cryptocurrencyForexLosses': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'fiatToCryptocurrencyConversionLosses': '0.0',
        'cryptocurrencyToFiatConversionLosses': '0.0',
        'fiatToFiatConversionLosses': '0.0',
      },
    },
    'otherGainLosses': {
      'weightedAverageCost': '0.0',
      'details': {
        'investmentGains': '0.0',
        'forexGains': '0.0',
        'cryptocurrencyGains': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
      },
    },
  };

  const result: IComprehensiveIncomeResponse = {
    currentReport: reports,
    previousReport: reports,
    lastYearReport: historicalReports,
  };

  res.status(200).json(result);
}

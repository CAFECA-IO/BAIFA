import type {NextApiRequest, NextApiResponse} from 'next';
import {ICashFlowNeo, ICashFlowResponse} from '../../../../../../../../interfaces/cash_flow_neo';

type ResponseData = ICashFlowResponse | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const reports: ICashFlowNeo = {
    'reportType': 'cash flow sheet',
    'reportID': '1',
    'reportName': 'first_report',
    'reportStartTime': 1708581426,
    'reportEndTime': 1708581428,
    'supplementalScheduleOfNonCashOperatingActivities': {
      'weightedAverageCost': '10101.01',
      'details': {
        'cryptocurrenciesPaidToCustomersForPerpetualContractProfits': {
          'weightedAverageCost': '0.0',
        },
        'cryptocurrenciesDepositedByCustomers': {
          'weightedAverageCost': '10089.9',
          'breakdown': {
            'USDT': {
              'amount': '9990.0',
              'weightedAverageCost': '10089.9',
            },
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'cryptocurrenciesWithdrawnByCustomers': {
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
          },
        },
        'cryptocurrenciesPaidToSuppliersForExpenses': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'ETH': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'USDT': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
            'BTC': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'cryptocurrencyInflows': {
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
          },
        },
        'cryptocurrencyOutflows': {
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
          },
        },
        'purchaseOfCryptocurrenciesWithNonCashConsideration': {
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
          },
        },
        'disposalOfCryptocurrenciesForNonCashConsideration': {
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
          },
        },
        'cryptocurrenciesReceivedFromCustomersAsTransactionFees': {
          'weightedAverageCost': '11.11',
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
          },
        },
      },
    },
    'otherSupplementaryItems': {
      'details': {
        'relatedToNonCash': {
          'cryptocurrenciesEndOfPeriod': {
            'weightedAverageCost': '10101.01',
          },
          'cryptocurrenciesBeginningOfPeriod': {
            'weightedAverageCost': '0.0',
          },
        },
        'relatedToCash': {
          'netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash': {
            'weightedAverageCost': '0.0',
          },
          'cryptocurrenciesBeginningOfPeriod': {
            'weightedAverageCost': '0.0',
          },
          'cryptocurrenciesEndOfPeriod': {
            'weightedAverageCost': '0.0',
          },
        },
      },
    },
    'operatingActivities': {
      'weightedAverageCost': '0.0',
      'details': {
        'cashDepositedByCustomers': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'cashWithdrawnByCustomers': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'purchaseOfCryptocurrencies': {
          'weightedAverageCost': '2.0',
          'breakdown': {
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'disposalOfCryptocurrencies': {
          'weightedAverageCost': '4.0',
          'breakdown': {
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'cashReceivedFromCustomersAsTransactionFee': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
        'cashPaidToSuppliersForExpenses': {
          'weightedAverageCost': '0.0',
          'breakdown': {
            'USD': {
              'amount': '0.0',
              'weightedAverageCost': '0.0',
            },
          },
        },
      },
    },
    'investingActivities': {
      'weightedAverageCost': '0.0',
    },
    'financingActivities': {
      'weightedAverageCost': '0.0',
      'details': {
        'proceedsFromIssuanceOfCommonStock': {
          'weightedAverageCost': '0.0',
        },
        'longTermDebt': {
          'weightedAverageCost': '0.0',
        },
        'shortTermBorrowings': {
          'weightedAverageCost': '0.0',
        },
        'paymentsOfDividends': {
          'weightedAverageCost': '0.0',
        },
        'treasuryStock': {
          'weightedAverageCost': '0.0',
        },
      },
    },
  };

  const result: ICashFlowResponse = {
    currentReport: reports,
    previousReport: reports,
    lastYearReport: reports,
  };

  res.status(200).json(result);
}

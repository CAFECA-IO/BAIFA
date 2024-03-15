export interface ICashDetail {
  weightedAverageCost: string;
  breakdown?: {
    USD: {
      amount: string;
      weightedAverageCost: string;
    };
  };
}

export interface INonCashDetail {
  weightedAverageCost: string;
  breakdown: {
    USDT: {
      amount: string;
      weightedAverageCost: string;
    };
    ETH: {
      amount: string;
      weightedAverageCost: string;
    };
    BTC: {
      amount: string;
      weightedAverageCost: string;
    };
  };
}

export interface ICashFlowNeo {
  reportType: string;
  reportID: string;
  reportName: string;
  reportStartTime: number;
  reportEndTime: number;
  supplementalScheduleOfNonCashOperatingActivities: {
    weightedAverageCost: string;
    details: {
      cryptocurrenciesPaidToCustomersForPerpetualContractProfits: {
        weightedAverageCost: string;
      };
      cryptocurrenciesDepositedByCustomers: INonCashDetail;
      cryptocurrenciesWithdrawnByCustomers: INonCashDetail;
      cryptocurrenciesPaidToSuppliersForExpenses: INonCashDetail;
      cryptocurrencyInflows: INonCashDetail;
      cryptocurrencyOutflows: INonCashDetail;
      purchaseOfCryptocurrenciesWithNonCashConsideration: INonCashDetail;
      disposalOfCryptocurrenciesForNonCashConsideration: INonCashDetail;
      cryptocurrenciesReceivedFromCustomersAsTransactionFees: INonCashDetail;
    };
  };
  otherSupplementaryItems: {
    details: {
      relatedToNonCash: {
        cryptocurrenciesEndOfPeriod: {
          weightedAverageCost: string;
        };
        cryptocurrenciesBeginningOfPeriod: {
          weightedAverageCost: string;
        };
      };
      relatedToCash: {
        netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash: {
          weightedAverageCost: string;
        };
        cryptocurrenciesBeginningOfPeriod: {
          weightedAverageCost: string;
        };
        cryptocurrenciesEndOfPeriod: {
          weightedAverageCost: string;
        };
      };
    };
  };
  operatingActivities: {
    weightedAverageCost: string;
    details: {
      cashDepositedByCustomers: ICashDetail;
      cashWithdrawnByCustomers: ICashDetail;
      purchaseOfCryptocurrencies: ICashDetail;
      disposalOfCryptocurrencies: ICashDetail;
      cashReceivedFromCustomersAsTransactionFee: ICashDetail;
      cashPaidToSuppliersForExpenses: ICashDetail;
    };
  };
  investingActivities: {
    weightedAverageCost: string;
  };
  financingActivities: {
    weightedAverageCost: string;
    details: {
      proceedsFromIssuanceOfCommonStock: {
        weightedAverageCost: string;
      };
      longTermDebt: {
        weightedAverageCost: string;
      };
      shortTermBorrowings: {
        weightedAverageCost: string;
      };
      paymentsOfDividends: {
        weightedAverageCost: string;
      };
      treasuryStock: {
        weightedAverageCost: string;
      };
    };
  };
}

export interface ICashFlowResponse {
  currentReport: ICashFlowNeo;
  previousReport: ICashFlowNeo;
  lastYearReport: ICashFlowNeo;
}

export const dummyCashBreakdown = {
  USD: {
    amount: '0',
    weightedAverageCost: '0',
  },
};

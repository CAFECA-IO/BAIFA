export interface IBreakdown {
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
  USD: {
    amount: string;
    weightedAverageCost: string;
  };
}

export interface IIncomeAccountingDetail {
  weightedAverageCost: string;
  breakdown: IBreakdown;
}

export interface IComprehensiveIncomeNeo {
  reportType: string;
  reportID: string;
  reportName: string;
  reportStartTime: number;
  reportEndTime: number;
  netProfit: string;
  income: {
    weightedAverageCost: string;
    details: {
      depositFee: IIncomeAccountingDetail;
      withdrawalFee: IIncomeAccountingDetail;
      tradingFee: IIncomeAccountingDetail;
      spreadFee: IIncomeAccountingDetail;
      liquidationFee: IIncomeAccountingDetail;
      guaranteedStopLossFee: IIncomeAccountingDetail;
    };
  };
  costs: {
    weightedAverageCost: string;
    details: {
      technicalProviderFee: IIncomeAccountingDetail;
      marketDataProviderFee: {
        weightedAverageCost: string;
      };
      newCoinListingCost: {
        weightedAverageCost: string;
      };
    };
  };
  operatingExpenses: {
    weightedAverageCost: string;
    details: {
      salaries: string;
      rent: string;
      marketing: string;
      rebateExpenses: IIncomeAccountingDetail;
    };
  };
  financialCosts: {
    weightedAverageCost: string;
    details: {
      interestExpense: string;
      fiatToCryptocurrencyConversionLosses: string;
      cryptocurrencyToFiatConversionLosses: string;
      fiatToFiatConversionLosses: string;
      cryptocurrencyForexLosses: IIncomeAccountingDetail;
    };
  };
  otherGainLosses: {
    weightedAverageCost: string;
    details: {
      investmentGains: string;
      forexGains: string;
      cryptocurrencyGains: IIncomeAccountingDetail;
    };
  };
}

export interface IComprehensiveIncomeResponse {
  currentReport: IComprehensiveIncomeNeo;
  previousReport: IComprehensiveIncomeNeo;
  lastYearReport: IComprehensiveIncomeNeo;
}

interface IIncomeAccountingDetail {
  totalAmountFairValue: number;
  weightedAverageCost: number;
  breakdown: {
    BTC: {
      currencyType: 'CRYPTOCURRENCY';
      name: 'BTC';
      amount: number;
      fairValue: number;
      weightedAverageCost: number;
    };
    ETH: {
      currencyType: 'CRYPTOCURRENCY';
      name: 'ETH';
      amount: number;
      fairValue: number;
      weightedAverageCost: number;
    };
    USDT: {
      currencyType: 'CRYPTOCURRENCY';
      name: 'USDT';
      amount: number;
      fairValue: number;
      weightedAverageCost: number;
    };
    USD: {
      currencyType: 'FIAT';
      name: 'USD';
      amount: number;
      fairValue: number;
      weightedAverageCost: number;
    };
  };
}

export interface IComprehensiveIncomeStatements {
  id: string;
  startDate: string;
  endDate: string;
  income: {
    weightedAverageCost: number;
    details: {
      transactionFee: IIncomeAccountingDetail;
      spreadFee: IIncomeAccountingDetail;
      guaranteedStopFee: IIncomeAccountingDetail;
      liquidationFee: IIncomeAccountingDetail;
      withdrawalFee: IIncomeAccountingDetail;
      depositFee: IIncomeAccountingDetail;
    };
  };
  costs: {
    weightedAverageCost: number;
    details: {
      technicalProviderFee: number;
      marketDataProviderFee: number;
      newCoinListingCost: number;
    };
  };
  operatingExpenses: {
    weightedAverageCost: number;
    details: {
      salaries: number;
      rent: number;
      marketing: number;
      commissionRebates: IIncomeAccountingDetail;
    };
  };
  financialCosts: {
    weightedAverageCost: number;
    details: {
      interestExpense: number;
      cryptocurrencyForexLosses: number;
      fiatToCryptocurrencyConversionLosses: number;
      cryptocurrencyToFiatConversionLosses: number;
      fiatToFiatConversionLosses: number;
    };
  };
  otherGainsLosses: {
    weightedAverageCost: number;
    details: {
      investmentGains: number;
      forexGains: number;
      cryptocurrencyGains: IIncomeAccountingDetail;
    };
  };
  netProfit: number;
}

import {ICurrencyDetail} from './report_currency_detail';

export interface IIncomeAccountingDetail {
  totalAmountFairValue: number;
  weightedAverageCost: number;
  breakdown: {
    BTC?: ICurrencyDetail;
    ETH?: ICurrencyDetail;
    USDT?: ICurrencyDetail;
    USD?: ICurrencyDetail;
  };
}

export interface IComprehensiveIncomeStatements {
  id: string;
  startDate: string;
  endDate: string;
  income: {
    weightedAverageCost: number;
    details: {
      tradingFee: IIncomeAccountingDetail;
      spreadFee: IIncomeAccountingDetail;
      guaranteedStopLossFee: IIncomeAccountingDetail;
      liquidationFee: IIncomeAccountingDetail;
      withdrawalFee: IIncomeAccountingDetail;
      depositFee: IIncomeAccountingDetail;
    };
  };
  costs: {
    weightedAverageCost: number;
    details: {
      technicalProviderFee: IIncomeAccountingDetail;
      marketDataProviderFee: IIncomeAccountingDetail;
      newCoinListingCost: IIncomeAccountingDetail;
    };
  };
  operatingExpenses: {
    weightedAverageCost: number;
    details: {
      salaries: number;
      rent: number;
      marketing: number;
      rebateExpenses: IIncomeAccountingDetail;
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

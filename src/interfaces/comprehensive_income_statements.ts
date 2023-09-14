import {IAccountingDetail} from './accounting_detail';

export interface IComprehensiveIncomeStatements {
  id: string;
  startDate: string;
  endDate: string;
  income: {
    weightedAverageCost: number;
    details: {
      transactionFee: IAccountingDetail;
      spreadFee: IAccountingDetail;
      guaranteedStopFee: IAccountingDetail;
      liquidationFee: IAccountingDetail;
      withdrawalFee: IAccountingDetail;
      depositFee: IAccountingDetail;
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
      commissionRebates: IAccountingDetail;
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
      cryptocurrencyGains: IAccountingDetail;
    };
  };
  netProfit: number;
}

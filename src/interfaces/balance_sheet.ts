import {ICurrencyDetail} from './report_currency_detail';

export interface IBalanceAccountingDetail {
  totalAmountFairValue: number;
  weightedAverageCost: number;
  breakdown: {
    BTC: ICurrencyDetail;
    ETH: ICurrencyDetail;
    USDT: ICurrencyDetail;
    USD: ICurrencyDetail;
  };
}

export interface IBalanceSheet {
  id: string;
  date: string;
  totalAssetsFairValue: number;
  totalLiabilitiesAndEquityFairValue: number;
  assets: {
    totalAmountFairValue: number;
    weightedAverageCost: number;
    details: {
      accountsReceivable: IBalanceAccountingDetail;
      cryptocurrency: IBalanceAccountingDetail;
      cashAndCashEquivalent: IBalanceAccountingDetail;
    };
  };
  nonAssets: {
    totalAmountFairValue: number;
    weightedAverageCost: number;
    details: {
      accountsReceivable: IBalanceAccountingDetail;
      cashAndCashEquivalent: IBalanceAccountingDetail;
    };
  };
  liabilities: {
    totalAmountFairValue: number;
    weightedAverageCost: number;
    details: {
      accountsPayable: IBalanceAccountingDetail;
      userDeposit: IBalanceAccountingDetail;
    };
  };
  equity: {
    totalAmountFairValue: number;
    weightedAverageCost: number;
    details: {
      retainedEarnings: IBalanceAccountingDetail;
      capital: IBalanceAccountingDetail;
      otherCapitalReserve: IBalanceAccountingDetail;
    };
  };
}

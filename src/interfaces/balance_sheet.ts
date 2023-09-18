interface IBalanceAccountingDetail {
  totalAmountFairValue: number;
  weightedAverageCost: number;
  breakdown: {
    BTC: {
      name: 'BTC';
      amount: number;
      fairValue: number;
    };
    ETH: {
      name: 'ETH';
      amount: number;
      fairValue: number;
    };
    USDT: {
      name: 'USDT';
      amount: number;
      fairValue: number;
    };
  };
}
export interface IBalanceSheet {
  id: string;
  date: string;
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
    };
  };
}

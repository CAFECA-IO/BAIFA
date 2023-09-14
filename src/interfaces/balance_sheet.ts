export interface ICryptoAsset {
  name: string;
  amount: number;
  fairValue: number;
}

export const defaultCryptoAssets: ICryptoAsset = {
  name: 'None',
  amount: 0,
  fairValue: 0,
};

export interface IAccountingDetail {
  totalAmountFairValue: number;
  weightedAverageCost: number;
  breakdown: {
    BTC?: ICryptoAsset;
    ETH?: ICryptoAsset;
    USDT?: ICryptoAsset;
  };
}

export interface IBalanceSheet {
  id: string;
  date: string;
  assets: {
    totalAmountFairValue: number;
    weightedAverageCost: number;
    details: {
      accountsReceivable: IAccountingDetail;
      cryptocurrency: IAccountingDetail;
      cashAndCashEquivalent: IAccountingDetail;
    };
  };
  nonAssets: {
    totalAmountFairValue: number;
    weightedAverageCost: number;
    details: {
      accountsReceivable: IAccountingDetail;
      cashAndCashEquivalent: IAccountingDetail;
    };
  };
  liabilities: {
    totalAmountFairValue: number;
    weightedAverageCost: number;
    details: {
      accountsPayable: IAccountingDetail;
      userDeposit: IAccountingDetail;
    };
  };
  equity: {
    totalAmountFairValue: number;
    weightedAverageCost: number;
    details: {
      retainedEarnings: IAccountingDetail;
      capital: IAccountingDetail;
    };
  };
}

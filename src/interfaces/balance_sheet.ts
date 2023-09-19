import {IAccountingDetail} from './accounting_detail';
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

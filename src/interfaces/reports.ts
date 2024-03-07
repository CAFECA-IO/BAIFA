export interface IFiatCurrencyDetail {
  fairValue: string;
  breakdown: {
    USD: {
      amount: string;
      fairValue: string;
    };
  };
}

export interface ICryptocurrencyDetail {
  fairValue: string;
  breakdown: {
    BTC: {
      amount: string;
      fairValue: string;
    };
    ETH: {
      amount: string;
      fairValue: string;
    };
    USDT: {
      amount: string;
      fairValue: string;
    };
  };
}

export interface ICurrencyDetail {
  fairValue: string;
  breakdown: {
    BTC: {
      amount: string;
      fairValue: string;
    };
    ETH: {
      amount: string;
      fairValue: string;
    };
    USDT: {
      amount: string;
      fairValue: string;
    };
    USD: {
      amount: string;
      fairValue: string;
    };
  };
}

// Info: (20240306 - Julian) ------------- Balance Sheet -------------
export interface IBalanceSheetsNeo {
  reportID: string;
  reportName: string;
  reportStartTime: number;
  reportEndTime: number;
  reportType: string;
  totalAssetsFairValue: string;
  totalLiabilitiesAndEquityFairValue: string;
  assets: {
    fairValue: string;
    details: {
      cryptocurrency: ICryptocurrencyDetail;
      cashAndCashEquivalent: IFiatCurrencyDetail;
      accountsReceivable: ICryptocurrencyDetail;
    };
  };
  nonAssets: {
    fairValue: string;
  };
  liabilities: {
    fairValue: string;
    details: {
      userDeposit: ICurrencyDetail;
      accountsPayable: ICurrencyDetail;
    };
  };
  equity: {
    fairValue: string;
    details: {
      retainedEarning: ICurrencyDetail;
      otherCapitalReserve: ICurrencyDetail;
    };
  };
}

export interface IBalanceSheetsResponse {
  currentReport: IBalanceSheetsNeo;
  thirtyDaysAgoReport: IBalanceSheetsNeo;
}

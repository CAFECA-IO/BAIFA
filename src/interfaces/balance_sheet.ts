export interface IBalanceSheet {
  id: string;
  date: string;
  assets: {
    totalAmountFairValue: number;
    weightedAverageCost: number;
    details: {
      accountsReceivable: {
        totalAmountFairValue: number;
        weightedAverageCost: number;
        breakdown: {
          Bitcoin?: {
            name: string;
            amount: number;
            fairValue: number;
          };
          Ethereum?: {
            name: string;
            amount: number;
            fairValue: number;
          };
          USDT?: {
            name: string;
            amount: number;
            fairValue: number;
          };
        };
      };
      cryptocurrency: {
        totalAmountFairValue: number;
        weightedAverageCost: number;
        breakdown: {
          Bitcoin?: {
            name: string;
            amount: number;
            fairValue: number;
          };
          Ethereum?: {
            name: string;
            amount: number;
            fairValue: number;
          };
          USDT?: {
            name: string;
            amount: number;
            fairValue: number;
          };
        };
      };
      cashAndCashEquivalent: {
        totalAmountFairValue: number;
        weightedAverageCost: number;
        breakdown: {
          Bitcoin?: {
            name: string;
            amount: number;
            fairValue: number;
          };
          Ethereum?: {
            name: string;
            amount: number;
            fairValue: number;
          };
          USDT?: {
            name: string;
            amount: number;
            fairValue: number;
          };
        };
      };
    };
  };
  liabilities: {
    totalAmountFairValue: number;
    weightedAverageCost: number;
    details: {
      accountsPayable: {
        totalAmountFairValue: number;
        weightedAverageCost: number;
        breakdown: {
          Bitcoin?: {
            name: string;
            amount: number;
            fairValue: number;
          };
          Ethereum?: {
            name: string;
            amount: number;
            fairValue: number;
          };
          USDT?: {
            name: string;
            amount: number;
            fairValue: number;
          };
        };
      };
      userDeposit: {
        totalAmountFairValue: number;
        weightedAverageCost: number;
        breakdown: {
          Bitcoin?: {
            name: string;
            amount: number;
            fairValue: number;
          };
          Ethereum?: {
            name: string;
            amount: number;
            fairValue: number;
          };
          USDT?: {
            name: string;
            amount: number;
            fairValue: number;
          };
        };
      };
    };
  };
  equity: {
    totalAmountFairValue: number;
    weightedAverageCost: number;
    details: {
      retainedEarnings: {
        totalAmountFairValue: number;
        weightedAverageCost: number;
        breakdown: {
          USDT: {
            name: string;
            amount: number;
            fairValue: number;
          };
        };
      };
      capital: {
        totalAmountFairValue: number;
        weightedAverageCost: number;
        breakdown: {
          Bitcoin?: {
            name: string;
            amount: number;
            fairValue: number;
          };
          Ethereum?: {
            name: string;
            amount: number;
            fairValue: number;
          };
          USDT?: {
            name: string;
            amount: number;
            fairValue: number;
          };
        };
      };
    };
  };
}

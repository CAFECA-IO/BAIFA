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

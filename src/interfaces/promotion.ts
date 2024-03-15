export interface IPromotion {
  chains: number | string;
  cryptoCurrencies: number | string;
  blackList: number | string;
}

export const defaultPromotion: IPromotion = {
  chains: 'N/A',
  cryptoCurrencies: 'N/A',
  blackList: 'N/A',
};

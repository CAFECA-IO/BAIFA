import {dummyBlacklistAddressData} from './address';
import {dummyChains} from './chain';
import {dummyCurrencyData} from './currency';

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

export const getDummyPromotion = (): IPromotion => {
  return {
    chains: dummyChains.length,
    cryptoCurrencies: dummyCurrencyData.length,
    blackList: dummyBlacklistAddressData.length,
  };
};

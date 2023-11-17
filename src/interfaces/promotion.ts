import {dummyBlacklistAddressData} from './address';
import {dummyChains} from './chain';
import {dummyCurrencyData} from './currency';

export interface IPromotion {
  chains: number | string;
  cryptoCurrencies: number | string;
  blackList: number | string;
}

export const defaultPromotion: IPromotion = {
  chains: '—',
  cryptoCurrencies: '—',
  blackList: '—',
};

export const getDummyPromotion = (): IPromotion => {
  return {
    chains: dummyChains.length,
    cryptoCurrencies: dummyCurrencyData.length,
    blackList: dummyBlacklistAddressData.length,
  };
};

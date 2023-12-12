import React, {createContext, useCallback} from 'react';
import useStateRef from 'react-usestateref';
import {IChain} from '../interfaces/chain';
import {APIURL} from '../constants/api_request';
import {IPromotion, defaultPromotion} from '../interfaces/promotion';

export interface IMarketProvider {
  children: React.ReactNode;
}

export interface IMarketContext {
  init: () => Promise<void>;
  promotionData: IPromotion;
  chainList: IChain[];
  getChains: () => Promise<void>;
  getChainDetail: (chainId: string) => Promise<IChain>;
}

export const MarketContext = createContext<IMarketContext>({
  init: () => Promise.resolve(),
  promotionData: defaultPromotion,
  chainList: [],
  getChains: () => Promise.resolve(),
  getChainDetail: () => Promise.resolve({} as IChain),
});

export const MarketProvider = ({children}: IMarketProvider) => {
  const [promotion, setPromotion, promotionRef] = useStateRef<IPromotion>(defaultPromotion);
  const [chainList, setChainList, chainListRef] = useStateRef<IChain[]>([]);

  const init = useCallback(async () => {
    await getPromotion();
    await getChains();
  }, []);

  const getPromotion = async () => {
    let data: IPromotion = defaultPromotion;
    try {
      const response = await fetch(`${APIURL.PROMOTION}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getPromotion error', error);
    }
    setPromotion(data);
  };

  const getChains = useCallback(async () => {
    let data: IChain[] = [];
    try {
      const response = await fetch(`${APIURL.CHAINS}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getChains error', error);
    }
    setChainList(data);
  }, []);

  const getChainDetail = useCallback(async (chainId: string) => {
    let data: IChain = {} as IChain;
    try {
      const response = await fetch(`${APIURL.CHAINS}/${chainId}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getChainDetail error', error);
    }
    return data;
  }, []);

  const defaultValues = {
    init,
    promotionData: promotionRef.current,
    chainList: chainListRef.current,
    getChains,
    getChainDetail,
  };

  return <MarketContext.Provider value={defaultValues}>{children}</MarketContext.Provider>;
};

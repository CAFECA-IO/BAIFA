import React, {createContext, useCallback} from 'react';
import useStateRef from 'react-usestateref';
import {IChain, IChainDetail} from '../interfaces/chain';
import {APIURL} from '../constants/api_request';
import {IPromotion, defaultPromotion} from '../interfaces/promotion';
import {ISearchResult} from '../interfaces/search_result';
import {ISuggestions, defaultSuggestions} from '../interfaces/suggestions';

export interface IMarketProvider {
  children: React.ReactNode;
}

export interface IMarketContext {
  init: () => Promise<void>;
  promotionData: IPromotion;
  chainList: IChain[];
  getChains: () => Promise<void>;
  getChainDetail: (chainId: string) => Promise<IChainDetail>;
  getSearchResult: (searchInput: string) => Promise<ISearchResult[]>;
  getSuggestions: (searchInput: string) => Promise<ISuggestions>;
}

export const MarketContext = createContext<IMarketContext>({
  init: () => Promise.resolve(),
  promotionData: defaultPromotion,
  chainList: [],
  getChains: () => Promise.resolve(),
  getChainDetail: () => Promise.resolve({} as IChainDetail),
  getSearchResult: () => Promise.resolve([] as ISearchResult[]),
  getSuggestions: () => Promise.resolve(defaultSuggestions),
});

export const MarketProvider = ({children}: IMarketProvider) => {
  const [promotion, setPromotion, promotionRef] = useStateRef<IPromotion>(defaultPromotion);
  const [chainList, setChainList, chainListRef] = useStateRef<IChain[]>([]);

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

  const init = useCallback(async () => {
    await getPromotion();
    await getChains();
  }, []);

  const getSuggestions = useCallback(async (searchInput: string) => {
    let data: ISuggestions = defaultSuggestions;
    try {
      const response = await fetch(`${APIURL.SEARCH_SUGGESTIONS}?search_input=${searchInput}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getSuggestions error', error);
    }
    return data;
  }, []);

  const getSearchResult = useCallback(async (searchInput: string) => {
    let data: ISearchResult[] = [];
    try {
      const response = await fetch(`${APIURL.SEARCH_RESULT}?search_input=${searchInput}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getSearchResult error', error);
    }
    return data;
  }, []);

  const getChainDetail = useCallback(async (chainId: string) => {
    let data: IChainDetail = {} as IChainDetail;
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
    getSearchResult,
    getSuggestions,
  };

  return <MarketContext.Provider value={defaultValues}>{children}</MarketContext.Provider>;
};

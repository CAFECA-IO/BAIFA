import React, {createContext, useCallback} from 'react';
import useStateRef from 'react-usestateref';
import {IChain, IChainDetail} from '../interfaces/chain';
import {APIURL} from '../constants/api_request';
import {IPromotion, defaultPromotion} from '../interfaces/promotion';
import {ISearchResult} from '../interfaces/search_result';
import {ISuggestions, defaultSuggestions} from '../interfaces/suggestions';
import {IBlockDetail} from '../interfaces/block';
import {ITransaction, ITransactionDetail} from '../interfaces/transaction';

export interface IMarketProvider {
  children: React.ReactNode;
}

export interface IMarketContext {
  init: () => Promise<void>;
  promotionData: IPromotion;
  chainList: IChain[];
  getChains: () => Promise<void>;
  getChainDetail: (chainId: string) => Promise<IChainDetail>;
  getChainDetailByPeriod: (
    chainId: string,
    startDate: number,
    endDate: number
  ) => Promise<IChainDetail>;
  getBlockDetail: (chainId: string, blockId: string) => Promise<IBlockDetail>;
  getTransactionList: (chainId: string, blockId: string) => Promise<ITransaction[]>;
  getTransactionDetail: (chainId: string, transactionId: string) => Promise<ITransactionDetail>;
  getSearchResult: (searchInput: string) => Promise<ISearchResult[]>;
  getSuggestions: (searchInput: string) => Promise<ISuggestions>;
}

export const MarketContext = createContext<IMarketContext>({
  init: () => Promise.resolve(),
  promotionData: defaultPromotion,
  chainList: [],
  getChains: () => Promise.resolve(),
  getChainDetail: () => Promise.resolve({} as IChainDetail),
  getChainDetailByPeriod: () => Promise.resolve({} as IChainDetail),
  getBlockDetail: () => Promise.resolve({} as IBlockDetail),
  getTransactionList: () => Promise.resolve({} as ITransaction[]),
  getTransactionDetail: () => Promise.resolve({} as ITransactionDetail),
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

  // --------------------------------------------------------------------------------???
  const getChainDetailByPeriod = useCallback(
    async (chainId: string, startDate: number, endDate: number) => {
      let data: IChainDetail = {} as IChainDetail;
      try {
        const response = await fetch(
          `${APIURL.CHAINS}/${chainId}?start_date=${startDate}&end_date=${endDate}`,
          {
            method: 'GET',
          }
        );
        data = await response.json();
      } catch (error) {
        //console.log('getChainDetail error', error);
      }
      return data;
    },
    []
  );

  const getBlockDetail = useCallback(async (chainId: string, blockId: string) => {
    let data: IBlockDetail = {} as IBlockDetail;
    try {
      const response = await fetch(`${APIURL.CHAINS}/${chainId}/blocks/${blockId}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getBlockDetail error', error);
    }
    return data;
  }, []);

  const getTransactionList = useCallback(async (chainId: string, blockId: string) => {
    let data: ITransaction[] = [];
    try {
      const response = await fetch(`${APIURL.CHAINS}/${chainId}/blocks/${blockId}/transactions`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getTransactionList error', error);
    }
    return data;
  }, []);

  const getTransactionDetail = useCallback(async (chainId: string, transactionId: string) => {
    let data: ITransactionDetail = {} as ITransactionDetail;
    try {
      const response = await fetch(`${APIURL.CHAINS}/${chainId}/transactions/${transactionId}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getTransactionList error', error);
    }
    return data;
  }, []);

  const defaultValues = {
    init,
    promotionData: promotionRef.current,
    chainList: chainListRef.current,
    getChains,
    getChainDetail,
    getChainDetailByPeriod,
    getBlockDetail,
    getTransactionList,
    getTransactionDetail,
    getSearchResult,
    getSuggestions,
  };

  return <MarketContext.Provider value={defaultValues}>{children}</MarketContext.Provider>;
};

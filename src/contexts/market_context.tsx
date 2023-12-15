import React, {createContext, useCallback} from 'react';
import useStateRef from 'react-usestateref';
import {APIURL} from '../constants/api_request';
import {IChain, IChainDetail} from '../interfaces/chain';
import {IPromotion, defaultPromotion} from '../interfaces/promotion';
import {ISearchResult} from '../interfaces/search_result';
import {ISuggestions, defaultSuggestions} from '../interfaces/suggestions';
import {IBlockDetail} from '../interfaces/block';
import {ITransaction, ITransactionDetail} from '../interfaces/transaction';
import {IAddress} from '../interfaces/address';
import {IReviews} from '../interfaces/review';
import {IRedFlag} from '../interfaces/red_flag';
import {IInteractionItem} from '../interfaces/interaction_item';
import {IContract} from '../interfaces/contract';
import {IEvidence} from '../interfaces/evidence';
import {ICurrency, ICurrencyDetail} from '../interfaces/currency';
import {IBlacklist} from '../interfaces/blacklist';

export interface IMarketProvider {
  children: React.ReactNode;
}

export interface IMarketContext {
  init: () => Promise<void>;
  promotionData: IPromotion;
  chainList: IChain[];
  currencyList: ICurrency[];
  blacklist: IBlacklist[];

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
  getAddressDetail: (chainId: string, addressId: string) => Promise<IAddress>;
  getReviews: (chainId: string, addressId: string) => Promise<IReviews>;
  getRedFlagsFromAddress: (chainId: string, addressId: string) => Promise<IRedFlag[]>;
  getInteractions: (
    chainId: string,
    addressId: string,
    type: string
  ) => Promise<IInteractionItem[]>;
  getContractDetail: (chainId: string, contractId: string) => Promise<IContract>;
  getEvidenceDetail: (chainId: string, evidenceId: string) => Promise<IEvidence>;
  getCurrencyDetail: (currencyId: string) => Promise<ICurrencyDetail>;

  getSearchResult: (searchInput: string) => Promise<ISearchResult[]>;
  getSuggestions: (searchInput: string) => Promise<ISuggestions>;
}

export const MarketContext = createContext<IMarketContext>({
  init: () => Promise.resolve(),
  promotionData: defaultPromotion,
  chainList: [],
  currencyList: [],
  blacklist: [],

  getChains: () => Promise.resolve(),
  getChainDetail: () => Promise.resolve({} as IChainDetail),
  getChainDetailByPeriod: () => Promise.resolve({} as IChainDetail),
  getBlockDetail: () => Promise.resolve({} as IBlockDetail),
  getTransactionList: () => Promise.resolve({} as ITransaction[]),
  getTransactionDetail: () => Promise.resolve({} as ITransactionDetail),
  getAddressDetail: () => Promise.resolve({} as IAddress),
  getReviews: () => Promise.resolve({} as IReviews),
  getRedFlagsFromAddress: () => Promise.resolve([] as IRedFlag[]),
  getInteractions: () => Promise.resolve([] as IInteractionItem[]),
  getContractDetail: () => Promise.resolve({} as IContract),
  getEvidenceDetail: () => Promise.resolve({} as IEvidence),
  getCurrencyDetail: () => Promise.resolve({} as ICurrencyDetail),

  getSearchResult: () => Promise.resolve([] as ISearchResult[]),
  getSuggestions: () => Promise.resolve(defaultSuggestions),
});

export const MarketProvider = ({children}: IMarketProvider) => {
  const [promotion, setPromotion, promotionRef] = useStateRef<IPromotion>(defaultPromotion);
  const [chainList, setChainList, chainListRef] = useStateRef<IChain[]>([]);
  const [currencyList, setCurrencyList, currencyListRef] = useStateRef<ICurrency[]>([]);
  const [blacklist, setBlacklist, blacklistRef] = useStateRef<IBlacklist[]>([]);

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

  const getCurrencies = useCallback(async () => {
    let data: ICurrency[] = [];
    try {
      const response = await fetch(`${APIURL.CURRENCIES}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getCurrencies error', error);
    }
    setCurrencyList(data);
  }, []);

  const getBlacklist = useCallback(async () => {
    let data: IBlacklist[] = [];
    try {
      const response = await fetch(`${APIURL.BLACKLIST}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getBlacklist error', error);
    }
    setBlacklist(data);
  }, []);

  const init = useCallback(async () => {
    await getPromotion();
    await getChains();
    await getCurrencies();
    await getBlacklist();
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

  const getAddressDetail = useCallback(async (chainId: string, addressId: string) => {
    let data: IAddress = {} as IAddress;
    try {
      const response = await fetch(`${APIURL.CHAINS}/${chainId}/addresses/${addressId}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getAddressDetail error', error);
    }
    return data;
  }, []);

  const getReviews = useCallback(async (chainId: string, addressId: string) => {
    let data: IReviews = {} as IReviews;
    try {
      const response = await fetch(`${APIURL.CHAINS}/${chainId}/addresses/${addressId}/reviews`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getReviews error', error);
    }
    return data;
  }, []);

  const getRedFlagsFromAddress = useCallback(async (chainId: string, addressId: string) => {
    let data: IRedFlag[] = [];
    try {
      const response = await fetch(`${APIURL.CHAINS}/${chainId}/addresses/${addressId}/red_flags`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getRedFlagsFromAddress error', error);
    }
    return data;
  }, []);

  const getInteractions = useCallback(async (chainId: string, addressId: string, type: string) => {
    let data: IInteractionItem[] = [];
    try {
      const response = await fetch(
        `${APIURL.CHAINS}/${chainId}/addresses/${addressId}/interactions?type=${type}`,
        {
          method: 'GET',
        }
      );
      data = await response.json();
    } catch (error) {
      //console.log('getInteractions error', error);
    }
    return data;
  }, []);

  const getContractDetail = useCallback(async (chainId: string, contractId: string) => {
    let data: IContract = {} as IContract;
    try {
      const response = await fetch(`${APIURL.CHAINS}/${chainId}/contracts/${contractId}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getContractDetail error', error);
    }
    return data;
  }, []);

  const getEvidenceDetail = useCallback(async (chainId: string, evidenceId: string) => {
    let data: IEvidence = {} as IEvidence;
    try {
      const response = await fetch(`${APIURL.CHAINS}/${chainId}/evidence/${evidenceId}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getEvidenceDetail error', error);
    }
    return data;
  }, []);

  const getCurrencyDetail = useCallback(async (currencyId: string) => {
    let data: ICurrencyDetail = {} as ICurrencyDetail;
    try {
      const response = await fetch(`${APIURL.CURRENCIES}/${currencyId}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getChains error', error);
    }
    return data;
  }, []);

  const getRedFlagsFromCurrency = useCallback(async (currencyId: string) => {
    let data: ICurrencyDetail = {} as ICurrencyDetail;
    try {
      const response = await fetch(`${APIURL.CURRENCIES}/${currencyId}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getChains error', error);
    }
    return data;
  }, []);

  const defaultValues = {
    init,
    promotionData: promotionRef.current,
    chainList: chainListRef.current,
    currencyList: currencyListRef.current,
    blacklist: blacklistRef.current,

    getChains,
    getChainDetail,
    getChainDetailByPeriod,
    getBlockDetail,
    getTransactionList,
    getTransactionDetail,
    getAddressDetail,
    getReviews,
    getRedFlagsFromAddress,
    getInteractions,
    getContractDetail,
    getEvidenceDetail,
    getCurrencyDetail,

    getSearchResult,
    getSuggestions,
  };

  return <MarketContext.Provider value={defaultValues}>{children}</MarketContext.Provider>;
};
import React, {createContext, useCallback, useState} from 'react';
import {
  APIURL,
  IAddressHistoryQuery,
  IAddressTransactionQuery,
  IPaginationOptions,
  SortingType,
} from '../constants/api_request';
import {IChainDetail, IChain} from '../interfaces/chain';
import {IPromotion, defaultPromotion} from '../interfaces/promotion';
import {ISearchResult} from '../interfaces/search_result';
import {ISuggestions, defaultSuggestions} from '../interfaces/suggestions';
import {
  IBlock,
  IBlockDetail,
  IProducedBlock,
  IProductionBlock,
  IBlockList,
} from '../interfaces/block';
import {
  ITransaction,
  ITransactionData,
  ITransactionDetail,
  ITransactionList,
} from '../interfaces/transaction';
import {
  IAddressBrief,
  IAddressDetail,
  IAddressProducedBlock,
  IAddressRelatedTransaction,
  dummyAddressBrief,
} from '../interfaces/address';
import {IReviews} from '../interfaces/review';
import {IRedFlag, IRedFlagDetail} from '../interfaces/red_flag';
import {IInteractionItem} from '../interfaces/interaction_item';
import {IContractDetail} from '../interfaces/contract';
import {IEvidenceDetail} from '../interfaces/evidence';
import {ICurrency, ICurrencyDetail} from '../interfaces/currency';
import {IBlackList} from '../interfaces/blacklist';

export interface IMarketProvider {
  children: React.ReactNode;
}

export interface IMarketContext {
  init: () => Promise<void>;
  promotionData: IPromotion;
  chainList: IChainDetail[];
  currencyList: ICurrency[];
  blacklist: IBlackList[];

  chainLoading: boolean;

  getChains: () => Promise<void>;
  getChainDetail: (chainId: string) => Promise<IChain>;
  getBlockList: (chainId: string, queryStr?: string) => Promise<IBlockList>;
  getBlockDetail: (chainId: string, blockId: string) => Promise<IBlockDetail>;
  getInteractionTransaction: (
    chainId: string,
    addressA: string | undefined,
    addressB: string | undefined,
    queryStr?: string
  ) => Promise<ITransaction[]>;
  getTransactionList: (chainId: string, queryStr?: string) => Promise<ITransactionList>;
  getTransactionListOfBlock: (
    chainId: string,
    blockId: string,
    queryStr?: string
  ) => Promise<ITransaction[]>;
  getTransactionDetail: (chainId: string, transactionId: string) => Promise<ITransactionDetail>;
  getAddressBrief: (chainId: string, addressId: string) => Promise<IAddressBrief>;
  getAddressRelatedTransactions: (
    chainId: string,
    addressId: string,
    options?: IAddressTransactionQuery
  ) => Promise<ITransactionData>;
  getAddressProducedBlocks: (
    chainId: string,
    addressId: string,
    options?: IAddressHistoryQuery
  ) => Promise<IProducedBlock>;
  getReviews: (chainId: string, addressId: string) => Promise<IReviews>;
  getRedFlagsFromAddress: (chainId: string, addressId: string) => Promise<IRedFlag[]>;
  getInteractions: (
    chainId: string,
    addressId: string,
    type: string
  ) => Promise<IInteractionItem[]>;
  getContractDetail: (chainId: string, contractId: string) => Promise<IContractDetail>;
  getContractTransactions: (
    chainId: string,
    contractId: string,
    queryStr?: string
  ) => Promise<ITransaction[]>;
  getEvidenceDetail: (chainId: string, evidenceId: string) => Promise<IEvidenceDetail>;
  getEvidenceTransactions: (
    chainId: string,
    contractId: string,
    queryStr?: string
  ) => Promise<ITransaction[]>;
  getCurrencyDetail: (currencyId: string) => Promise<ICurrencyDetail>;
  getRedFlagsFromCurrency: (currencyId: string) => Promise<IRedFlag[]>;
  getAllRedFlags: () => Promise<IRedFlag[]>;
  getRedFlagDetail: (redFlagId: string) => Promise<IRedFlagDetail>;
  getSearchResult: (searchInput: string) => Promise<ISearchResult[]>;
  getSuggestions: (searchInput: string) => Promise<ISuggestions>;
}

export const MarketContext = createContext<IMarketContext>({
  init: () => Promise.resolve(),
  promotionData: defaultPromotion,
  chainList: [],
  currencyList: [],
  blacklist: [],

  chainLoading: true,

  getChains: () => Promise.resolve(),
  getChainDetail: () => Promise.resolve({} as IChain),
  getBlockList: () => Promise.resolve({} as IBlockList),
  getBlockDetail: () => Promise.resolve({} as IBlockDetail),
  getInteractionTransaction: () => Promise.resolve([] as ITransaction[]),
  getTransactionList: () => Promise.resolve({} as ITransactionList),
  getTransactionListOfBlock: () => Promise.resolve({} as ITransaction[]),
  getTransactionDetail: () => Promise.resolve({} as ITransactionDetail),
  getAddressBrief: () => Promise.resolve({} as IAddressBrief),
  getAddressRelatedTransactions: () => Promise.resolve({} as ITransactionData),
  getAddressProducedBlocks: () => Promise.resolve({} as IProducedBlock),
  getReviews: () => Promise.resolve({} as IReviews),
  getRedFlagsFromAddress: () => Promise.resolve([] as IRedFlag[]),
  getInteractions: () => Promise.resolve([] as IInteractionItem[]),
  getContractDetail: () => Promise.resolve({} as IContractDetail),
  getContractTransactions: () => Promise.resolve([] as ITransaction[]),
  getEvidenceDetail: () => Promise.resolve({} as IEvidenceDetail),
  getEvidenceTransactions: () => Promise.resolve([] as ITransaction[]),
  getCurrencyDetail: () => Promise.resolve({} as ICurrencyDetail),
  getRedFlagsFromCurrency: () => Promise.resolve([] as IRedFlag[]),
  getAllRedFlags: () => Promise.resolve([] as IRedFlag[]),
  getRedFlagDetail: () => Promise.resolve({} as IRedFlagDetail),
  getSearchResult: () => Promise.resolve([] as ISearchResult[]),
  getSuggestions: () => Promise.resolve(defaultSuggestions),
});

export const MarketProvider = ({children}: IMarketProvider) => {
  const [promotion, setPromotion] = useState<IPromotion>(defaultPromotion);
  const [chainList, setChainList] = useState<IChainDetail[]>([]);
  const [currencyList, setCurrencyList] = useState<ICurrency[]>([]);
  const [blacklist, setBlacklist] = useState<IBlackList[]>([]);

  const [chainLoading, setChainLoading] = useState<boolean>(true);

  const getPromotion = useCallback(async () => {
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
  }, [setPromotion]);

  const getChains = useCallback(async () => {
    let data: IChainDetail[] = [];
    setChainLoading(true);
    try {
      const response = await fetch(`${APIURL.CHAINS}`, {
        method: 'GET',
      });
      data = await response.json();
      setChainLoading(false);
    } catch (error) {
      //console.log('getChains error', error);
    }
    setChainList(data);
  }, [setChainList]);

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
  }, [setCurrencyList]);

  const getBlacklist = useCallback(async () => {
    let data: IBlackList[] = [];
    try {
      const response = await fetch(`${APIURL.BLACKLIST}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getBlacklist error', error);
    }
    setBlacklist(data);
  }, [setBlacklist]);

  const init = useCallback(async () => {
    await getPromotion();
    await getChains();
    await getCurrencies();
    await getBlacklist();
  }, [getBlacklist, getChains, getCurrencies, getPromotion]);

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

  const getBlockList = useCallback(async (chainId: string, queryStr?: string) => {
    let data: IBlockList = {} as IBlockList;
    try {
      const response = queryStr
        ? await fetch(`${APIURL.CHAINS}/${chainId}/block?${queryStr}`, {
            method: 'GET',
          })
        : await fetch(`${APIURL.CHAINS}/${chainId}/block`, {
            method: 'GET',
          });
      data = await response.json();
    } catch (error) {
      //console.log('getBlockList error', error);
    }
    return data;
  }, []);

  const getBlockDetail = useCallback(async (chainId: string, blockId: string) => {
    let data: IBlockDetail = {} as IBlockDetail;
    try {
      const response = await fetch(`${APIURL.CHAINS}/${chainId}/block/${blockId}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getBlockDetail error', error);
    }
    return data;
  }, []);

  const getInteractionTransaction = useCallback(
    async (
      chainId: string,
      addressA: string | undefined,
      addressB: string | undefined,
      queryStr?: string
    ) => {
      let data: ITransaction[] = [];
      try {
        if (addressA && addressB) {
          const response = await fetch(
            `${APIURL.CHAINS}/${chainId}/transactions?${addressA}${addressB}${queryStr}`,
            {
              method: 'GET',
            }
          );
          data = await response.json();
        } else {
          const response = await fetch(`${APIURL.CHAINS}/${chainId}/transactions?${queryStr}`, {
            method: 'GET',
          });
          data = await response.json();
        }
      } catch (error) {
        //console.log('getInteractionTransaction error', error);
      }
      return data;
    },
    []
  );

  const getTransactionList = useCallback(async (chainId: string, queryStr?: string) => {
    let data: ITransactionList = {} as ITransactionList;
    try {
      const response = queryStr
        ? await fetch(`${APIURL.CHAINS}/${chainId}/transactions?${queryStr}`, {
            method: 'GET',
          })
        : await fetch(`${APIURL.CHAINS}/${chainId}/transactions`, {
            method: 'GET',
          });
      data = await response.json();
    } catch (error) {
      //console.log('getTransactionList error', error);
    }
    return data;
  }, []);

  const getTransactionListOfBlock = useCallback(
    async (chainId: string, blockId: string, queryStr?: string) => {
      let data: ITransaction[] = [];
      try {
        const response = await fetch(
          `${APIURL.CHAINS}/${chainId}/block/${blockId}/transactions?${queryStr}`,
          {
            method: 'GET',
          }
        );
        data = await response.json();
      } catch (error) {
        //console.log('getTransactionListOfBlock error', error);
      }
      return data;
    },
    []
  );

  const getTransactionDetail = useCallback(async (chainId: string, transactionId: string) => {
    let data: ITransactionDetail = {} as ITransactionDetail;
    try {
      const response = await fetch(`${APIURL.CHAINS}/${chainId}/transactions/${transactionId}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getTransactionDetail error', error);
    }
    return data;
  }, []);

  const getAddressBrief = useCallback(async (chainId: string, addressId: string) => {
    let data: IAddressBrief = {} as IAddressBrief;
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

  const getAddressRelatedTransactions = useCallback(
    async (chainId: string, addressId: string, options?: IAddressTransactionQuery) => {
      let data: ITransactionData = {transactions: [], transactionCount: 0, totalPage: 0};
      try {
        // Build the query string from the options object
        const queryParams = new URLSearchParams();
        if (options?.order) {
          queryParams.set('order', options.order);
        } else {
          queryParams.set('order', SortingType.DESC);
        }
        if (options?.page !== undefined) queryParams.set('page', options.page.toString());
        if (options?.offset !== undefined) queryParams.set('offset', options.offset.toString());
        if (options?.start_date !== undefined)
          queryParams.set('start', options.start_date.toString());
        if (options?.end_date !== undefined) queryParams.set('end', options.end_date.toString());
        if (options?.query) queryParams.set('query', JSON.stringify(options.query));

        const apiUrl = `${
          APIURL.CHAINS
        }/${chainId}/addresses/${addressId}/transactions?${queryParams.toString()}`;

        const response = await fetch(apiUrl, {
          method: 'GET',
        });
        const result = (await response.json()) as IAddressRelatedTransaction;
        data = {
          transactions: result.transactions,
          transactionCount: result.transactionCount,
          totalPage: result.totalPage,
        };
      } catch (error) {
        //console.log('getAddressRelatedTransactions error', error);
      }
      return data;
    },
    []
  );

  const getAddressProducedBlocks = async (
    chainId: string,
    addressId: string,
    options?: IAddressHistoryQuery
  ) => {
    let data: IProducedBlock = {blockData: [], blockCount: 0, totalPage: 0};
    try {
      // Build the query string from the options object
      const queryParams = new URLSearchParams();
      if (options?.order) {
        queryParams.set('order', options.order);
      } else {
        queryParams.set('order', SortingType.DESC);
      }
      if (options?.page !== undefined) queryParams.set('page', options.page.toString());
      if (options?.offset !== undefined) queryParams.set('offset', options.offset.toString());
      if (options?.start_date !== undefined)
        queryParams.set('start', options.start_date.toString());
      if (options?.end_date !== undefined) queryParams.set('end', options.end_date.toString());
      if (options?.query) queryParams.set('query', JSON.stringify(options.query));
      const apiUrl = `${
        APIURL.CHAINS
      }/${chainId}/addresses/${addressId}/produced_blocks?${queryParams.toString()}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
      });
      const result = (await response.json()) as IAddressProducedBlock;
      data = {
        blockData: result.blockData,
        blockCount: result.blockCount,
        totalPage: result.totalPage,
      };
    } catch (error) {
      //console.log('getAddressProducedBlocks error', error);
    }
    return data;
  };

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
    let data: IContractDetail = {} as IContractDetail;
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

  const getContractTransactions = useCallback(
    async (chainId: string, contractId: string, queryStr?: string) => {
      let data: ITransaction[] = [];
      try {
        const response = queryStr
          ? await fetch(
              `${APIURL.CHAINS}/${chainId}/contracts/${contractId}/transactions?${queryStr}`,
              {
                method: 'GET',
              }
            )
          : await fetch(`${APIURL.CHAINS}/${chainId}/contracts/${contractId}/transactions`, {
              method: 'GET',
            });
        data = await response.json();
      } catch (error) {
        //console.log('getContractTransactions error', error);
      }
      return data;
    },
    []
  );

  const getEvidenceDetail = useCallback(async (chainId: string, evidenceId: string) => {
    let data: IEvidenceDetail = {} as IEvidenceDetail;
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

  const getEvidenceTransactions = useCallback(
    async (chainId: string, evidenceId: string, queryStr?: string) => {
      let data: ITransaction[] = [];
      try {
        const response = queryStr
          ? await fetch(
              `${APIURL.CHAINS}/${chainId}/evidence/${evidenceId}/transactions?${queryStr}`,
              {
                method: 'GET',
              }
            )
          : await fetch(`${APIURL.CHAINS}/${chainId}/evidence/${evidenceId}/transactions`, {
              method: 'GET',
            });
        data = await response.json();
      } catch (error) {
        //console.log('getContractTransactions error', error);
      }
      return data;
    },
    []
  );

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
    let data: IRedFlag[] = [];
    try {
      const response = await fetch(`${APIURL.CURRENCIES}/${currencyId}/red_flags`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getRedFlagsFromCurrency error', error);
    }
    return data;
  }, []);

  const getAllRedFlags = useCallback(async () => {
    let data: IRedFlag[] = [];
    try {
      const response = await fetch(`${APIURL.RED_FLAGS}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getAllRedFlags error', error);
    }
    return data;
  }, []);

  const getRedFlagDetail = useCallback(async (redFlagId: string) => {
    let data: IRedFlagDetail = {} as IRedFlagDetail;
    try {
      const response = await fetch(`${APIURL.RED_FLAGS}/${redFlagId}`, {
        method: 'GET',
      });
      data = await response.json();
    } catch (error) {
      //console.log('getRedFlagDetail error', error);
    }
    return data;
  }, []);

  const defaultValues = {
    init,
    promotionData: promotion,
    chainList: chainList,
    currencyList: currencyList,
    blacklist: blacklist,

    chainLoading: chainLoading,

    getChains,
    getChainDetail,
    getBlockList,
    getBlockDetail,
    getInteractionTransaction,
    getTransactionList,
    getTransactionListOfBlock,
    getTransactionDetail,
    getAddressBrief,
    getAddressRelatedTransactions,
    getAddressProducedBlocks,
    getReviews,
    getRedFlagsFromAddress,
    getInteractions,
    getContractDetail,
    getContractTransactions,
    getEvidenceDetail,
    getEvidenceTransactions,
    getCurrencyDetail,
    getRedFlagsFromCurrency,
    getAllRedFlags,
    getRedFlagDetail,
    getSearchResult,
    getSuggestions,
  };

  return <MarketContext.Provider value={defaultValues}>{children}</MarketContext.Provider>;
};

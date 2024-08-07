import React, {createContext, useContext} from 'react';
import useStateRef from 'react-usestateref';
import {useRouter} from 'next/router';
import {
  IAddressHistoryQuery,
  IAddressTransactionQuery,
  IPaginationOptions,
  TimeSortingType,
} from '@/constants/api_request';
import {DEFAULT_PAGE, ITEM_PER_PAGE} from '@/constants/config';
import {IAddressBrief} from '@/interfaces/address';
import {ITransactionData} from '@/interfaces/transaction';
import {IProducedBlock} from '@/interfaces/block';
import {MarketContext} from '@/contexts/market_context';
import {convertMillisecondsToSeconds} from '@/lib/common';

export interface IAddressDetailsProvider {
  children: React.ReactNode;
}

export interface IAddressDetailsContext {
  transactions: ITransactionData;
  producedBlocks: IProducedBlock;
  clickBlockPagination: (
    options: IAddressHistoryQuery,
    chainId?: string,
    addressId?: string
  ) => Promise<void>;
  blocksLoading: boolean;
  clickBlockSortingMenu: (order: TimeSortingType) => Promise<void>;
  blocksOrder: TimeSortingType;
  blocksPage: number;
  blocksOffset: number;
  blocksStart: number;
  blocksEnd: number;
  clickBlockDatePicker: (start: number, end: number) => Promise<void>;
  transactionsLoading: boolean;
  transactionsOrder: TimeSortingType;
  transactionsPage: number;
  transactionsOffset: number;
  transactionsStart: number;
  transactionsEnd: number;
  clickTransactionPagination: (
    options: IPaginationOptions,
    chainId?: string,
    addressId?: string
  ) => Promise<void>;
  clickTransactionSortingMenu: (order: TimeSortingType) => Promise<void>;
  clickTransactionDatePicker: (start: number, end: number) => Promise<void>;
  transactionInit: (
    chainId?: string,
    addressId?: string,
    options?: IAddressTransactionQuery
  ) => Promise<void>;
  blockInit: (
    chainId?: string,
    addressId?: string,
    options?: IAddressHistoryQuery
  ) => Promise<void>;
  setBlockParameters: (options: IAddressHistoryQuery) => boolean;
  setTransactionParameters: (options: IAddressTransactionQuery) => boolean;
  isBlockInit: boolean;
  isTransactionInit: boolean;
  isAddressBriefInit: boolean;
  addressBrief: IAddressBrief;
  addressBriefLoading: boolean;
  addressBriefInit: (chainId?: string, addressId?: string) => Promise<void>;
}

export const AddressDetailsContext = createContext<IAddressDetailsContext>({
  transactions: {transactions: [], transactionCount: 0, totalPage: 0},
  producedBlocks: {
    blockData: [],
    blockCount: 0,
    totalPage: 0,
  },
  clickBlockPagination: () => Promise.resolve(),
  blocksLoading: false,
  clickBlockSortingMenu: () => Promise.resolve(),
  blocksOrder: TimeSortingType.DESC,
  blocksPage: DEFAULT_PAGE,
  blocksOffset: ITEM_PER_PAGE,
  blocksStart: 0,
  blocksEnd: Date.now(),
  clickBlockDatePicker: () => Promise.resolve(),
  transactionsLoading: false,
  transactionsOrder: TimeSortingType.DESC,
  transactionsPage: DEFAULT_PAGE,
  transactionsOffset: ITEM_PER_PAGE,
  transactionsStart: 0,
  transactionsEnd: Date.now(),
  clickTransactionPagination: () => Promise.resolve(),
  clickTransactionSortingMenu: () => Promise.resolve(),
  clickTransactionDatePicker: () => Promise.resolve(),
  transactionInit: () => Promise.resolve(),
  blockInit: () => Promise.resolve(),
  setBlockParameters: () => false,
  setTransactionParameters: () => false,
  isBlockInit: false,
  isTransactionInit: false,
  isAddressBriefInit: false,
  addressBrief: {} as IAddressBrief,
  addressBriefLoading: false,
  addressBriefInit: () => Promise.resolve(),
});

export const AddressDetailsProvider = ({children}: IAddressDetailsProvider) => {
  const marketCtx = useContext(MarketContext);
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactions, setTransactions, transactionsRef] = useStateRef<ITransactionData>({
    transactions: [],
    transactionCount: 0,
    totalPage: 0,
  });
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [producedBlocks, setProducedBlocks, producedBlocksRef] = useStateRef<IProducedBlock>({
    blockData: [],
    blockCount: 0,
    totalPage: 0,
  });
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [blocksLoading, setBlocksLoading, blocksLoadingRef] = useStateRef(false);
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [blocksOrder, setBlocksOrder, blocksOrderRef] = useStateRef<TimeSortingType>(
    TimeSortingType.DESC
  );
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [blocksPage, setBlocksPage, blocksPageRef] = useStateRef(DEFAULT_PAGE);
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [blocksOffset, setBlocksOffset, blocksOffsetRef] = useStateRef(ITEM_PER_PAGE);
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [blocksStart, setBlocksStart, blocksStartRef] = useStateRef(0);
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [blocksEnd, setBlocksEnd, blocksEndRef] = useStateRef(Date.now());
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactionsLoading, setTransactionsLoading, transactionsLoadingRef] = useStateRef(false);
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactionsOrder, setTransactionsOrder, transactionsOrderRef] =
    useStateRef<TimeSortingType>(TimeSortingType.DESC);
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactionsPage, setTransactionsPage, transactionsPageRef] = useStateRef(DEFAULT_PAGE);
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactionsOffset, setTransactionsOffset, transactionsOffsetRef] =
    useStateRef(ITEM_PER_PAGE);
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactionsStart, setTransactionsStart, transactionsStartRef] = useStateRef(0);
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactionsEnd, setTransactionsEnd, transactionsEndRef] = useStateRef(Date.now());
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isBlockInit, setIsBlockInit, isBlockInitRef] = useStateRef(false);
  // Info: for the use of useStateRef (20240216 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTransactionInit, setIsTransactionInit, isTransactionInitRef] = useStateRef(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAddressBriefInit, setIsAddressBriefInit, isAddressBriefInitRef] = useStateRef(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addressBrief, setAddressBrief, addressBriefRef] = useStateRef<IAddressBrief>(
    {} as IAddressBrief
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addressBriefLoading, setAddressBriefLoading, addressBriefLoadingRef] = useStateRef(false);

  const router = useRouter();
  const {query} = router;

  const clickTransactionPagination = async (
    options: IPaginationOptions,
    chainId?: string,
    addressId?: string
  ) => {
    setTransactionsLoading(true);
    setTransactionsPage(options.page);
    setTransactionsOffset(options.offset);

    //const {page, offset, sort: order} = options;
    const chainIdForTransaction = chainId || (query.chainId?.toString() ?? '');
    const addressIdForTransaction = addressId || (query.addressId?.toString() ?? '');

    const transactionData = await marketCtx.getAddressRelatedTransactions(
      chainIdForTransaction,
      addressIdForTransaction,
      options
    );
    setTransactions(() => {
      return {...transactionsRef.current, ...transactionData};
    });
    setTransactionsLoading(false);
  };

  const clickTransactionSortingMenu = async (order: TimeSortingType) => {
    setTransactionsOrder(order);
    setTransactionsLoading(true);
    const transactionData = await marketCtx.getAddressRelatedTransactions(
      query.chainId?.toString() ?? '',
      query.addressId?.toString() ?? '',
      {
        page: transactionsPageRef.current,
        offset: transactionsOffsetRef.current,
        sort: order,
      }
    );
    setTransactions(transactionData);
    setTransactionsLoading(false);
  };

  const clickTransactionDatePicker = async (start: number, end: number) => {
    const startSeconds = convertMillisecondsToSeconds(start);
    const endSeconds = convertMillisecondsToSeconds(end);
    setTransactionsLoading(true);
    const transactionData = await marketCtx.getAddressRelatedTransactions(
      query.chainId?.toString() ?? '',
      query.addressId?.toString() ?? '',
      {
        page: transactionsPageRef.current,
        offset: transactionsOffsetRef.current,
        sort: transactionsOrderRef.current,
        start_date: startSeconds,
        end_date: endSeconds,
      }
    );
    setTransactions(transactionData);
    setTransactionsLoading(false);
  };

  const setBlockParameters = (options: IAddressHistoryQuery) => {
    setBlocksPage(options.page);
    setBlocksOffset(options.offset);
    setBlocksOrder(options.sort);
    setBlocksStart(options.start_date || 0);
    setBlocksEnd(options.end_date || Date.now());
    return true;
  };

  const setTransactionParameters = (options: IAddressTransactionQuery) => {
    setTransactionsPage(options.page);
    setTransactionsOffset(options.offset);
    setTransactionsOrder(options.sort);
    setTransactionsStart(options.start_date || 0);
    setTransactionsEnd(options.end_date || Date.now());
    return true;
  };

  const clickBlockDatePicker = async (start: number, end: number) => {
    const startSeconds = convertMillisecondsToSeconds(start);
    const endSeconds = convertMillisecondsToSeconds(end);
    setBlocksLoading(true);
    const blockData = await marketCtx.getAddressProducedBlocks(
      query.chainId?.toString() ?? '',
      query.addressId?.toString() ?? '',
      {
        page: blocksPageRef.current,
        offset: blocksOffsetRef.current,
        sort: blocksOrderRef.current,
        start_date: startSeconds,
        end_date: endSeconds,
      }
    );

    // TODO: develop the logic to get the data (20240207 - Shirley)
    setProducedBlocks(blockData);
    setBlocksLoading(false);
  };

  const clickBlockPagination = async (
    options: IAddressHistoryQuery,
    chainId?: string,
    addressId?: string
  ) => {
    setBlocksLoading(true);
    setBlocksPage(options.page);
    setBlocksOffset(options.offset);

    const chainIdForBlock = chainId || (query.chainId?.toString() ?? '');
    const addressIdForBlock = addressId || (query.addressId?.toString() ?? '');

    const blockData = await marketCtx.getAddressProducedBlocks(
      chainIdForBlock,
      addressIdForBlock,
      options
    );

    setProducedBlocks(() => {
      return {...producedBlocksRef.current, ...blockData};
    });
    setBlocksLoading(false);
  };

  const clickBlockSortingMenu = async (order: TimeSortingType) => {
    setBlocksOrder(order);
    setBlocksLoading(true);
    const blockData = await marketCtx.getAddressProducedBlocks(
      query.chainId?.toString() ?? '',
      query.addressId?.toString() ?? '',
      {
        page: blocksPageRef.current,
        offset: blocksOffsetRef.current,
        sort: order,
      }
    );
    setProducedBlocks(blockData);
    setBlocksLoading(false);
  };

  const addressBriefInit = async (chainId?: string, addressId?: string) => {
    if (isAddressBriefInitRef.current) return;
    try {
      setAddressBriefLoading(true);
      const addressData = await marketCtx.getAddressBrief(
        chainId || (query.chainId?.toString() ?? ''),
        addressId || (query.addressId?.toString() ?? '')
      );

      setAddressBrief(addressData);
      setIsAddressBriefInit(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('addressBriefInit', error);
    } finally {
      setAddressBriefLoading(false);
    }
  };

  const blockInit = async (
    chainId?: string,
    addressId?: string,
    options?: IAddressHistoryQuery
  ) => {
    if (isBlockInitRef.current) return;
    try {
      setBlocksLoading(true);
      const blockData = await marketCtx.getAddressProducedBlocks(
        chainId || (query.chainId?.toString() ?? ''),
        addressId || (query.addressId?.toString() ?? ''),
        options || {
          page: DEFAULT_PAGE,
          offset: ITEM_PER_PAGE,
          sort: TimeSortingType.DESC,
        }
      );
      setProducedBlocks(blockData);
      setIsBlockInit(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('blockInit', error);
    } finally {
      setBlocksLoading(false);
    }
  };

  const transactionInit = async (
    chainId?: string,
    addressId?: string,
    options?: IAddressTransactionQuery
  ) => {
    if (isTransactionInitRef.current) return;

    try {
      setTransactionsLoading(true);
      const transactionData = await marketCtx.getAddressRelatedTransactions(
        chainId || (query.chainId?.toString() ?? ''),
        addressId || (query.addressId?.toString() ?? ''),
        options || {
          page: DEFAULT_PAGE,
          offset: ITEM_PER_PAGE,
          sort: TimeSortingType.DESC,
        }
      );
      setTransactions(transactionData);

      setIsTransactionInit(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('transactionInit', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const defaultValue = {
    transactions: transactionsRef.current,
    producedBlocks: producedBlocksRef.current,
    transactionInit,
    blockInit,

    blocksLoading: blocksLoadingRef.current,
    blocksOrder: blocksOrderRef.current,
    blocksPage: blocksPageRef.current,
    blocksOffset: blocksOffsetRef.current,
    blocksStart: blocksStartRef.current,
    blocksEnd: blocksEndRef.current,

    clickBlockPagination,
    clickBlockSortingMenu,
    clickBlockDatePicker,

    transactionsLoading: transactionsLoadingRef.current,
    transactionsOrder: transactionsOrderRef.current,
    transactionsPage: transactionsPageRef.current,
    transactionsOffset: transactionsOffsetRef.current,
    transactionsStart: transactionsStartRef.current,
    transactionsEnd: transactionsEndRef.current,

    clickTransactionPagination,
    clickTransactionSortingMenu,
    clickTransactionDatePicker,

    setBlockParameters,
    setTransactionParameters,

    isBlockInit: isBlockInitRef.current,
    isTransactionInit: isTransactionInitRef.current,

    isAddressBriefInit: isAddressBriefInitRef.current,
    addressBrief: addressBriefRef.current,
    addressBriefLoading: addressBriefLoadingRef.current,
    addressBriefInit,
  };

  return (
    <AddressDetailsContext.Provider value={defaultValue}>{children}</AddressDetailsContext.Provider>
  );
};

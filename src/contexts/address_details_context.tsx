import React, {createContext, useContext, useEffect, useState} from 'react';
import {ITransaction} from '../interfaces/transaction';
import {IProducedBlock} from '../interfaces/block';
import useStateRef from 'react-usestateref';
import {MarketContext} from './market_context';
import {
  IAddressProducedBlocksQuery,
  IPaginationOptions,
  SortingType,
} from '../constants/api_request';
import {DEFAULT_PAGE, ITEM_PER_PAGE} from '../constants/config';
import {useRouter} from 'next/router';
import {convertMillisecondsToSeconds} from '../lib/common';

export interface IAddressDetailsProvider {
  children: React.ReactNode;
}

export const AddressDetailsContext = createContext<IAddressDetailsContext>({
  transactions: [],
  producedBlocks: {
    blockData: [],
    blockCount: 0,
  },
  clickBlockPagination: async () => {},
  init: async () => {},
  blocksLoading: false,
  clickSortingMenu: async () => {},
  blocksOrder: SortingType.DESC,
  blocksPage: DEFAULT_PAGE,
  blocksOffset: ITEM_PER_PAGE,
  blocksStart: 0,
  blocksEnd: Date.now(),
  clickDatePicker: async () => {},
});

export interface IAddressDetailsContext {
  transactions: ITransaction[];
  producedBlocks: IProducedBlock;
  clickBlockPagination: (
    options: IAddressProducedBlocksQuery,
    chainId?: string,
    addressId?: string
  ) => Promise<void>;
  init: (
    chainId: string,
    addressId: string,
    options?: IAddressProducedBlocksQuery
  ) => Promise<void>;
  blocksLoading: boolean;
  clickSortingMenu: (order: SortingType) => Promise<void>;
  blocksOrder: SortingType;
  blocksPage: number;
  blocksOffset: number;
  blocksStart: number;
  blocksEnd: number;
  clickDatePicker: (start: number, end: number) => Promise<void>;
}

// Create the context provider component
export const AddressDetailsProvider = ({children}: IAddressDetailsProvider) => {
  const marketCtx = useContext(MarketContext);
  const [transactions, setTransactions, transactionsRef] = useStateRef<ITransaction[]>([]);
  const [producedBlocks, setProducedBlocks, producedBlocksRef] = useStateRef<IProducedBlock>({
    blockData: [],
    blockCount: 0,
  });

  const [blocksLoading, setBlocksLoading, blocksLoadingRef] = useStateRef(false);
  const [blocksOrder, setBlocksOrder, blocksOrderRef] = useStateRef<SortingType>(SortingType.DESC);
  const [blocksPage, setBlocksPage, blocksPageRef] = useStateRef(DEFAULT_PAGE);
  const [blocksOffset, setBlocksOffset, blocksOffsetRef] = useStateRef(ITEM_PER_PAGE);
  const [blocksStart, setBlocksStart, blocksStartRef] = useStateRef(0);
  const [blocksEnd, setBlocksEnd, blocksEndRef] = useStateRef(Date.now());

  const router = useRouter();
  const {query} = router;

  const clickDatePicker = async (start: number, end: number) => {
    const startSeconds = convertMillisecondsToSeconds(start);
    const endSeconds = convertMillisecondsToSeconds(end);
    setBlocksLoading(true);
    const blockData = await marketCtx.getAddressProducedBlocks(
      query.chainId?.toString() ?? '',
      query.addressId?.toString() ?? '',
      {
        page: blocksPageRef.current,
        offset: blocksOffsetRef.current,
        order: blocksOrderRef.current,
        begin: startSeconds,
        end: endSeconds,
      }
    );

    console.log('startSeconds', startSeconds, 'endSeconds', endSeconds, 'blockData', blockData);
    setProducedBlocks(blockData);
    setBlocksLoading(false);
  };

  const clickBlockPagination = async (
    options: IAddressProducedBlocksQuery,
    chainId?: string,
    addressId?: string
  ) => {
    setBlocksLoading(true);
    setBlocksPage(options.page);
    setBlocksOffset(options.offset);

    const {page, offset, order} = options;
    const chainIdForBlock = chainId || (query.chainId?.toString() ?? '');
    const addressIdForBlock = addressId || (query.addressId?.toString() ?? '');

    const blockData = await marketCtx.getAddressProducedBlocks(
      chainIdForBlock,
      addressIdForBlock,
      options
    );
    setProducedBlocks(prev => {
      return {...producedBlocksRef.current, ...blockData};
    });
    setBlocksLoading(false);
  };

  const clickSortingMenu = async (order: SortingType) => {
    setBlocksOrder(order);
    setBlocksLoading(true);
    const blockData = await marketCtx.getAddressProducedBlocks(
      query.chainId?.toString() ?? '',
      query.addressId?.toString() ?? '',
      {
        page: blocksPageRef.current,
        offset: blocksOffsetRef.current,
        order: order,
      }
    );
    console.log('order in clickSortingMenu in context', order);
    setProducedBlocks(blockData);
    setBlocksLoading(false);
  };

  const init = async (
    chainId: string,
    addressId: string,
    options?: IAddressProducedBlocksQuery
  ) => {
    const blockData = await marketCtx.getAddressProducedBlocks(
      chainId,
      addressId,
      options || {
        page: DEFAULT_PAGE,
        offset: ITEM_PER_PAGE,
        order: SortingType.DESC,
        // query: {
        //   block_id: 373842,
        // },

        begin: 0,
        end: Date.now(),
      }
    );

    setProducedBlocks(blockData);

    // const transactionsData = await marketCtx.getAddressTransactions(
    //   '8017',
    //   '0x048adee1b0e93b30f9f7b71f18b963ca9ba5de3b',
    //   {
    //     page: 1,
    //     offset: 20,
    //     order: 'desc',
    //   }
    // );
    // setTransactions(transactionsData);
  };

  useEffect(() => {
    if (query.chainId && query.addressId) {
      init(query.chainId as string, query.addressId as string);
    }
  }, [query.chainId, query.addressId]);

  const defaultValue = {
    transactions: transactionsRef.current,
    producedBlocks: producedBlocksRef.current,
    init,

    blocksLoading: blocksLoadingRef.current,
    blocksOrder: blocksOrderRef.current,
    blocksPage: blocksPageRef.current,
    blocksOffset: blocksOffsetRef.current,
    blocksStart: blocksStartRef.current,
    blocksEnd: blocksEndRef.current,

    clickBlockPagination,
    clickSortingMenu,
    clickDatePicker,
  };

  return (
    <AddressDetailsContext.Provider value={defaultValue}>{children}</AddressDetailsContext.Provider>
  );
};

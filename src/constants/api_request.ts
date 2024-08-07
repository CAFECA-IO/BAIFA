import {TBD_API_URL, TBD_API_VERSION, BFA_API_URL, BFA_API_VERSION} from '@/constants/config';

export type IAPIName =
  | 'BALANCE_SHEET'
  | 'COMPREHENSIVE_INCOME_STATEMENTS'
  | 'STATEMENTS_OF_CASH_FLOWS'
  | 'STATEMENTS_OF_RED_FLAGS'
  | 'EXCHANGE_RATES'
  | 'PROMOTION'
  | 'SEARCH_SUGGESTIONS'
  | 'SEARCH_RESULT'
  | 'CHAINS';

export enum SortingType {
  TIME = 'time',
}

export enum TimeSortingType {
  ASC = 'asc',
  DESC = 'desc',
}
export interface IPaginationOptions {
  sort: TimeSortingType.ASC | TimeSortingType.DESC;
  page: number;
  offset: number;
}

export interface IAddressHistoryQuery extends IPaginationOptions {
  query?: {
    block_id: number;
  };
  start_date?: number;
  end_date?: number;
}

export interface IAddressTransactionQuery extends IPaginationOptions {
  query?: {
    from_address: string;
    to_address: string;
    tx: number;
  };
  start_date?: number;
  end_date?: number;
}

export interface IAPINameConstant {
  BALANCE_SHEET: IAPIName;
  COMPREHENSIVE_INCOME_STATEMENTS: IAPIName;
  STATEMENTS_OF_CASH_FLOWS: IAPIName;
  EXCHANGE_RATES: IAPIName;
  //STATEMENTS_OF_RED_FLAGS: IAPIName;

  PROMOTION: IAPIName;
  SEARCH_SUGGESTIONS: IAPIName;
  SEARCH_RESULT: IAPIName;
  CHAINS: IAPIName;
}

export const APIName: IAPINameConstant = {
  BALANCE_SHEET: 'BALANCE_SHEET',
  COMPREHENSIVE_INCOME_STATEMENTS: 'COMPREHENSIVE_INCOME_STATEMENTS',
  STATEMENTS_OF_CASH_FLOWS: 'STATEMENTS_OF_CASH_FLOWS',
  EXCHANGE_RATES: 'EXCHANGE_RATES',

  PROMOTION: 'PROMOTION',
  SEARCH_SUGGESTIONS: 'SEARCH_SUGGESTIONS',
  SEARCH_RESULT: 'SEARCH_RESULT',
  CHAINS: 'CHAINS',
};

export const APIURL = {
  BALANCE_SHEET: `${TBD_API_URL}/${TBD_API_VERSION}/balance_sheet`,
  COMPREHENSIVE_INCOME_STATEMENTS: `${TBD_API_URL}/${TBD_API_VERSION}/comprehensive_income`,
  STATEMENTS_OF_CASH_FLOWS: `${TBD_API_URL}/${TBD_API_VERSION}/cash_flow`,
  EXCHANGE_RATES: `${TBD_API_URL}/${TBD_API_VERSION}/exchange-rates`,

  PROMOTION: `${BFA_API_URL}/${BFA_API_VERSION}/app`,
  SEARCH_SUGGESTIONS: `${BFA_API_URL}/${BFA_API_VERSION}/app/suggestions`,
  SEARCH_RESULT: `${BFA_API_URL}/${BFA_API_VERSION}/app/search`,
  CHAINS: `${BFA_API_URL}/${BFA_API_VERSION}/app/chains`,
  CURRENCIES: `${BFA_API_URL}/${BFA_API_VERSION}/app/currencies`,
  BLACKLIST: `${BFA_API_URL}/${BFA_API_VERSION}/app/blacklist`,
  RED_FLAGS: `${BFA_API_URL}/${BFA_API_VERSION}/app/red_flags`,

  WEBSITE_RESERVE: 'https://api.tidebit-defi.com/public/reserve',
};

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export interface RequestOptions {
  method: HttpMethod;
  body?: any; // TODO: enumerate all parameters of API (20240311 - Shirley)
}

export interface FetcherResponse<Data> {
  data: Data | undefined;
  isLoading: boolean;
  error: Error | null;
}

export interface QueryParams {
  [key: string]: string | number;
}

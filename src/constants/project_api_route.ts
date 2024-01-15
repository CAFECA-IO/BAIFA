import {TBD_API_URL, TBD_API_VERSION} from './config';

interface IProjectIdToApiRoute {
  [key: string]: {
    BALANCE_SHEET: string;
    COMPREHENSIVE_INCOME_STATEMENTS: string;
    STATEMENTS_OF_CASH_FLOWS: string;
    EXCHANGE_RATES: string;
  };
}

export const API_ROUTES: IProjectIdToApiRoute = {
  TBDJH4gK8Lp0Z: {
    BALANCE_SHEET: `${TBD_API_URL}/${TBD_API_VERSION}/balance`,
    COMPREHENSIVE_INCOME_STATEMENTS: `${TBD_API_URL}/${TBD_API_VERSION}/comprehensive_income`,
    STATEMENTS_OF_CASH_FLOWS: `${TBD_API_URL}/${TBD_API_VERSION}/cash_flow`,
    EXCHANGE_RATES: `${TBD_API_URL}/${TBD_API_VERSION}/exchange-rates`,
  },
  bfa: {
    BALANCE_SHEET: `https://baifa.io/api/balance`,
    COMPREHENSIVE_INCOME_STATEMENTS: `https://baifa.io/api/comprehensive_income`,
    STATEMENTS_OF_CASH_FLOWS: `https://baifa.io/api/cash_flow`,
    EXCHANGE_RATES: `https://baifa.io/api/exchange-rates`,
  },
};

export const getApiRoute = (projectId: string) => {
  const apiRoute = API_ROUTES[projectId];
  if (!apiRoute) {
    throw new Error(`Project id ${projectId} is not supported`);
  }
  return apiRoute;
};

import {TBD_API_URL, TBD_API_VERSION} from '@/constants/config';

interface IProjectIdToApiRoute {
  [key: string]: {
    BALANCE_SHEET: string;
    COMPREHENSIVE_INCOME_STATEMENTS: string;
    STATEMENTS_OF_CASH_FLOWS: string;
    EXCHANGE_RATES: string;
  };
}

const defaultApiRoute = {
  BALANCE_SHEET: `${TBD_API_URL}/${TBD_API_VERSION}/balance_sheet`,
  COMPREHENSIVE_INCOME_STATEMENTS: `${TBD_API_URL}/${TBD_API_VERSION}/comprehensive_income`,
  STATEMENTS_OF_CASH_FLOWS: `${TBD_API_URL}/${TBD_API_VERSION}/cash_flow`,
  EXCHANGE_RATES: `${TBD_API_URL}/${TBD_API_VERSION}/exchange-rates`,
};

export const API_ROUTES: IProjectIdToApiRoute = {
  TBD: {
    BALANCE_SHEET: `${TBD_API_URL}/${TBD_API_VERSION}/balance_sheet`,
    COMPREHENSIVE_INCOME_STATEMENTS: `${TBD_API_URL}/${TBD_API_VERSION}/comprehensive_income`,
    STATEMENTS_OF_CASH_FLOWS: `${TBD_API_URL}/${TBD_API_VERSION}/cash_flow`,
    EXCHANGE_RATES: `${TBD_API_URL}/${TBD_API_VERSION}/exchange-rates`,
  },
  BFA: {
    BALANCE_SHEET: `${TBD_API_URL}/${TBD_API_VERSION}/balance_sheet`,
    COMPREHENSIVE_INCOME_STATEMENTS: `${TBD_API_URL}/${TBD_API_VERSION}/comprehensive_income`,
    STATEMENTS_OF_CASH_FLOWS: `${TBD_API_URL}/${TBD_API_VERSION}/cash_flow`,
    EXCHANGE_RATES: `${TBD_API_URL}/${TBD_API_VERSION}/exchange-rates`,
  },
};

export const getApiRoute = (projectId: string) => {
  const apiRoute = API_ROUTES[projectId];
  if (!apiRoute) {
    return defaultApiRoute;
  }
  return apiRoute;
};
